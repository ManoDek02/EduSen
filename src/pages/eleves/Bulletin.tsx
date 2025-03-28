import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Printer, Eye, RefreshCw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Fonction pour générer des notes aléatoires
const generateRandomNotes = () => {
  const matieres = [
    "Mathématiques", "Français", "Histoire-Géographie", "Anglais", 
    "Physique-Chimie", "SVT", "EPS", "Espagnol", "Allemand", 
    "Technologie", "Arts Plastiques", "Musique"
  ];

  return matieres.map(matiere => ({
    matiere,
    note: Math.floor(Math.random() * 8) + 8, // Note entre 8 et 15
    noteClasse: (Math.random() * 3 + 11).toFixed(1), // Note entre 11 et 14
    coefficient: Math.floor(Math.random() * 3) + 2, // Coefficient entre 2 et 4
    professeur: `M${Math.random() > 0.5 ? 'me' : '.'} ${['Martin', 'Dubois', 'Bernard', 'Petit', 'Durand', 'Moreau'][Math.floor(Math.random() * 6)]}`,
    appreciation: [
      "Excellent travail",
      "Très bon niveau",
      "Bon travail",
      "Continuez ainsi",
      "Progrès à faire",
      "À améliorer"
    ][Math.floor(Math.random() * 6)]
  }));
};

// Données de test
const bulletinData = {
  "2023-2024": {
    eleve: {
      nom: "Dupont",
      prenom: "Marie",
      classe: "3ème A",
      matricule: "2023-2024-001",
      dateNaissance: "15/03/2009"
    },
    ecole: {
      nom: "Collège EDUSn",
      adresse: "123 Avenue de l'Éducation, 75001 Paris",
      telephone: "01 23 45 67 89",
      email: "contact@edusn.edu"
    },
    semestre1: {
      moyenne: 14.5,
      moyenneClasse: 13.2,
      notes: generateRandomNotes()
    },
    semestre2: {
      moyenne: 15.2,
      moyenneClasse: 13.8,
      notes: generateRandomNotes()
    },
    bulletinAnnuel: {
      moyenne: 15.2,
      moyenneClasse: 13.7,
      absences: {
        justifiees: 3,
        nonJustifiees: 1
      },
      mention: "Très bien",
      appreciation: "Élève sérieux et travailleur. Excellente année scolaire."
    }
  },
  "2022-2023": {
    eleve: {
      nom: "Dupont",
      prenom: "Marie",
      classe: "4ème A",
      matricule: "2022-2023-001",
      dateNaissance: "15/03/2009"
    },
    ecole: {
      nom: "Collège EDUSn",
      adresse: "123 Avenue de l'Éducation, 75001 Paris",
      telephone: "01 23 45 67 89",
      email: "contact@edusn.edu"
    },
    semestre1: {
      moyenne: 13.8,
      moyenneClasse: 12.9,
      notes: generateRandomNotes()
    },
    semestre2: {
      moyenne: 14.2,
      moyenneClasse: 13.1,
      notes: generateRandomNotes()
    },
    bulletinAnnuel: {
      moyenne: 14.0,
      moyenneClasse: 13.0,
      absences: {
        justifiees: 2,
        nonJustifiees: 1
      },
      mention: "Bien",
      appreciation: "Élève sérieux. Bonne année scolaire."
    }
  }
};

