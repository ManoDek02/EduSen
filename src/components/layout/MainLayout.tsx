
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import Navigation from './Navigation';
import { cn } from '@/lib/utils';

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main
        className={cn(
          "min-h-screen transition-all duration-300",
          isMobile ? "ml-0 pt-16" : "ml-72"
        )}
      >
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
