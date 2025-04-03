import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { School, Menu, X, LayoutDashboard, UserCircle, GraduationCap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigation } from "@/hooks/use-navigation";
import { NavItem as NavItemComponent } from "./NavItem";
import { UserProfile } from "./UserProfile";
import { User } from "@/types/navigation";
import { toast } from 'sonner';
import { NavItem } from '@/types/navigation';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Récupérer l'utilisateur connecté depuis localStorage
    const storedUser = localStorage.getItem('currentUser');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    toast.success('Déconnexion réussie');
    navigate('/');
  };

  // Filtrer les éléments de navigation en fonction du rôle de l'utilisateur
  const getNavItems = (): NavItem[] => {
    if (!user) return [];

    switch (user.role) {
      case 'admin':
        return [
          {
            to: "/administration/dashboard",
            icon: LayoutDashboard,
            label: "Tableau de bord"
          },
          {
            to: "/administration",
            icon: School,
            label: "Administration",
            subItems: [
              { to: "/administration/notes", label: "Gestion des notes" },
              { to: "/administration/professeurs", label: "Gestion des professeurs" },
              { to: "/administration/eleves", label: "Gestion des élèves" },
              { to: "/administration/emploi-du-temps", label: "Emploi du temps" },
              { to: "/administration/bulletins", label: "Gestion des bulletins" }
            ]
          }
        ];
      case 'professeur':
        return [
          {
            to: "/professeurs/dashboard",
            icon: LayoutDashboard,
            label: "Tableau de bord"
          },
          {
            to: "/professeurs",
            icon: UserCircle,
            label: "Professeurs",
            subItems: [
              { to: "/professeurs/classes", label: "Liste des éleves" },
              { to: "/professeurs/emploi-du-temps", label: "Mon emploi du temps" },
              { to: "/professeurs/notes", label: "Gestion des notes" },
              { to: "/professeurs/syllabus", label: "Syllabus" },
            ]
          }
        ];
      case 'eleve':
        return [
          {
            to: "/eleves/dashboard",
            icon: LayoutDashboard,
            label: "Tableau de bord"
          },
          {
            to: "/eleves",
            icon: GraduationCap,
            label: "Élèves",
            subItems: [
              { to: "/eleves/syllabus", label: "Syllabus" },
              { to: "/eleves/emploi-du-temps", label: "Emploi du temps" },
              { to: "/eleves/notes", label: "Notes" },
              { to: "/eleves/bulletin", label: "Bulletin" },
              { to: "/eleves/notifications", label: "Notifications" },
              { to: "/eleves/contact-professeurs", label: "Contact professeurs" },
              { to: "/eleves/baki", label: "Baki (Anciens sujets)" }
            ]
          }
        ];
      case 'parent':
        return [
          {
            to: "/parents/dashboard",
            icon: LayoutDashboard,
            label: "Tableau de bord"
          },
          {
            to: "/parents",
            icon: Users,
            label: "Parents"
          }
        ];
      default:
        return [];
    }
  };

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
                <NavItemComponent
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
