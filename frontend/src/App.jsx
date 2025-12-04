/**
 * App Component
 * Root application component with providers
 */

import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider, useToastContext } from './context/ToastContext';
import { ToastContainer } from './components/common/Toast/Toast';
import router from './router';

// Inner component to access toast context
function AppContent() {
  const { toasts, removeToast } = useToastContext();
  
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
