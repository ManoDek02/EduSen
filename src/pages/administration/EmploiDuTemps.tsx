import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download, ChevronLeft, ChevronRight, Clock, User, Plus, Upload, Calendar, FileText, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { NewCoursDialog } from '@/components/emploi-du-temps/NewCoursDialog';
import { EditCoursDialog } from '@/components/emploi-du-temps/EditCoursDialog';
import { CoursDetailsDialog } from '@/components/emploi-du-temps/CoursDetailsDialog';
import { EmploiDuTempsGrid } from '@/components/emploi-du-temps/EmploiDuTempsGrid';
import { PDFExportDialog } from '@/components/emploi-du-temps/PDFExportDialog';
import { VacancesDialog } from '@/components/emploi-du-temps/VacancesDialog';
import { ProfesseurEmploiDuTemps } from '@/components/emploi-du-temps/ProfesseurEmploiDuTemps';
import '@/styles/emploi-du-temps.css';
import { Cours } from '@/types/cours';

const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
const heures = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

interface Vacances {
  id: string;
  nom: string;
  dateDebut: Date;
  dateFin: Date;
}

// Données des classes
const classesData = {
  "3ème A": {
    nombreEleves: 32,
    professeurPrincipal: "M. Martin",
    salle: "S-101"
  },
  "3ème B": {
    nombreEleves: 30,
    professeurPrincipal: "Mme Dubois",
    salle: "S-102"
  },
  "4ème A": {
    nombreEleves: 31,
    professeurPrincipal: "M. Bernard",
    salle: "S-103"
  },
  "4ème B": {
    nombreEleves: 29,
    professeurPrincipal: "Mme Lambert",
    salle: "S-104"
  }
};

// Composant pour les cours dans l'emploi du temps
const CoursItem = ({ cours }: { cours: Cours }) => {
  return (
    <div
      className="cours-item"
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
      <div className="text-xs flex items-center gap-1 mt-1">
        <User className="h-3 w-3" />
        <span className="truncate">{cours.professeur}</span>
      </div>
      <div className="text-xs mt-auto opacity-80">{cours.salle}</div>
    </div>
  );
};

