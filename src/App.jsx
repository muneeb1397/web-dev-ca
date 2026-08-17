import React from 'react';
import { useNavigation } from './context/NavigationContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import AddProduct from './pages/AddProduct';
import Analytics from './pages/Analytics';

function App() {
  const { route, mainRef } = useNavigation();

  // Render current route view
  const renderView = () => {
    switch (route) {
      case 'home':
        return <Home />;
      case 'product-detail':
        return <ProductDetail />;
      case 'add-product':
        return <AddProduct />;
      case 'analytics':
        return <Analytics />;
      default:
        return <Home />;
    }
  };

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Header />
      <div 
        ref={mainRef}
        className="container" 
        style={{ flex: 1, outline: 'none' }} 
        tabIndex="-1"
      >
        {renderView()}
      </div>
      <Footer />
    </>
  );
}

export default App;
