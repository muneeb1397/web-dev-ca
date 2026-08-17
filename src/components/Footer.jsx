import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <p className="footer-text">
          &copy; {new Date().getFullYear()} Market. All rights reserved.
        </p>
        <p className="footer-text" style={{ fontSize: '12px' }}>
          Built with React, Vite, and custom yellow-green theme. Accessibility and performance optimized.
        </p>
      </div>
    </footer>
  );
}
