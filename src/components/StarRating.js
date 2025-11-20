import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import './StarRating.css';

const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<FaStar key={i} className="star filled" />);
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      stars.push(<FaStarHalfAlt key={i} className="star filled" />);
    } else {
      stars.push(<FaRegStar key={i} className="star empty" />);
    }
  }

  return <div className="star-rating">{stars}</div>;
};

export default StarRating;
