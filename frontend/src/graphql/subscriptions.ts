import { gql } from '@apollo/client';

// Subscription for order notifications
export const NOTIFICATION_SUBSCRIPTION = gql`
  subscription OnNotificationReceived {
    onNotificationReceived {
      id
      userId
      title
      message
      type
      priority
      isRead
      actionUrl
      actionText
      imageUrl
      createdAt
    }
  }
`;
