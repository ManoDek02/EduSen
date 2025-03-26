
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download, ChevronLeft, ChevronRight, Clock, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
const heures = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

type Cours = {
  id: string;
  classe: string;
  matiere: string;
  professeur: string;
  salle: string;
  jour: number; // 0 = Lundi, 1 = Mardi, etc.
  debut: number; // index dans le tableau heures
  duree: number; // nombre de créneaux
  couleur: string;
};

// Exemples de cours
const coursMockData: Cours[] = [
  {
    id: '1',
    classe: '3ème A',
    matiere: 'Mathématiques',
    professeur: 'Mme Dubois',
    salle: 'S-102',
    jour: 0, // Lundi
    debut: 0, // 8h
    duree: 2, // 2h
    couleur: 'bg-blue-100 border-blue-300 text-blue-800'
  },
  {
    id: '2',
    classe: '3ème A',
    matiere: 'Français',
    professeur: 'M. Bernard',
    salle: 'S-105',
    jour: 0, // Lundi
    debut: 3, // 11h
    duree: 2, // 2h
    couleur: 'bg-green-100 border-green-300 text-green-800'
  },
  {
    id: '3',
    classe: '3ème A',
    matiere: 'Histoire-Géo',
    professeur: 'M. Martin',
    salle: 'S-201',
    jour: 1, // Mardi
    debut: 1, // 9h
    duree: 2, // 2h
    couleur: 'bg-purple-100 border-purple-300 text-purple-800'
  },
  {
    id: '4',
    classe: '3ème A',
    matiere: 'Anglais',
    professeur: 'Mme Lambert',
    salle: 'S-103',
    jour: 2, // Mercredi
    debut: 0, // 8h
    duree: 2, // 2h
    couleur: 'bg-yellow-100 border-yellow-300 text-yellow-800'
  },
  {
    id: '5',
    classe: '3ème A',
    matiere: 'SVT',
    professeur: 'M. Roux',
    salle: 'Labo-1',
    jour: 3, // Jeudi
    debut: 2, // 10h
    duree: 2, // 2h
    couleur: 'bg-red-100 border-red-300 text-red-800'
  },
  {
    id: '6',
    classe: '3ème A',
    matiere: 'EPS',
    professeur: 'M. Dupont',
    salle: 'Gymnase',
    jour: 4, // Vendredi
    debut: 6, // 14h
    duree: 3, // 3h
    couleur: 'bg-orange-100 border-orange-300 text-orange-800'
  }
];

// Composant pour les cours dans l'emploi du temps
const CoursItem = ({ cours }: { cours: Cours }) => {
  return (
    <div
      className={cn(
        "absolute rounded-md border p-2 flex flex-col overflow-hidden shadow-sm transition-all hover:shadow-md",
        cours.couleur
      )}
      style={{
        top: `${cours.debut * 60 + 30}px`,
        height: `${cours.duree * 60 - 10}px`,
        left: '2px',
        right: '2px'
      }}
    >
      <div className="font-medium text-sm">{cours.matiere}</div>
      <div className="text-xs flex items-center gap-1">
        <User className="h-3 w-3" />
        {cours.professeur}
      </div>
      <div className="text-xs mt-auto">{cours.salle}</div>
    </div>
  );
};

const EmploiDuTempsProf = () => {
  const [classeSelectionnee, setClasseSelectionnee] = useState('3ème A');
  const [semaine, setSemaine] = useState('Semaine du 10 au 14 juin 2024');

  // Filtrer les cours pour la classe sélectionnée
  const coursDeLaClasse = coursMockData.filter(cours => cours.classe === classeSelectionnee);

  const handlePrevSemaine = () => {
    setSemaine('Semaine du 3 au 7 juin 2024');
  };

  const handleNextSemaine = () => {
    setSemaine('Semaine du 17 au 21 juin 2024');
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title="Emploi du temps"
          description="Gestion et consultation des emplois du temps"
          actions={
            <div className="flex flex-wrap gap-2">
              <Button variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Actualiser
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exporter
              </Button>
              <Button>
                Modifier
              </Button>
            </div>
          }
        />

        <div className="space-y-4">
          {/* Sélecteurs et navigation */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2 items-center">
              <Select value={classeSelectionnee} onValueChange={setClasseSelectionnee}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sélectionner une classe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3ème A">3ème A</SelectItem>
                  <SelectItem value="3ème B">3ème B</SelectItem>
                  <SelectItem value="4ème A">4ème A</SelectItem>
                  <SelectItem value="4ème B">4ème B</SelectItem>
                </SelectContent>
              </Select>
              <Badge variant="outline" className="text-xs">
                32 élèves
              </Badge>
              <Badge variant="outline" className="text-xs">
                Prof principal: M. Martin
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handlePrevSemaine}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">{semaine}</span>
              <Button variant="outline" size="icon" onClick={handleNextSemaine}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Calendrier emploi du temps */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-0">
              <CardTitle className="text-lg font-medium">Emploi du temps</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-5 gap-2 w-full min-h-[600px]">
                {jours.map((jour, jourIndex) => (
                  <div key={jour} className="relative rounded-lg border bg-card">
                    {/* En-tête du jour */}
                    <div className="p-2 text-center border-b sticky top-0 bg-card font-medium">
                      {jour}
                    </div>
                    
                    {/* Grille horaire */}
                    <div className="relative h-[600px]">
                      {heures.map((heure, heureIndex) => (
                        <div 
                          key={heure} 
                          className="absolute w-full border-t border-dashed flex items-center px-2"
                          style={{ top: `${heureIndex * 60}px` }}
                        >
                          <div className="text-xs text-muted-foreground flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            {heure}
                          </div>
                        </div>
                      ))}
                      
                      {/* Cours du jour */}
                      {coursDeLaClasse
                        .filter(cours => cours.jour === jourIndex)
                        .map(cours => (
                          <CoursItem key={cours.id} cours={cours} />
                        ))
                      }
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default EmploiDuTempsProf;
