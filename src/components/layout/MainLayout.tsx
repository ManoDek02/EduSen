import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import Navigation from './Navigation';
import { cn } from '@/lib/utils';
import { User } from '@/types/navigation';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const MainLayout = ({ children, title }: MainLayoutProps) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Récupérer l'utilisateur connecté depuis localStorage
    const storedUser = localStorage.getItem('currentUser');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Rediriger vers la page de connexion si aucun utilisateur n'est connecté
      navigate('/');
    }
  }, [navigate]);

  if (!user) {
    return null; // Ou un composant de chargement
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
