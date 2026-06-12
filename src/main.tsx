import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PokedexApp } from './PokedexApp';

import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PokedexApp />
  </StrictMode>
);
