import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { ThemeProvider } from './theme/ThemeProvider';
import { AuthProvider } from './contexts/AuthContext';
import { TranslationProvider } from './contexts/TranslationContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import AppRoutes from './routes';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <AuthProvider>
          <ThemeProvider>
            <ErrorBoundary>
              <AppRoutes />
            </ErrorBoundary>
          </ThemeProvider>
        </AuthProvider>
      </Router>
    </Provider>
  );
};

export default App;