import React, { useState, useEffect } from 'react';
import { useNavigation } from '../context/NavigationContext';

export default function ProductDetail() {
  const { params, navigate, registerAbortController, unregisterAbortController } = useNavigation();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProductDetail = () => {
    if (!params.id) return;
    setLoading(true);
    setError(null);

    const controller = new AbortController();
    registerAbortController(controller);

    fetch(`https://dummyjson.com/products/${params.id}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('Product not found or network connection issues.');
        return res.json();
      })
      .then((data) => {
        setProduct(data);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to fetch product details.');
        }
      })
      .finally(() => {
        setLoading(false);
        unregisterAbortController(controller);
      });
  };

  useEffect(() => {
    fetchProductDetail();
  }, [params.id]);

  if (loading) {
    return (
      <div className="state-container" aria-live="polite">
        <div className="spinner" aria-hidden="true"></div>
        <h2 className="status-title">Loading details...</h2>
        <p className="status-desc">Fetching specifications, images, and reviews.</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="state-container" role="alert">
        <svg className="status-icon error" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <h2 className="status-title">Failed to load product</h2>
        <p className="status-desc">{error || 'The requested product could not be loaded.'}</p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => navigate('#/')} className="btn" style={{ background: 'var(--accent-light-green)', color: 'var(--primary)', maxWidth: '150px' }}>
            Go Back
          </button>
          <button onClick={fetchProductDetail} className="btn btn-primary" style={{ maxWidth: '150px' }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px 0' }}>
      <button onClick={() => navigate('#/')} className="back-btn" aria-label="Go back to products catalog">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back to Products
      </button>

      <main id="main-content" className="product-detail-layout">
        <div className="detail-img-container">
          <img
            src={product.images?.[0] || product.thumbnail}
            alt={product.title}
            loading="eager"
            width="500"
            height="375"
          />
        </div>

        <div className="detail-info">
          <span className="detail-category">{product.category}</span>
          <h1 className="detail-title">{product.title}</h1>
          
          <div className="detail-price-rating">
            <span className="detail-price">${product.price}</span>
            <span className="detail-rating" aria-label={`Rated ${product.rating} stars out of 5`}>
              <span className="rating-star" aria-hidden="true">★</span>
              {product.rating}
            </span>
          </div>

          <p className="detail-desc">{product.description}</p>

          <div className="meta-grid">
            <div className="meta-item">
              <span className="meta-label">Brand</span>
              <span className="meta-val">{product.brand || 'Premium Brand'}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Availability</span>
              <span className="meta-val" style={{ color: product.stock > 0 ? 'var(--success)' : 'var(--error)' }}>
                {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Warranty</span>
              <span className="meta-val">{product.warrantyInformation || '1 Year Warranty'}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Return Policy</span>
              <span className="meta-val">{product.returnPolicy || '30-day returns'}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
