using GraphQLApi.GraphQL.DataLoaders;
using GraphQLApi.Models;

namespace GraphQLApi.GraphQL.Types;

/// <summary>
/// GraphQL type extensions for User entity to use DataLoaders instead of naive resolvers.
/// This replaces the navigation property access with DataLoader-based resolution.
/// </summary>
[ExtendObjectType<User>]
public class UserTypeExtensions
{
    /// <summary>
    /// Resolves user orders using DataLoader to prevent N+1 queries.
    /// Instead of loading orders individually for each user, this batches the requests.
    /// </summary>
    /// <param name="user">The user entity</param>
    /// <param name="ordersByUserIdDataLoader">DataLoader for batching order queries</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Orders for the user</returns>
    public async Task<IEnumerable<Order>> GetOrdersAsync(
        [Parent] User user,
        OrdersByUserIdDataLoader ordersByUserIdDataLoader,
        CancellationToken cancellationToken)
    {
        return await ordersByUserIdDataLoader.LoadAsync(user.Id, cancellationToken);
    }
}