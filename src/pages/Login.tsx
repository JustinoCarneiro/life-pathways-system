
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import WelcomeAnimation from '@/components/auth/WelcomeAnimation';

const Login = () => {
  const { user, isLoading } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);

  // Check if this is first time login
  React.useEffect(() => {
    if (user && !hasShownWelcome) {
      const lastLogin = localStorage.getItem('lastLogin');
      if (!lastLogin) {
        setShowWelcome(true);
        localStorage.setItem('lastLogin', new Date().toISOString());
      }
      setHasShownWelcome(true);
    }
  }, [user, hasShownWelcome]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user && !showWelcome) {
    return <Navigate to="/dashboard" replace />;
  }

  if (user && showWelcome) {
    return (
      <WelcomeAnimation
        userName={user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário'}
        onComplete={() => setShowWelcome(false)}
      />
    );
  }

  return <AuthForm />;
};

export default Login;
