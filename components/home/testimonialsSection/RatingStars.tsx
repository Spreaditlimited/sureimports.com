import React from 'react';

interface RatingReviewProps {
  rating: number;
}

const RatingStars: React.FC<RatingReviewProps> = ({ rating }) => {
  return (
    <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className="star"
          style={{
            cursor: 'pointer',
            color: rating >= star ? 'gold' : 'gray',
            fontSize: '35px',
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default RatingStars;
