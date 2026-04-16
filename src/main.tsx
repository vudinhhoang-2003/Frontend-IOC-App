import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { initAppStore } from './store/useAppStore';
import './i18n';
import './index.css';

const App = () => {
  useEffect(() => {
    // DEV MODE: inject mock auth để bypass login và tránh 401 redirect
    if (import.meta.env.DEV) {
      const authState = JSON.parse(localStorage.getItem('quawaco-auth') || '{}');
      if (!authState?.state?.isAuthenticated) {
        // Set mock token để API calls không bị 401
        localStorage.setItem('access_token', 'dev-mock-token');
        localStorage.setItem('refresh_token', 'dev-mock-refresh');
      }
    }
    return initAppStore();
  }, []);

  return <RouterProvider router={router} />;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
