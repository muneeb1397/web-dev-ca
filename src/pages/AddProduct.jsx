import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';

export default function AddProduct() {
  const { navigate, registerAbortController, unregisterAbortController } = useNavigation();
  
  // Form fields
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  
  // Errors & States
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [optimisticProduct, setOptimisticProduct] = useState(null);

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Product title is required';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(price) || Number(price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }

    if (!category) {
      newErrors.category = 'Please select a category';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    } else if (description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    const newProduct = {
      title,
      price: Number(price),
      category,
      description,
      thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60',
      rating: 5.0,
      stock: 50,
      id: Date.now() // temporary optimistic ID
    };

    // Optimistic UI: render the new product immediately before waiting for the network roundtrip
    setOptimisticProduct(newProduct);
    setToastMessage('Submitting product...');

    const controller = new AbortController();
    registerAbortController(controller);

    fetch('https://dummyjson.com/products/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        price: Number(price),
        category,
        description
      }),
      signal: controller.signal
    })
      .then((res) => {
        if (!res.ok) throw new Error('Network error. Failed to add product to API.');
        return res.json();
      })
      .then((data) => {
        setToastMessage('Product successfully synced to server database!');
        // Clear form fields
        setTitle('');
        setPrice('');
        setCategory('');
        setDescription('');
        
        // Clear toast after 4 seconds
        setTimeout(() => {
          setToastMessage(null);
          setOptimisticProduct(null);
          navigate('#/');
        }, 3000);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error(err);
          setToastMessage('Failed to sync with API. Retaining optimistic changes.');
          setTimeout(() => setToastMessage(null), 4000);
        }
      })
      .finally(() => {
        setSubmitting(false);
        unregisterAbortController(controller);
      });
  };

  return (
    <div>
      <section className="hero">
        <h1 className="gradient-text">List a New Product</h1>
        <p>Fill out the form below. Experience instant validation, loading states, and optimistic database synchronization.</p>
      </section>

      <main id="main-content" className="form-container">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="title" className="form-label">Product Title</label>
            <input
              id="title"
              type="text"
              className="form-control"
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? "title-error" : undefined}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Premium Mechanical Keyboard"
              disabled={submitting}
            />
            {errors.title && <div id="title-error" className="form-error">{errors.title}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="price" className="form-label">Price (USD)</label>
            <input
              id="price"
              type="number"
              className="form-control"
              aria-invalid={!!errors.price}
              aria-describedby={errors.price ? "price-error" : undefined}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 99.99"
              disabled={submitting}
            />
            {errors.price && <div id="price-error" className="form-error">{errors.price}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="category" className="form-label">Category</label>
            <select
              id="category"
              className="form-control"
              aria-invalid={!!errors.category}
              aria-describedby={errors.category ? "category-error" : undefined}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={submitting}
            >
              <option value="">Select Category</option>
              <option value="beauty">Beauty</option>
              <option value="fragrances">Fragrances</option>
              <option value="furniture">Furniture</option>
              <option value="groceries">Groceries</option>
            </select>
            {errors.category && <div id="category-error" className="form-error">{errors.category}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              id="description"
              className="form-control"
              rows="4"
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? "description-error" : undefined}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a detailed description of features and specs..."
              disabled={submitting}
            ></textarea>
            {errors.description && <div id="description-error" className="form-error">{errors.description}</div>}
          </div>

          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? (
              <>
                <div className="spinner" style={{ width: '20px', height: '20px', margin: 0, borderWidth: '2px' }} aria-hidden="true"></div>
                Saving...
              </>
            ) : 'Publish Product'}
          </button>
        </form>
      </main>

      {/* Optimistic Preview Section */}
      {optimisticProduct && (
        <section className="form-container" style={{ borderStyle: 'dashed', borderColor: 'var(--accent-yellow)', marginTop: '-40px', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary)', marginBottom: '16px', textAlign: 'left' }}>
            ⚡ Optimistic Preview (Client Live Render)
          </h2>
          <div style={{ display: 'flex', gap: '20px', textAlign: 'left', alignItems: 'center' }}>
            <img src={optimisticProduct.thumbnail} alt="" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700' }}>{optimisticProduct.title || 'Untitled'}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Category: {optimisticProduct.category}</p>
              <p style={{ fontSize: '16px', fontWeight: '800', color: 'var(--primary)' }}>${optimisticProduct.price || 0}</p>
            </div>
          </div>
        </section>
      )}

      {/* Success/Pending Toast */}
      {toastMessage && (
        <div className="toast" role="alert" aria-live="assertive">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          {toastMessage}
        </div>
      )}
    </div>
  );
}
