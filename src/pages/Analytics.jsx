import React, { useEffect, useState } from 'react';
import { useNavigation } from '../context/NavigationContext';

export default function Analytics() {
  const { registerAbortController, unregisterAbortController } = useNavigation();
  const [stats, setStats] = useState({
    totalProducts: 0,
    categoriesCount: 0,
    averagePrice: 0,
    totalStock: 0
  });
  const [loading, setLoading] = useState(true);
  const [categoryDistribution, setCategoryDistribution] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    registerAbortController(controller);

    fetch('https://dummyjson.com/products?limit=100', { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load metrics');
        return res.json();
      })
      .then((data) => {
        const products = data.products || [];
        
        // Calculate totals
        const total = products.length;
        const priceSum = products.reduce((sum, p) => sum + p.price, 0);
        const stockSum = products.reduce((sum, p) => sum + p.stock, 0);
        
        // Category counts
        const catMap = {};
        products.forEach((p) => {
          catMap[p.category] = (catMap[p.category] || 0) + 1;
        });

        const uniqueCategories = Object.keys(catMap).length;
        const avgPrice = total > 0 ? (priceSum / total).toFixed(2) : 0;

        setStats({
          totalProducts: total,
          categoriesCount: uniqueCategories,
          averagePrice: avgPrice,
          totalStock: stockSum
        });

        // Distribution list
        const dist = Object.entries(catMap)
          .map(([name, count]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            count,
            percentage: Math.round((count / total) * 100)
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5); // top 5 categories

        setCategoryDistribution(dist);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
      })
      .finally(() => {
        setLoading(false);
        unregisterAbortController(controller);
      });
  }, []);

  if (loading) {
    return (
      <div className="state-container" aria-live="polite">
        <div className="spinner" aria-hidden="true"></div>
        <h2 className="status-title">Loading Analytics...</h2>
        <p className="status-desc">Calculating product metrics, category volumes, and market values.</p>
      </div>
    );
  }

  return (
    <div>
      <section className="hero">
        <h1 className="gradient-text">Analytics Dashboard</h1>
        <p>A high-level view of our catalog composition, inventory, and category distribution.</p>
      </section>

      <main id="main-content">
        <div className="analytics-grid">
          <div className="stat-card">
            <span className="stat-label">Total Catalog items</span>
            <div className="stat-val">{stats.totalProducts}</div>
            <div className="stat-trend">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
              </svg>
              +12% vs last month
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-label">Unique Categories</span>
            <div className="stat-val">{stats.categoriesCount}</div>
            <div className="stat-trend" style={{ color: 'var(--accent-green)' }}>
              Healthy mix
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-label">Average Item Price</span>
            <div className="stat-val">${stats.averagePrice}</div>
            <div className="stat-trend">
              Optimal margin
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-label">Warehouse Stock Level</span>
            <div className="stat-val">{stats.totalStock}</div>
            <div className="stat-trend" style={{ color: 'var(--accent-green)' }}>
              In Stock
            </div>
          </div>
        </div>

        <div className="chart-card">
          <h2 className="chart-title">Top 5 Product Categories</h2>
          <div className="bar-chart">
            {categoryDistribution.map((cat) => (
              <div key={cat.name} className="bar-row">
                <span className="bar-name">{cat.name}</span>
                <div className="bar-wrapper" aria-label={`${cat.name} accounts for ${cat.percentage}% of products`}>
                  <div className="bar-fill" style={{ width: `${cat.percentage}%` }}></div>
                </div>
                <span className="bar-val">{cat.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
