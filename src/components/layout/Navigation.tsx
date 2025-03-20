
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  UserCircle,
  Calendar,
  FileText,
  ChevronDown,
  Menu,
  X,
  School,
  LogOut,
  BookOpen,
  ClipboardList
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

type User = {
  matricule: string;
  role: string;
  name: string;
};

type NavItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  subItems?: { to: string; label: string }[];
  currentPath: string;
};

const NavItem = ({ to, icon, label, subItems, currentPath }: NavItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isActive = currentPath === to || currentPath.startsWith(`${to}/`);
  const hasSubItems = Array.isArray(subItems) && subItems.length > 0;

  return (
    <div className="mb-1">
      <Link
        to={hasSubItems ? "#" : to}
        onClick={hasSubItems ? (e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        } : undefined}
        className={cn(
          "flex items-center justify-between w-full px-3 py-2 rounded-md text-sm font-medium transition-colors",
          isActive
            ? "bg-white text-[#0046AD]"
            : "text-white hover:bg-[#0051c7] hover:text-white"
        )}
      >
        <div className="flex items-center gap-3">
          <div className={isActive ? "text-[#0046AD]" : "text-white"}>{icon}</div>
          <span>{label}</span>
        </div>
        {hasSubItems && (
          <ChevronDown
            size={16}
            className={cn("text-white transition-transform", 
              isOpen && "transform rotate-180"
            )}
          />
        )}
      </Link>
      
      {hasSubItems && isOpen && (
        <div className="ml-10 mt-1 space-y-1 animate-slide-down">
          {subItems.map((subItem) => (
            <Link
              key={subItem.to}
              to={subItem.to}
              className={cn(
                "block px-3 py-2 rounded-md text-sm transition-colors",
                currentPath === subItem.to
                  ? "bg-white/10 text-white font-medium"
                  : "text-white/80 hover:bg-[#0051c7] hover:text-white"
              )}
            >
              {subItem.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
  const getNavItems = () => {
    if (!user) return [];

    switch (user.role) {
      case 'admin':
        return [
          {
            to: "/dashboard",
            icon: <LayoutDashboard size={20} />,
            label: "Tableau de bord"
          },
          {
            to: "/administration",
            icon: <School size={20} />,
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
            to: "/dashboard",
            icon: <LayoutDashboard size={20} />,
            label: "Tableau de bord"
          },
          {
            to: "/professeurs",
            icon: <UserCircle size={20} />,
            label: "Professeurs",
            subItems: [
              { to: "/professeurs/classes", label: "Liste des classes" },
              { to: "/professeurs/emploi-du-temps", label: "Emploi du temps" },
              { to: "/professeurs/notes", label: "Gestion des notes" }
            ]
          }
        ];
      case 'eleve':
        return [
          {
            to: "/dashboard",
            icon: <LayoutDashboard size={20} />,
            label: "Tableau de bord"
          },
          {
            to: "/eleves",
            icon: <GraduationCap size={20} />,
            label: "Élèves",
            subItems: [
              { to: "/eleves/syllabus", label: "Syllabus" },
              { to: "/eleves/emploi-du-temps", label: "Emploi du temps" },
              { to: "/eleves/notes", label: "Notes" },
              { to: "/eleves/bulletin", label: "Bulletin" },
              { to: "/eleves/contact-professeurs", label: "Contact professeurs" },
              { to: "/eleves/baki", label: "Baki (Anciens sujets)" }
            ]
          }
        ];
      case 'parent':
        return [
          {
            to: "/dashboard",
            icon: <LayoutDashboard size={20} />,
            label: "Tableau de bord"
          },
          {
            to: "/parents",
            icon: <Users size={20} />,
            label: "Parents"
          }
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      {/* Mobile header with hamburger menu */}
      {isMobile && (
        <div className="flex items-center justify-between p-4 bg-[#0046AD] text-white fixed top-0 left-0 right-0 z-50">
          <div className="flex items-center gap-2">
            <School className="text-white" size={24} />
            <span className="font-medium text-lg">EDUSn</span>
          </div>
          <Button variant="ghost" size="icon" className="text-white" onClick={toggleMenu}>
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
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <Avatar>
                <AvatarFallback className="bg-white/10 text-white">
                  {user?.name.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{user?.name || "Utilisateur"}</p>
                <p className="text-xs text-white/70">{user?.role || "Rôle"}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full border-white/20 text-white hover:bg-white/10 hover:text-white"
              onClick={handleLogout}
            >
              <LogOut size={16} className="mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobile && isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 backdrop-blur-sm animate-fade-in"
          onClick={toggleMenu}
        />
      )}
    </>
  );
};

export default Navigation;
