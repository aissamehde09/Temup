import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { MatchInteractionProvider } from './context/MatchInteractionContext.jsx';
import { MatchDataProvider } from './context/MatchDataContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import { SocialProvider } from './context/SocialContext.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <MatchDataProvider>
          <NotificationProvider>
            <SocialProvider>
              <MatchInteractionProvider>
                <App />
              </MatchInteractionProvider>
            </SocialProvider>
          </NotificationProvider>
        </MatchDataProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
