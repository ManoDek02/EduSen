import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Cours } from '@/types/cours';
import { Clock, User, Building2 } from "lucide-react";

interface ProfesseurEmploiDuTempsProps {
  cours: Cours[];
}

const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const heures = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];

export const ProfesseurEmploiDuTemps = ({ cours }: ProfesseurEmploiDuTempsProps) => {
  const [professeurSelectionne, setProfesseurSelectionne] = useState<string>('');

  // Récupérer la liste unique des professeurs
  const professeurs = Array.from(new Set(cours.map(c => c.professeur)));

  // Filtrer les cours pour le professeur sélectionné
  const coursDuProfesseur = cours.filter(c => c.professeur === professeurSelectionne);

  // Calculer les statistiques
  const stats = {
    nombreCours: coursDuProfesseur.length,
    nombreClasses: new Set(coursDuProfesseur.map(c => c.classe)).size,
    heuresTotal: coursDuProfesseur.reduce((acc, c) => acc + c.duree, 0),
    matieres: Array.from(new Set(coursDuProfesseur.map(c => c.matiere)))
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Emploi du temps par professeur</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sélecteur de professeur */}
        <div className="space-y-2">
          <Select value={professeurSelectionne} onValueChange={setProfesseurSelectionne}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un professeur" />
            </SelectTrigger>
            <SelectContent>
              {professeurs.map((prof) => (
                <SelectItem key={prof} value={prof}>
                  {prof}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Statistiques */}
        {professeurSelectionne && (
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-2xl font-bold">{stats.heuresTotal}h</div>
                    <div className="text-xs text-muted-foreground">Heures totales</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-2xl font-bold">{stats.nombreCours}</div>
                    <div className="text-xs text-muted-foreground">Cours</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-2xl font-bold">{stats.nombreClasses}</div>
                    <div className="text-xs text-muted-foreground">Classes</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-1">
                  {stats.matieres.map((matiere) => (
                    <Badge key={matiere} variant="secondary">
                      {matiere}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Grille d'emploi du temps */}
        {professeurSelectionne && (
          <div className="grid grid-cols-6 gap-1 w-full min-h-[600px]">
            {/* Colonne des heures */}
            <div className="relative">
              <div className="h-[40px]" />
              {heures.map((heure, heureIndex) => (
                <div
                  key={heure}
                  className="absolute w-full border-t border-dashed flex items-center justify-end pr-2"
                  style={{ top: `${heureIndex * 60 + 40}px` }}
                >
                  <div className="text-xs text-muted-foreground">
                    {heure}
                  </div>
                </div>
              ))}
            </div>

            {/* Colonnes des jours */}
            {jours.map((jour, jourIndex) => (
              <div key={jour} className="relative rounded-lg border bg-card">
                <div className="p-2 text-center border-b sticky top-0 bg-card font-medium text-sm">
                  {jour}
                </div>
                <div className="relative h-[600px]">
                  {heures.map((_, heureIndex) => (
                    <div
                      key={heureIndex}
                      className="absolute w-full border-t border-dashed"
                      style={{ top: `${heureIndex * 60}px` }}
                    />
                  ))}
                  {coursDuProfesseur
                    .filter(cours => cours.jour === jourIndex)
                    .map(cours => (
                      <div
                        key={cours.id}
                        className="absolute rounded-md border p-2 flex flex-col overflow-hidden shadow-sm"
                        style={{
                          top: `${cours.debut * 60 + 40}px`,
                          height: `${cours.duree * 60 - 4}px`,
                          left: '2px',
                          right: '2px',
                          backgroundColor: cours.couleur + '15',
                          borderColor: cours.couleur,
                          color: cours.couleur
                        }}
                      >
                        <div className="font-medium text-sm truncate">{cours.matiere}</div>
                        <div className="text-xs mt-1">{cours.classe}</div>
                        <div className="text-xs mt-auto opacity-80">{cours.salle}</div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 