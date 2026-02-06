
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 브라우저 환경에서 process.env.API_KEY 접근 시 ReferenceError 방지
if (typeof window !== 'undefined' && typeof (window as any).process === 'undefined') {
  (window as any).process = {
    env: {
      API_KEY: ''
    }
  };
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
