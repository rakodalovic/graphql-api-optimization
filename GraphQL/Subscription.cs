using GraphQLApi.Models;
using HotChocolate;
using HotChocolate.Subscriptions;

namespace GraphQLApi.GraphQL;

public class Subscription
{
    // Subscription for when a new order is created
    [Subscribe]
    [Topic("order_created")]
    public Order OnOrderCreated([EventMessage] Order order)
    {
        return order;
    }

    // Subscription for when a new notification is received
    [Subscribe]
    [Topic("notification_received")]
    public Notification OnNotificationReceived([EventMessage] Notification notification)
    {
        return notification;
    }
}