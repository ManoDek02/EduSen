import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

interface EmploiDuTempsGridProps {
  cours: Cours[];
  onEdit: (cours: Cours) => void;
  onDelete: (cours: Cours) => void;
  onViewDetails: (cours: Cours) => void;
}

const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
const HEURES = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

export const EmploiDuTempsGrid = ({ cours, onEdit, onDelete, onViewDetails }: EmploiDuTempsGridProps) => {
  const [selectedClasse, setSelectedClasse] = useState<string>("");

  const classes = Array.from(new Set(cours.map(c => c.classe)));

  const filteredCours = selectedClasse
    ? cours.filter(c => c.classe === selectedClasse)
    : cours;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        {classes.map((classe) => (
          <Badge
            key={classe}
            variant={selectedClasse === classe ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedClasse(classe)}
          >
            {classe}
          </Badge>
        ))}
      </div>

      <div className="grid grid-cols-6 gap-2">
        <div className="col-span-1" />
        {JOURS.map((jour) => (
          <div key={jour} className="text-center font-semibold">
            {jour}
          </div>
        ))}

        {HEURES.map((heure, heureIndex) => (
          <>
            <div key={`heure-${heure}`} className="text-right font-medium">
              {heure}
            </div>
            {JOURS.map((_, jourIndex) => {
              const coursDansCetteCase = filteredCours.filter(
                (c) => c.jour === jourIndex && c.debut <= heureIndex && heureIndex < c.debut + c.duree
              );

              return (
                <div
                  key={`${jourIndex}-${heureIndex}`}
                  className="relative min-h-[60px] border rounded-md p-1"
                >
                  {coursDansCetteCase.map((c) => (
                    <Card
                      key={c.id}
                      className="p-2 text-sm"
                      style={{
                        backgroundColor: c.couleur + '20',
                        borderColor: c.couleur,
                        color: c.couleur,
                        height: `${(c.duree * 60)}px`,
                        position: 'absolute',
                        top: `${((heureIndex - c.debut) * 60)}px`,
                        width: 'calc(100% - 8px)',
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium">{c.matiere}</div>
                          <div className="text-xs">{c.professeur}</div>
                          <div className="text-xs">{c.salle}</div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onViewDetails(c)}>
                              Voir les détails
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(c)}>
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => onDelete(c)}
                            >
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </Card>
                  ))}
                </div>
              );
            })}
          </>
        ))}
      </div>
    </div>
  );
}; 