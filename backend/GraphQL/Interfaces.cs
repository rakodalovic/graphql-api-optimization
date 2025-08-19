namespace GraphQLApi.GraphQL;

public interface IEntityNode
{
    int Id { get; set; }
}

public interface IAuditable
{
    DateTime CreatedAt { get; set; }

    DateTime? UpdatedAt { get; set; }
}