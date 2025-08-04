using BlogPlatform.Api.Models;

namespace BlogPlatform.Api.GraphQL;

public class SimpleSubscription
{
    [Subscribe]
    [Topic]
    public Post OnPostPublished([EventMessage] Post post) => post;

    [Subscribe]
    [Topic("{postId}")]
    public Comment OnCommentAdded(int postId, [EventMessage] Comment comment) => comment;
}