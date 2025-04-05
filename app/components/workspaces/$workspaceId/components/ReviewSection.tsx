import React from 'react';

interface Review {
  id: string;
  reviewer: {
    name: string;
    avatar: string;
  };
  date: string;
  rating: number;
  text: string;
  photos?: Array<{
    url: string;
    alt: string;
  }>;
}

interface ReviewSectionProps {
  reviews: Review[];
}

export default function ReviewSection({ reviews }: ReviewSectionProps) {
  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(2);
  };
  
  // Simplified rating categories for demonstration
  const ratingCategories = [
    { name: 'Cleanliness', value: 4.7 },
    { name: 'Comfort', value: 4.6 },
    { name: 'Value', value: 4.9 },
    { name: 'Amenities', value: 4.8 },
    { name: 'Location', value: 4.5 }
  ];
  
  return (
    <div className="reviews-section">
      <div className="review-stats">
        <div className="overall-rating">
          <div className="rating-big">{calculateAverageRating()}</div>
          <div className="rating-stars-big">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i}
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill={i < Math.floor(Number(calculateAverageRating())) ? "#4A6FDC" : "none"} 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
                  stroke="#4A6FDC" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            ))}
          </div>
          <div className="rating-count">{reviews.length} reviews</div>
        </div>
        
        <div className="rating-breakdown">
          {ratingCategories.map((category) => (
            <div key={category.name} className="rating-category">
              <div className="category-name">{category.name}</div>
              <div className="category-bar">
                <div 
                  className="category-fill" 
                  style={{ width: `${(category.value / 5) * 100}%` }}
                ></div>
              </div>
              <div className="category-value">{category.value}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="reviews-list">
        {reviews.map((review) => (
          <div key={review.id} className="review-item">
            <div className="review-header">
              <div className="reviewer">
                <div className="reviewer-avatar">
                  {review.reviewer.avatar}
                </div>
                <div className="reviewer-info">
                  <div className="reviewer-name">{review.reviewer.name}</div>
                  <div className="review-date">{review.date}</div>
                </div>
              </div>
              <div className="review-rating">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i}
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill={i < Math.floor(review.rating) ? "#4A6FDC" : "none"} 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
                      stroke="#4A6FDC" 
                      strokeWidth="1.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                ))}
              </div>
            </div>
            <div className="review-content">
              <p>{review.text}</p>
            </div>
            {review.photos && review.photos.length > 0 && (
              <div className="review-photos">
                {review.photos.map((photo, index) => (
                  <img 
                    key={index} 
                    src={photo.url} 
                    alt={photo.alt} 
                    className="review-photo" 
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}