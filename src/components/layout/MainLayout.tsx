import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import Navigation from './Navigation';
import { cn } from '@/lib/utils';

type User = {
  matricule: string;
  role: string;
  name: string;
} | null;

type MainLayoutProps = {
  children: React.ReactNode;
  title?: string;
};

const MainLayout = ({ children, title }: MainLayoutProps) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else if (location.pathname !== '/') {
      navigate('/');
    }
  }, [navigate, location]);

  if (location.pathname === '/') {
    return children;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main
        className={cn(
          "min-h-screen transition-all duration-300",
          isMobile ? "ml-0 pt-16" : "ml-72"
        )}
      >
        {title && (
          <div className="bg-[#071E3D] text-white p-4 md:p-6">
            <h1 className="text-xl md:text-2xl font-bold">{title}</h1>
          </div>
        )}
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;