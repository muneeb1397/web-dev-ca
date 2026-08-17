import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary'
import { NavigationProvider } from './context/NavigationContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <NavigationProvider>
        <App />
      </NavigationProvider>
    </ErrorBoundary>
  </StrictMode>,
)
