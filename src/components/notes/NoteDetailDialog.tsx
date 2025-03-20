
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";

interface NoteDetailProps {
  note: {
    id: string;
    eleveId: string;
    eleveNom: string;
    elevePrenom: string;
    classe: string;
    matiere: string;
    note: number;
    coefficient: number;
    professeur: string;
    trimestre: number;
    dateEvaluation: string;
    commentaire: string;
    type: string;
  };
}

export const NoteDetailDialog: React.FC<NoteDetailProps> = ({ note }) => {
  const noteValue = parseFloat(note.note.toString());
  let badgeVariant = 'default';
  
  if (noteValue < 8) badgeVariant = 'destructive';
  else if (noteValue < 10) badgeVariant = 'secondary';
  else if (noteValue >= 16) badgeVariant = 'success';

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Détails de la note</DialogTitle>
          <DialogDescription>
            Informations détaillées sur l'évaluation
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg">{note.elevePrenom} {note.eleveNom}</h3>
              <p className="text-sm text-muted-foreground">{note.classe}</p>
            </div>
            <Badge variant={badgeVariant} className="text-md px-3 py-1">
              {note.note}/20
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Matière</p>
              <p>{note.matiere}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Professeur</p>
              <p>{note.professeur}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Type d'évaluation</p>
              <p>{note.type}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Coefficient</p>
              <p>{note.coefficient}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date d'évaluation</p>
              <p>{formatDate(note.dateEvaluation)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Trimestre</p>
              <p>{note.trimestre}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Commentaire</p>
            <p className="p-3 bg-muted rounded-md">{note.commentaire}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
