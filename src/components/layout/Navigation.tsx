
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  School
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";

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
            ? "bg-primary/10 text-primary"
            : "text-foreground hover:bg-secondary hover:text-foreground"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="text-muted-foreground">{icon}</div>
          <span>{label}</span>
        </div>
        {hasSubItems && (
          <ChevronDown
            size={16}
            className={cn("text-muted-foreground transition-transform", 
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
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
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
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    {
      to: "/",
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
    },
    {
      to: "/parents",
      icon: <Users size={20} />,
      label: "Parents"
    }
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      {/* Mobile header with hamburger menu */}
      {isMobile && (
        <div className="flex items-center justify-between p-4 bg-card shadow-sm fixed top-0 left-0 right-0 z-50">
          <div className="flex items-center gap-2">
            <School className="text-primary" size={24} />
            <span className="font-medium text-lg">EduManager</span>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      )}

      {/* Sidebar navigation */}
      <aside
        className={cn(
          "fixed z-40 top-0 bottom-0 w-72 bg-card border-r transition-all duration-300",
          isMobile ? (isMenuOpen ? "left-0" : "-left-full") : "left-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Top section with logo */}
          <div className="flex items-center gap-3 p-6 border-b">
            <School className="text-primary" size={32} />
            <div>
              <h1 className="font-medium text-xl">EduManager</h1>
              <p className="text-xs text-muted-foreground">Gestion scolaire</p>
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
          <div className="p-4 border-t">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary/10 text-primary">AD</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">Admin</p>
                <p className="text-xs text-muted-foreground">admin@edumanager.fr</p>
              </div>
            </div>
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
