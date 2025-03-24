import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavItemProps } from "@/types/navigation";

export const NavItem = ({ to, icon: Icon, label, subItems, currentPath }: NavItemProps) => {
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
          <div className={isActive ? "text-[#0046AD]" : "text-white"}>
            <Icon size={20} />
          </div>
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