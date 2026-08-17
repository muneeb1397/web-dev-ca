import React, { useState, useEffect, useRef } from 'react';
import { useNavigation } from '../context/NavigationContext';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const { registerAbortController, unregisterAbortController } = useNavigation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  
  const searchTimeoutRef = useRef(null);

  // Load categories on mount
  useEffect(() => {
    const controller = new AbortController();
    registerAbortController(controller);

    fetch('https://dummyjson.com/products/categories', { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load categories');
        return res.json();
      })
      .then((data) => {
        // dummyjson.com returns array of category objects or strings
        const categoryNames = data.map(cat => typeof cat === 'object' ? cat.slug : cat);
        setCategories(categoryNames.slice(0, 10)); // take first 10
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('Error fetching categories:', err);
        }
      })
      .finally(() => {
        unregisterAbortController(controller);
      });
  }, []);

  // Fetch products
  const fetchProducts = (query = '', cat = '') => {
    setLoading(true);
    setError(null);

    const controller = new AbortController();
    registerAbortController(controller);

    let url = 'https://dummyjson.com/products?limit=24';
    if (query) {
      url = `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`;
    } else if (cat) {
      url = `https://dummyjson.com/products/category/${cat}`;
    }

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load products. Please check your network connection.');
        return res.json();
      })
      .then((data) => {
        setProducts(data.products || []);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Something went wrong');
        }
      })
      .finally(() => {
        setLoading(false);
        unregisterAbortController(controller);
      });
  };

  // Initial fetch and dependency handler
  useEffect(() => {
    // If search is empty or changed, we debounce search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (search) {
      setLoading(true);
      searchTimeoutRef.current = setTimeout(() => {
        fetchProducts(search, '');
      }, 500); // 500ms debounce
    } else {
      fetchProducts('', category);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [search, category]);

  const handleRetry = () => {
    fetchProducts(search, category);
  };

  return (
    <div>
      <section className="hero">
        <h1 className="gradient-text">Discover Premium Aesthetics</h1>
        <p>Explore our curated catalog of high-quality products. Filter by category, search instantly, and experience smooth routing.</p>
      </section>

      <div className="search-filter-bar">
        <div className="search-input-wrapper">
          <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="search"
            placeholder="Search products..."
            className="search-input"
            aria-label="Search products"
            value={search}
            onChange={(e) => {
              setCategory('');
              setSearch(e.target.value);
            }}
          />
        </div>

        <select
          className="filter-select"
          aria-label="Filter by Category"
          value={category}
          onChange={(e) => {
            setSearch('');
            setCategory(e.target.value);
          }}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </option>
          ))}
        </select>
      </div>

      <main id="main-content">
        {loading ? (
          <div className="state-container" aria-live="polite">
            <div className="spinner" aria-hidden="true"></div>
            <h2 className="status-title">Loading catalog...</h2>
            <p className="status-desc">Fetching premium items from our secure cloud server.</p>
          </div>
        ) : error ? (
          <div className="state-container" role="alert">
            <svg className="status-icon error" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h2 className="status-title">Catalog fetch failed</h2>
            <p className="status-desc">{error}</p>
            <button onClick={handleRetry} className="btn btn-primary" style={{ maxWidth: '200px' }}>
              Retry Connection
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="state-container" aria-live="polite">
            <svg className="status-icon" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
            <h2 className="status-title">No products found</h2>
            <p className="status-desc">We couldn't find any products matching your search term.</p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
