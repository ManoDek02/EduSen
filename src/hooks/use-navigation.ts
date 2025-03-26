import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, School, UserCircle, GraduationCap, Users } from "lucide-react";
import { toast } from "sonner";
import { User, NavItem } from '@/types/navigation';

export const useNavigation = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
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

  const getNavItems = (): NavItem[] => {
    if (!user) return [];

    switch (user.role) {
      case 'admin':
        return [
          {
            to: "/dashboard",
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
            to: "/dashboard",
            icon: LayoutDashboard,
            label: "Tableau de bord"
          },
          {
            to: "/professeurs",
            icon: UserCircle,
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
              { to: "/eleves/contact-professeurs", label: "Contact professeurs" },
              { to: "/eleves/baki", label: "Baki (Anciens sujets)" }
            ]
          }
        ];
      case 'parent':
        return [
          {
            to: "/dashboard",
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

  return {
    user,
    isMenuOpen,
    setIsMenuOpen,
    handleLogout,
    getNavItems
  };
}; 