const Bulletin = () => {
  const [selectedYear, setSelectedYear] = useState("2023-2024");
  const [selectedBulletin, setSelectedBulletin] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [data, setData] = useState(bulletinData);

  const handleViewBulletin = (bulletin: any, semestre: string) => {
    setSelectedBulletin({ ...bulletin, semestre });
    setIsDialogOpen(true);
  };

  const handlePrintBulletin = (bulletin: any) => {
    // Logique d'impression à implémenter
    console.log("Impression du bulletin:", bulletin);
  };

  const handleRefresh = () => {
    setData({
      ...data,
      [selectedYear]: {
        ...data[selectedYear],
        semestre1: {
          ...data[selectedYear].semestre1,
          notes: generateRandomNotes()
        },
        semestre2: {
          ...data[selectedYear].semestre2,
          notes: generateRandomNotes()
        }
      }
    });
  };

  return (
    <MainLayout title="BULLETINS">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sélectionner une année" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(data).map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={handleRefresh}
            className="bg-[#0046AD] hover:bg-[#003c91] text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Actualiser</span>
          </Button>
        </div>

        <div className="grid gap-4">
          {/* Bulletin Premier Semestre */}
          <Card className="border-t-4 border-t-[#0046AD]">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#0046AD]">Bulletin Premier Semestre</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-green-100">
                      <TableHead className="text-lg font-bold text-black">Année scolaire</TableHead>
                      <TableHead className="text-center text-lg font-bold text-black">Moyenne</TableHead>
                      <TableHead className="text-center text-lg font-bold text-black">Moyenne de la classe</TableHead>
                      <TableHead className="text-center text-lg font-bold text-black">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">{selectedYear}</TableCell>
                      <TableCell className="text-center">{data[selectedYear].semestre1.moyenne}/20</TableCell>
                      <TableCell className="text-center">{data[selectedYear].semestre1.moyenneClasse}/20</TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewBulletin(data[selectedYear].semestre1, "1")}>
                            <Eye className="h-4 w-4 mr-1" />
                            Voir
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handlePrintBulletin(data[selectedYear].semestre1)}>
                            <Printer className="h-4 w-4 mr-1" />
                            Imprimer
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Bulletin Deuxième Semestre */}
          <Card className="border-t-4 border-t-[#0046AD]">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#0046AD]">Bulletin Deuxième Semestre</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-green-100">
                      <TableHead className="text-lg font-bold text-black">Année scolaire</TableHead>
                      <TableHead className="text-center text-lg font-bold text-black">Moyenne</TableHead>
                      <TableHead className="text-center text-lg font-bold text-black">Moyenne de la classe</TableHead>
                      <TableHead className="text-center text-lg font-bold text-black">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">{selectedYear}</TableCell>
                      <TableCell className="text-center">{data[selectedYear].semestre2.moyenne}/20</TableCell>
                      <TableCell className="text-center">{data[selectedYear].semestre2.moyenneClasse}/20</TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewBulletin(data[selectedYear].semestre2, "2")}>
                            <Eye className="h-4 w-4 mr-1" />
                            Voir
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handlePrintBulletin(data[selectedYear].semestre2)}>
                            <Printer className="h-4 w-4 mr-1" />
                            Imprimer
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Bulletin Annuel */}
          <Card className="border-t-4 border-t-[#0046AD] bg-blue-50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#0046AD]">Bulletin Annuel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-green-100">
                      <TableHead className="text-lg font-bold text-black">Année scolaire</TableHead>
                      <TableHead className="text-center text-lg font-bold text-black">Moyenne</TableHead>
                      <TableHead className="text-center text-lg font-bold text-black">Moyenne de la classe</TableHead>
                      <TableHead className="text-center text-lg font-bold text-black">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">{selectedYear}</TableCell>
                      <TableCell className="text-center">{data[selectedYear].bulletinAnnuel.moyenne}/20</TableCell>
                      <TableCell className="text-center">{data[selectedYear].bulletinAnnuel.moyenneClasse}/20</TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewBulletin(data[selectedYear].bulletinAnnuel, "annuel")}>
                            <Eye className="h-4 w-4 mr-1" />
                            Voir
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handlePrintBulletin(data[selectedYear].bulletinAnnuel)}>
                            <Printer className="h-4 w-4 mr-1" />
                            Imprimer
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dialog pour afficher le bulletin */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#0046AD]">
                Bulletin de notes du semestre {selectedBulletin?.semestre}
              </DialogTitle>
            </DialogHeader>
            {selectedBulletin && (
              <div className="space-y-6">
                {/* Informations de l'école */}
                <div className="text-center border-b pb-4">
                  <h3 className="text-xl font-bold">{data[selectedYear].ecole.nom}</h3>
                  <p className="text-sm text-gray-600">{data[selectedYear].ecole.adresse}</p>
                  <p className="text-sm text-gray-600">{data[selectedYear].ecole.telephone} - {data[selectedYear].ecole.email}</p>
                </div>

                {/* Informations de l'élève */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Informations de l'élève</h4>
                    <p><span className="font-medium">Nom :</span> {data[selectedYear].eleve.nom}</p>
                    <p><span className="font-medium">Prénom :</span> {data[selectedYear].eleve.prenom}</p>
                    <p><span className="font-medium">Classe :</span> {data[selectedYear].eleve.classe}</p>
                    <p><span className="font-medium">Matricule :</span> {data[selectedYear].eleve.matricule}</p>
                    <p><span className="font-medium">Date de naissance :</span> {data[selectedYear].eleve.dateNaissance}</p>
                  </div>
                </div>

                {/* Tableau des notes */}
                <Table>
                  <TableHeader>
                    <TableRow className="bg-green-100">
                      <TableHead className="text-lg font-bold text-black">Matière</TableHead>
                      <TableHead className="text-center text-lg font-bold text-black">Note 1</TableHead>
                      <TableHead className="text-center text-lg font-bold text-black">Note 2</TableHead>
                      <TableHead className="text-center text-lg font-bold text-black">Coefficient</TableHead>
                      <TableHead className="text-center text-lg font-bold text-black">Moyenne</TableHead>
                      <TableHead className="text-center text-lg font-bold text-black">Moyenne de la classe</TableHead>
                      <TableHead className="text-lg font-bold text-black">Professeur</TableHead>
                      <TableHead className="text-lg font-bold text-black">Appréciation</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedBulletin.notes?.map((note: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{note.matiere}</TableCell>
                        <TableCell className="text-center">{note.note1}/20</TableCell>
                        <TableCell className="text-center">{note.note2}/20</TableCell>
                        <TableCell className="text-center">{note.coefficient}</TableCell>
                        <TableCell className="text-center">{note.notedelaclasse}/20</TableCell>
                        <TableCell className="text-center">{((note.note1 + note.note2) / 2).toFixed(1)}/20</TableCell>
                        <TableCell>{note.professeur}</TableCell>
                        <TableCell>{note.appreciation}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-blue-50 font-bold">
                      <TableCell colSpan={4} className="text-right">Moyenne générale :</TableCell>
                      <TableCell className="text-center">{selectedBulletin.moyenne}/20</TableCell>
                      <TableCell colSpan={2}></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                {/* Mention disciplinaire et moyenne */}
                <div className="space-y-4">
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Mention disciplinaire</h4>
                    <p>Absences justifiées : {data[selectedYear].bulletinAnnuel.absences.justifiees}</p>
                    <p>Absences non justifiées : {data[selectedYear].bulletinAnnuel.absences.nonJustifiees}</p>
                  </div>
                  {selectedBulletin.semestre === "annuel" && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-2">Mention et appréciation</h4>
                      <p>Mention : <Badge variant="outline" className="text-[#0046AD]">{selectedBulletin.mention}</Badge></p>
                      <p className="mt-2">Appréciation : {selectedBulletin.appreciation}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Bulletin;
