import React from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { School, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigation } from "@/hooks/use-navigation";
import { NavItem } from "./NavItem";
import { UserProfile } from "./UserProfile";

const Navigation = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { user, isMenuOpen, setIsMenuOpen, handleLogout, getNavItems } = useNavigation();
  const navItems = getNavItems();

  return (
    <>
      {/* Mobile header with hamburger menu */}
      {isMobile && (
        <div className="flex items-center justify-between p-4 bg-[#0046AD] text-white fixed top-0 left-0 right-0 z-50">
          <div className="flex items-center gap-2">
            <School className="text-white" size={24} />
            <span className="font-medium text-lg">EDUSn</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      )}

      {/* Sidebar navigation */}
      <aside
        className={cn(
          "fixed z-40 top-0 bottom-0 w-72 bg-[#0046AD] text-white transition-all duration-300",
          isMobile ? (isMenuOpen ? "left-0" : "-left-full") : "left-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Top section with logo */}
          <div className="flex items-center gap-3 p-6 border-b border-white/10">
            <School className="text-white" size={32} />
            <div>
              <h1 className="font-medium text-xl">EDUSn</h1>
              <p className="text-xs text-white/70">Gestion scolaire</p>
            </div>
          </div>

          {/* Navigation items */}
          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavItem
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  subItems={item.subItems}
                  currentPath={location.pathname}
                />
              ))}
            </nav>
          </div>

          {/* User profile section */}
          <UserProfile user={user} onLogout={handleLogout} />
        </div>
      </aside>
    </>
  );
};

export default Navigation;