export const EmploiDuTemps = () => {
  const [cours, setCours] = useState<Cours[]>([]);
  const [newCoursDialogOpen, setNewCoursDialogOpen] = useState(false);
  const [editCoursDialogOpen, setEditCoursDialogOpen] = useState(false);
  const [detailsCoursDialogOpen, setDetailsCoursDialogOpen] = useState(false);
  const [pdfExportDialogOpen, setPdfExportDialogOpen] = useState(false);
  const [vacancesDialogOpen, setVacancesDialogOpen] = useState(false);
  const [selectedCours, setSelectedCours] = useState<Cours | null>(null);
  const [classeSelectionnee, setClasseSelectionnee] = useState('3ème A');
  const [semaine, setSemaine] = useState('Semaine du 10 au 14 juin 2024');
  const [vacances, setVacances] = useState<Vacances[]>([]);

  // Filtrer les cours pour la classe sélectionnée
  const coursDeLaClasse = cours.filter(cours => cours.classe === classeSelectionnee);

  const handlePrevSemaine = () => {
    setSemaine('Semaine du 3 au 7 juin 2024');
  };

  const handleNextSemaine = () => {
    setSemaine('Semaine du 17 au 21 juin 2024');
  };

  // Fonction pour vérifier les conflits d'horaire
  const verifierConflits = (nouveauCours: Cours) => {
    return cours.some(c => 
      c.jour === nouveauCours.jour &&
      c.salle === nouveauCours.salle &&
      ((nouveauCours.debut >= c.debut && nouveauCours.debut < c.debut + c.duree) ||
       (nouveauCours.debut + nouveauCours.duree > c.debut && nouveauCours.debut < c.debut + c.duree))
    );
  };

  // Fonction pour vérifier la disponibilité du professeur
  const verifierDisponibiliteProfesseur = (nouveauCours: Cours) => {
    return cours.some(c =>
      c.jour === nouveauCours.jour &&
      c.professeur === nouveauCours.professeur &&
      ((nouveauCours.debut >= c.debut && nouveauCours.debut < c.debut + c.duree) ||
       (nouveauCours.debut + nouveauCours.duree > c.debut && nouveauCours.debut < c.debut + c.duree))
    );
  };

  const handleAddCours = (nouveauCours: Cours) => {
    if (verifierConflits(nouveauCours)) {
      toast.error('Conflit d\'horaire détecté pour cette salle');
      return;
    }
    if (verifierDisponibiliteProfesseur(nouveauCours)) {
      toast.error('Le professeur a déjà un cours à cette heure');
      return;
    }
    setCours([...cours, nouveauCours]);
    toast.success('Cours ajouté avec succès');
  };

  const handleEditCours = (coursModifie: Cours) => {
    setCours(cours.map(c => c.id === coursModifie.id ? coursModifie : c));
    toast.success('Cours modifié avec succès');
  };

  const handleDeleteCours = (coursASupprimer: Cours) => {
    setCours(cours.filter(c => c.id !== coursASupprimer.id));
    toast.success('Cours supprimé avec succès');
  };

  const handleExport = () => {
    const data = {
      cours,
      semaine,
      classe: classeSelectionnee
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emploi-du-temps-${classeSelectionnee}-${semaine}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Emploi du temps exporté avec succès');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string);
            setCours(data.cours);
            setSemaine(data.semaine);
            setClasseSelectionnee(data.classe);
            toast.success('Emploi du temps importé avec succès');
          } catch (error) {
            toast.error('Erreur lors de l\'import du fichier');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleAddVacances = (nouvelleVacances: Vacances) => {
    setVacances([...vacances, nouvelleVacances]);
  };

  const handleDeleteVacances = (id: string) => {
    setVacances(vacances.filter(v => v.id !== id));
    toast.success('Période de vacances supprimée avec succès');
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title="Emploi du temps"
          description="Gestion et consultation des emplois du temps"
          actions={
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => setPdfExportDialogOpen(true)}>
                <FileText className="mr-2 h-4 w-4" />
                Exporter PDF
              </Button>
              <Button variant="outline" onClick={() => setVacancesDialogOpen(true)}>
                <Calendar className="mr-2 h-4 w-4" />
                Vacances
              </Button>
              <Button variant="outline" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Exporter JSON
              </Button>
              <Button variant="outline" onClick={handleImport}>
                <Upload className="mr-2 h-4 w-4" />
                Importer
              </Button>
              <Button onClick={() => setNewCoursDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Nouveau cours
              </Button>
            </div>
          }
        />

        <Tabs defaultValue="classe" className="space-y-4">
          <TabsList>
            <TabsTrigger value="classe">Par classe</TabsTrigger>
            <TabsTrigger value="professeur">Par professeur</TabsTrigger>
          </TabsList>

          <TabsContent value="classe" className="space-y-4">
            {/* Sélecteurs et navigation */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-wrap gap-2 items-center">
                <Select value={classeSelectionnee} onValueChange={setClasseSelectionnee}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sélectionner une classe" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(classesData).map((classe) => (
                      <SelectItem key={classe} value={classe}>
                        {classe}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Badge variant="outline" className="text-xs">
                  {classesData[classeSelectionnee as keyof typeof classesData].nombreEleves} élèves
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Prof principal: {classesData[classeSelectionnee as keyof typeof classesData].professeurPrincipal}
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
                <EmploiDuTempsGrid
                  cours={cours}
                  onEdit={(cours) => {
                    setSelectedCours(cours);
                    setEditCoursDialogOpen(true);
                  }}
                  onDelete={handleDeleteCours}
                  onViewDetails={(cours) => {
                    setSelectedCours(cours);
                    setDetailsCoursDialogOpen(true);
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="professeur">
            <ProfesseurEmploiDuTemps cours={cours} />
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <NewCoursDialog
          open={newCoursDialogOpen}
          onOpenChange={setNewCoursDialogOpen}
          onAddCours={handleAddCours}
        />

        <EditCoursDialog
          cours={selectedCours}
          open={editCoursDialogOpen}
          onOpenChange={setEditCoursDialogOpen}
          onSave={handleEditCours}
        />

        <CoursDetailsDialog
          cours={selectedCours}
          open={detailsCoursDialogOpen}
          onOpenChange={setDetailsCoursDialogOpen}
          onEdit={(cours) => {
            setSelectedCours(cours);
            setDetailsCoursDialogOpen(false);
            setEditCoursDialogOpen(true);
          }}
        />

        <PDFExportDialog
          open={pdfExportDialogOpen}
          onOpenChange={setPdfExportDialogOpen}
          cours={cours}
          classe={classeSelectionnee}
          semaine={semaine}
        />

        <VacancesDialog
          open={vacancesDialogOpen}
          onOpenChange={setVacancesDialogOpen}
          vacances={vacances}
          onAddVacances={handleAddVacances}
          onDeleteVacances={handleDeleteVacances}
        />
      </div>
    </MainLayout>
  );
};

export default EmploiDuTemps;
