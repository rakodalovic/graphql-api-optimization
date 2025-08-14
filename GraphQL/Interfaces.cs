namespace GraphQLApi.GraphQL;

/// <summary>
/// Interface for entities that have a unique identifier
/// </summary>
public interface IEntityNode
{
    /// <summary>
    /// Unique identifier for the entity
    /// </summary>
    int Id { get; set; }
}

/// <summary>
/// Interface for entities that track creation and modification timestamps
/// </summary>
public interface IAuditable
{
    /// <summary>
    /// Timestamp when the entity was created
    /// </summary>
    DateTime CreatedAt { get; set; }

    /// <summary>
    /// Timestamp when the entity was last updated
    /// </summary>
    DateTime? UpdatedAt { get; set; }
}