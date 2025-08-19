using GraphQLApi.Data;
using GraphQLApi.Models;
using Microsoft.EntityFrameworkCore;

namespace GraphQLApi.GraphQL.DataLoaders;

/// <summary>
/// DataLoader for batching Order queries by UserId to solve N+1 problem.
/// This loader groups orders by user ID and loads them in a single database query.
/// </summary>
public class OrdersByUserIdDataLoader : GroupedDataLoader<int, Order>
{
    private readonly IDbContextFactory<ApplicationDbContext> _dbContextFactory;

    public OrdersByUserIdDataLoader(
        IDbContextFactory<ApplicationDbContext> dbContextFactory,
        IBatchScheduler batchScheduler,
        DataLoaderOptions? options = null)
        : base(batchScheduler, options)
    {
        _dbContextFactory = dbContextFactory;
    }

    protected override async Task<ILookup<int, Order>> LoadGroupedBatchAsync(
        IReadOnlyList<int> userIds,
        CancellationToken cancellationToken)
    {
        await using var context = await _dbContextFactory.CreateDbContextAsync(cancellationToken);
        
        // Load all orders for the requested user IDs in a single query
        var orders = await context.Orders
            .Where(o => userIds.Contains(o.UserId))
            .OrderBy(o => o.CreatedAt)
            .ToListAsync(cancellationToken);

        // Group the results by UserId for the DataLoader
        return orders.ToLookup(o => o.UserId);
    }
}