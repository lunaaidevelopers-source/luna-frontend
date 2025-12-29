import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Verifica se este ficheiro existe na tua pasta src
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);