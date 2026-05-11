import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import App from './App.jsx';
import FallbackRender from './components/FallbackRender.jsx';
import { ThemeProvider } from './theme/ThemeProvider.jsx'; 

// eslint-disable-next-line react-refresh/only-export-components
function Root() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary fallbackRender={FallbackRender}>
      <Root />
    </ErrorBoundary>
  </React.StrictMode>,
)