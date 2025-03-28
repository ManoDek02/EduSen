import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "@/types/navigation";

interface UserProfileProps {
  user: User | null;
  onLogout: () => void;
}

export const UserProfile = ({ user, onLogout }: UserProfileProps) => {
  if (!user) return null;

  return (
    <div className="p-4 border-t border-white/10">
      <div className="flex items-center gap-3 mb-4">
        <Avatar>
          <AvatarFallback className="bg-white/10">
            {user.prenom[0]}{user.nom[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{user.prenom} {user.nom}</p>
          <p className="text-xs text-white/70">{user.role}</p>
        </div>
      </div>
      <Button
        variant="ghost"
        className="w-full justify-start text-white hover:bg-white/10"
        onClick={onLogout}
      >
        <LogOut size={16} className="mr-2" />
        Déconnexion
      </Button>
    </div>
  );
}; 