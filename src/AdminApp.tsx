import { useState } from 'react';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Toaster } from './components/ui/sonner';

interface AdminAppProps {
  onBackToPortfolio: () => void;
}

export default function AdminApp({ onBackToPortfolio }: AdminAppProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
      {isAuthenticated ? (
        <AdminDashboard 
          onLogout={() => setIsAuthenticated(false)}
          onBackToPortfolio={onBackToPortfolio}
        />
      ) : (
        <AdminLogin onLogin={() => setIsAuthenticated(true)} />
      )}
      <Toaster />
    </>
  );
}
