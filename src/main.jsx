import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { GamesProvider } from './context/GamesContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GamesProvider>
      <App />
    </GamesProvider>
  </StrictMode>
);
