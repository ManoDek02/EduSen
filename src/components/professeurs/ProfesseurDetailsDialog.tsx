import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Professeur } from "@/types/professeur";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Phone, BookOpen, Clock, Calendar } from "lucide-react";
interface ProfesseurDetailsDialogProps {
  professeur: Professeur | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (professeur: Professeur) => void;
}

export const ProfesseurDetailsDialog = ({ professeur, open, onOpenChange, onEdit }: ProfesseurDetailsDialogProps) => {
  if (!professeur) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Détails du professeur</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* En-tête avec avatar et informations principales */}
          <div className="flex items-start gap-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-lg">
                {professeur.prenom[0]}{professeur.nom[0]}
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold">
                {professeur.prenom} {professeur.nom}
              </h3>
              <Badge variant="outline" className="text-sm">
                {professeur.matiere}
              </Badge>
            </div>
          </div>

          {/* Informations de contact */}
          <div className="space-y-4">
            <h4 className="font-medium">Informations de contact</h4>
            <div className="grid gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{professeur.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{professeur.telephone}</span>
              </div>
            </div>
          </div>

          {/* Statut et informations professionnelles */}
          <div className="space-y-4">
            <h4 className="font-medium">Informations professionnelles</h4>
            <div className="grid gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Statut : </span>
                <Badge variant={
                  professeur.status === 'Temps plein' ? 'default' :
                  professeur.status === 'Temps partiel' ? 'secondary' : 'outline'
                }>
                  {professeur.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span>Matière : {professeur.matiere}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>ID : P-{professeur.id.toString().padStart(5, '0')}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fermer
            </Button>
            <Button onClick={() => onEdit(professeur)}>
              Modifier
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 