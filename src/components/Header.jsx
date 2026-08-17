import React from 'react';
import { useNavigation } from '../context/NavigationContext';

export default function Header() {
  const { route, navigate } = useNavigation();

  return (
    <header className="header">
      <div className="container nav-container">
        <button
          onClick={() => navigate('#/')}
          className="logo"
          aria-label="Market Home"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <span className="logo-icon" aria-hidden="true">A</span>
          <span>Market</span>
        </button>
        <nav role="navigation" aria-label="Main Navigation">
          <ul className="nav-links">
            <li>
              <button
                onClick={() => navigate('#/')}
                className={route === 'home' ? 'active' : ''}
                aria-current={route === 'home' ? 'page' : undefined}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Products
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('#/add-product')}
                className={route === 'add-product' ? 'active' : ''}
                aria-current={route === 'add-product' ? 'page' : undefined}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Add Product
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('#/analytics')}
                className={route === 'analytics' ? 'active' : ''}
                aria-current={route === 'analytics' ? 'page' : undefined}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Analytics
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
