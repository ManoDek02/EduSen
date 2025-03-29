import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

export type User = {
  id: string;
  matricule: string;
  name: string;
  nom: string;
  prenom: string;
  role: 'admin' | 'professeur' | 'eleve' | 'parent';
  email: string;
};

export type NavItem = {
  to: string;
  icon: LucideIcon;
  label: string;
  subItems?: { to: string; label: string; }[];
};

export type NavItemProps = NavItem & {
  currentPath: string;
}; 