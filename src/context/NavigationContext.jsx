import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const NavigationContext = createContext(null);

export function NavigationProvider({ children }) {
  const [currentHash, setCurrentHash] = useState(window.location.hash || '#/');
  const activeAbortControllers = useRef(new Set());
  const mainRef = useRef(null);

  // Sync hash state with window location hash
  useEffect(() => {
    const handleHashChange = () => {
      // Cancel all in-flight requests for the previous route
      cancelAllRequests();

      setCurrentHash(window.location.hash || '#/');

      // Accessibility: move focus to main layout/skip link on route change
      if (mainRef.current) {
        mainRef.current.focus();
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      cancelAllRequests();
    };
  }, []);

  const navigate = (hash) => {
    window.location.hash = hash;
  };

  const registerAbortController = (controller) => {
    activeAbortControllers.current.add(controller);
  };

  const unregisterAbortController = (controller) => {
    activeAbortControllers.current.delete(controller);
  };

  const cancelAllRequests = () => {
    if (activeAbortControllers.current.size > 0) {
      console.log(`Cancelling ${activeAbortControllers.current.size} in-flight requests on route change.`);
      activeAbortControllers.current.forEach((controller) => {
        try {
          controller.abort();
        } catch (err) {
          console.error(err);
        }
      });
      activeAbortControllers.current.clear();
    }
  };

  // Parse path & parameters
  // Routes:
  // - #/ : Home
  // - #/product/:id : Detail
  // - #/add-product : Form
  // - #/analytics : Dashboard
  let route = 'home';
  let params = {};

  const cleanHash = currentHash.replace(/^#/, '');

  if (cleanHash.startsWith('/product/')) {
    route = 'product-detail';
    params.id = cleanHash.split('/product/')[1];
  } else if (cleanHash === '/add-product') {
    route = 'add-product';
  } else if (cleanHash === '/analytics') {
    route = 'analytics';
  }

  return (
    <NavigationContext.Provider
      value={{
        route,
        params,
        navigate,
        registerAbortController,
        unregisterAbortController,
        mainRef
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
