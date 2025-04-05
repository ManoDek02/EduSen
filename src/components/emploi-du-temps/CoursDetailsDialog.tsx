import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, BookOpen, Building2 } from "lucide-react";

interface Cours {
  id: string;
  classe: string;
  matiere: string;
  professeur: string;
  salle: string;
  jour: number;
  debut: number;
  duree: number;
  couleur: string;
}

interface CoursDetailsDialogProps {
  cours: Cours | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (cours: Cours) => void;
}

const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const HEURES = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];

export const CoursDetailsDialog = ({ cours, open, onOpenChange, onEdit }: CoursDetailsDialogProps) => {
  if (!cours) return null;

  const getHeureFin = (debut: number, duree: number) => {
    const debutIndex = debut;
    const finIndex = debutIndex + duree;
    return HEURES[finIndex - 1];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Détails du cours</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{cours.matiere}</h3>
            <Badge variant="outline" style={{ backgroundColor: cours.couleur + '20', color: cours.couleur }}>
              {cours.classe}
            </Badge>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{JOURS[cours.jour]}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{HEURES[cours.debut]} - {getHeureFin(cours.debut, cours.duree)}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{cours.professeur}</span>
            </div>

            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span>{cours.matiere}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span>{cours.salle}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
          <Button onClick={() => onEdit(cours)}>
            Modifier
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 