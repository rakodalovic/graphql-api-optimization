import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PRODUCT_REVIEWS } from '../graphql/queries';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import './ReviewsList.css';

interface Review {
  id: number;
  rating: number;
  title?: string;
  comment?: string;
  isVerifiedPurchase: boolean;
  helpfulVotes: number;
  unhelpfulVotes: number;
  createdAt: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
  };
  reviewImages?: Array<{
    id: number;
    imageUrl: string;
    altText?: string;
  }>;
}

interface ReviewsData {
  reviews: {
    nodes: Review[];
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string;
      endCursor: string;
    };
    totalCount: number;
  };
}

interface ReviewsListProps {
  productId: number;
  initialReviews: Review[];
}

type SortOption = 'newest' | 'oldest' | 'highest_rating' | 'lowest_rating' | 'most_helpful';

const ReviewsList: React.FC<ReviewsListProps> = ({ productId, initialReviews }) => {
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showAllReviews, setShowAllReviews] = useState(false);

  const buildSortOrder = (sort: SortOption) => {
    switch (sort) {
      case 'newest':
        return [{ createdAt: 'DESC' }];
      case 'oldest':
        return [{ createdAt: 'ASC' }];
      case 'highest_rating':
        return [{ rating: 'DESC' }];
      case 'lowest_rating':
        return [{ rating: 'ASC' }];
      case 'most_helpful':
        return [{ helpfulVotes: 'DESC' }];
      default:
        return [{ createdAt: 'DESC' }];
    }
  };

  const { loading, error, data, fetchMore } = useQuery<ReviewsData>(GET_PRODUCT_REVIEWS, {
    variables: {
      productId,
      first: 10,
      order: buildSortOrder(sortBy)
    },
    skip: !showAllReviews,
    fetchPolicy: 'cache-and-network'
  });

  const reviews = showAllReviews ? (data?.reviews.nodes || []) : initialReviews.slice(0, 3);
  const totalCount = showAllReviews ? (data?.reviews.totalCount || 0) : initialReviews.length;
  const hasNextPage = showAllReviews ? (data?.reviews.pageInfo.hasNextPage || false) : false;

  const averageRating = initialReviews.length > 0
    ? initialReviews.reduce((sum, review) => sum + review.rating, 0) / initialReviews.length
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: initialReviews.filter(review => review.rating === rating).length,
    percentage: initialReviews.length > 0 
      ? (initialReviews.filter(review => review.rating === rating).length / initialReviews.length) * 100
      : 0
  }));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number, size: 'small' | 'medium' | 'large' = 'medium') => {
    const stars = [];
    const sizeClass = size === 'small' ? 'star-small' : size === 'large' ? 'star-large' : 'star-medium';
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${sizeClass} ${i <= rating ? 'filled' : 'empty'}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  const handleLoadMore = async () => {
    if (hasNextPage && data?.reviews.pageInfo.endCursor) {
      await fetchMore({
        variables: {
          after: data.reviews.pageInfo.endCursor
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            reviews: {
              ...fetchMoreResult.reviews,
              nodes: [...prev.reviews.nodes, ...fetchMoreResult.reviews.nodes]
            }
          };
        }
      });
    }
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
  };

  const handleShowAllReviews = () => {
    setShowAllReviews(true);
  };

  if (initialReviews.length === 0) {
    return (
      <div className="reviews-section">
        <h2>Customer Reviews</h2>
        <div className="no-reviews">
          <p>No reviews yet. Be the first to review this product!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reviews-section">
      <h2>Customer Reviews</h2>
      
      {/* Reviews Summary */}
      <div className="reviews-summary">
        <div className="rating-overview">
          <div className="average-rating">
            <span className="rating-number">{averageRating.toFixed(1)}</span>
            <div className="rating-stars">
              {renderStars(Math.round(averageRating), 'large')}
            </div>
            <span className="review-count">Based on {totalCount} reviews</span>
          </div>
          
          <div className="rating-distribution">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="rating-bar">
                <span className="rating-label">{rating} star</span>
                <div className="bar-container">
                  <div 
                    className="bar-fill" 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="rating-count">({count})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Controls */}
      {showAllReviews && (
        <div className="reviews-controls">
          <div className="sort-controls">
            <label htmlFor="review-sort">Sort by:</label>
            <select
              id="review-sort"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as SortOption)}
              className="sort-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest_rating">Highest Rating</option>
              <option value="lowest_rating">Lowest Rating</option>
              <option value="most_helpful">Most Helpful</option>
            </select>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="reviews-list">
        {loading && showAllReviews && reviews.length === 0 ? (
          <LoadingSpinner />
        ) : error && showAllReviews ? (
          <ErrorMessage message={error.message} />
        ) : (
          <>
            {reviews.map((review) => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <div className="reviewer-info">
                    <span className="reviewer-name">
                      {review.user.firstName} {review.user.lastName.charAt(0)}.
                    </span>
                    {review.isVerifiedPurchase && (
                      <span className="verified-badge">Verified Purchase</span>
                    )}
                  </div>
                  <div className="review-meta">
                    <div className="review-rating">
                      {renderStars(review.rating, 'small')}
                    </div>
                    <span className="review-date">{formatDate(review.createdAt)}</span>
                  </div>
                </div>
                
                {review.title && (
                  <h4 className="review-title">{review.title}</h4>
                )}
                
                {review.comment && (
                  <p className="review-comment">{review.comment}</p>
                )}
                
                {review.reviewImages && review.reviewImages.length > 0 && (
                  <div className="review-images">
                    {review.reviewImages.map((image) => (
                      <img
                        key={image.id}
                        src={image.imageUrl}
                        alt={image.altText || 'Review image'}
                        className="review-image"
                      />
                    ))}
                  </div>
                )}
                
                <div className="review-footer">
                  <div className="review-votes">
                    <span>Was this helpful?</span>
                    <button className="vote-btn">
                      👍 {review.helpfulVotes}
                    </button>
                    <button className="vote-btn">
                      👎 {review.unhelpfulVotes}
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {!showAllReviews && initialReviews.length > 3 && (
              <div className="show-all-reviews">
                <button onClick={handleShowAllReviews} className="show-all-btn">
                  Show All {totalCount} Reviews
                </button>
              </div>
            )}
            
            {showAllReviews && hasNextPage && (
              <div className="load-more-reviews">
                <button onClick={handleLoadMore} className="load-more-btn" disabled={loading}>
                  {loading ? 'Loading...' : 'Load More Reviews'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewsList;