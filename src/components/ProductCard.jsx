import React from 'react';
import { useNavigation } from '../context/NavigationContext';

export default function ProductCard({ product }) {
  const { navigate } = useNavigation();

  return (
    <div
      onClick={() => navigate(`#/product/${product.id}`)}
      className="product-card"
      role="link"
      tabIndex="0"
      aria-label={`View details of ${product.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate(`#/product/${product.id}`);
        }
      }}
    >
      <div className="card-img-wrapper">
        <span className="card-tag">{product.category}</span>
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          width="300"
          height="225"
        />
      </div>
      <div className="card-body">
        <h3 className="card-title">{product.title}</h3>
        <p className="card-desc">{product.description}</p>
        <div className="card-footer">
          <span className="price">${product.price}</span>
          <span className="rating" aria-label={`Rated ${product.rating} stars out of 5`}>
            <span className="rating-star" aria-hidden="true">★</span>
            {product.rating}
          </span>
        </div>
      </div>
    </div>
  );
}
