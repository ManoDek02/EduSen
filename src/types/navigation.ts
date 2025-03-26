import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

export type User = {
  matricule: string;
  role: string;
  name: string;
};

export type NavItem = {
  to: string;
  icon: LucideIcon;
  label: string;
  subItems?: { to: string; label: string }[];
};

export type NavItemProps = NavItem & {
  currentPath: string;
}; 