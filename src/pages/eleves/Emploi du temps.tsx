import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw, Calendar, Coffee, Clock, GraduationCap, User } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Données de test pour l'emploi du temps
const emploiDuTempsData = {
  "Semaine 1": {
    classe: "AS2",
    responsable: "Dr AW",
    "Lundi": [
      { horaire: "8h00-9h00", matiere: "Mathématiques", professeur: "M. Martin", salle: "Salle 101" },
      { horaire: "9h00-10h00", matiere: "Français", professeur: "Mme Dubois", salle: "Salle 102" },
      { horaire: "10h00-10h15", type: "pause" },
      { horaire: "10h15-11h15", matiere: "Histoire-Géo", professeur: "M. Bernard", salle: "Salle 103" },
      { horaire: "11h15-12h15", matiere: "Anglais", professeur: "Mme Petit", salle: "Salle 104" },
      { horaire: "12h15-13h30", type: "pause" },
      { horaire: "13h30-14h30", matiere: "Physique-Chimie", professeur: "M. Durand", salle: "Labo 1" },
      { horaire: "14h30-15h30", matiere: "SVT", professeur: "Mme Moreau", salle: "Labo 2" },
      { horaire: "15h30-15h45", type: "pause" },
      { horaire: "15h45-16h45", matiere: "EPS", professeur: "M. Laurent", salle: "Gym" }
    ],
    "Mardi": [
      { horaire: "8h00-9h00", matiere: "Français", professeur: "Mme Dubois", salle: "Salle 102" },
      { horaire: "9h00-10h00", matiere: "Mathématiques", professeur: "M. Martin", salle: "Salle 101" },
      { horaire: "10h00-10h15", type: "pause" },
      { horaire: "10h15-11h15", matiere: "Anglais", professeur: "Mme Petit", salle: "Salle 104" },
      { horaire: "11h15-12h15", matiere: "Histoire-Géo", professeur: "M. Bernard", salle: "Salle 103" },
      { horaire: "12h15-13h30", type: "pause" },
      { horaire: "13h30-14h30", matiere: "SVT", professeur: "Mme Moreau", salle: "Labo 2" },
      { horaire: "14h30-15h30", matiere: "Physique-Chimie", professeur: "M. Durand", salle: "Labo 1" },
      { horaire: "15h30-15h45", type: "pause" },
      { horaire: "15h45-16h45", matiere: "EPS", professeur: "M. Laurent", salle: "Gym" }
    ],
    "Mercredi": [
      { horaire: "8h00-9h00", matiere: "Histoire-Géo", professeur: "M. Bernard", salle: "Salle 103" },
      { horaire: "9h00-10h00", matiere: "Anglais", professeur: "Mme Petit", salle: "Salle 104" },
      { horaire: "10h00-10h15", type: "pause" },
      { horaire: "10h15-11h15", matiere: "Mathématiques", professeur: "M. Martin", salle: "Salle 101" },
      { horaire: "11h15-12h15", matiere: "Français", professeur: "Mme Dubois", salle: "Salle 102" }
    ],
    "Jeudi": [
      { horaire: "8h00-9h00", matiere: "Anglais", professeur: "Mme Petit", salle: "Salle 104" },
      { horaire: "9h00-10h00", matiere: "Histoire-Géo", professeur: "M. Bernard", salle: "Salle 103" },
      { horaire: "10h00-10h15", type: "pause" },
      { horaire: "10h15-11h15", matiere: "Français", professeur: "Mme Dubois", salle: "Salle 102" },
      { horaire: "11h15-12h15", matiere: "Mathématiques", professeur: "M. Martin", salle: "Salle 101" },
      { horaire: "12h15-13h30", type: "pause" },
      { horaire: "13h30-14h30", matiere: "EPS", professeur: "M. Laurent", salle: "Gym" },
      { horaire: "14h30-15h30", matiere: "SVT", professeur: "Mme Moreau", salle: "Labo 2" },
      { horaire: "15h30-15h45", type: "pause" },
      { horaire: "15h45-16h45", matiere: "Physique-Chimie", professeur: "M. Durand", salle: "Labo 1" }
    ],
    "Vendredi": [
      { horaire: "8h00-9h00", matiere: "Physique-Chimie", professeur: "M. Durand", salle: "Labo 1" },
      { horaire: "9h00-10h00", matiere: "SVT", professeur: "Mme Moreau", salle: "Labo 2" },
      { horaire: "10h00-10h15", type: "pause" },
      { horaire: "10h15-11h15", matiere: "EPS", professeur: "M. Laurent", salle: "Gym" },
      { horaire: "11h15-12h15", matiere: "Anglais", professeur: "Mme Petit", salle: "Salle 104" },
      { horaire: "12h15-13h30", type: "pause" },
      { horaire: "13h30-14h30", matiere: "Mathématiques", professeur: "M. Martin", salle: "Salle 101" },
      { horaire: "14h30-15h30", matiere: "Français", professeur: "Mme Dubois", salle: "Salle 102" },
      { horaire: "15h30-15h45", type: "pause" },
      { horaire: "15h45-16h45", matiere: "Histoire-Géo", professeur: "M. Bernard", salle: "Salle 103" }
    ]
  },
  "Semaine 2": {
    classe: "AS2",
    responsable: "Dr AW",
    // Même structure que Semaine 1 avec des données différentes
  }
};

const EmploiDuTemps = () => {
  const [selectedWeek, setSelectedWeek] = useState("Semaine 1");
  const [data, setData] = useState(emploiDuTempsData);

  const handleExportPDF = () => {
    // Logique d'export PDF à implémenter
    console.log("Export PDF de l'emploi du temps");
  };

  const handleRefresh = () => {
    // Logique de rafraîchissement à implémenter
    console.log("Rafraîchissement des données");
  };

  const getMatiereColor = (matiere: string) => {
    const colors: { [key: string]: string } = {
      "Mathématiques": "bg-blue-100 text-blue-800",
      "Français": "bg-green-100 text-green-800",
      "Histoire-Géo": "bg-purple-100 text-purple-800",
      "Anglais": "bg-red-100 text-red-800",
      "Physique-Chimie": "bg-yellow-100 text-yellow-800",
      "SVT": "bg-pink-100 text-pink-800",
      "EPS": "bg-orange-100 text-orange-800"
    };
    return colors[matiere] || "bg-gray-100 text-gray-800";
  };

  return (
    <MainLayout title="EMPLOI DU TEMPS HEBDOMADAIRE">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-[#0046AD]" />
                <span className="font-semibold text-[#0046AD]">Classe: {data[selectedWeek].classe}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-[#0046AD]" />
                <span className="font-semibold text-[#0046AD]">Responsable de filière: {data[selectedWeek].responsable}</span>
              </div>
            </div>
            <Select value={selectedWeek} onValueChange={setSelectedWeek}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sélectionner une semaine" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(data).map((week) => (
                  <SelectItem key={week} value={week}>
                    {week}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Button 
                onClick={handleExportPDF}
                className="bg-[#0046AD] hover:bg-[#003c91] text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                <span>Exporter en PDF</span>
              </Button>
              <Button 
                onClick={handleRefresh}
                className="bg-[#0046AD] hover:bg-[#003c91] text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Actualiser</span>
              </Button>
            </div>
          </div>
        </div>

        <Card className="border-t-4 border-t-[#0046AD]">
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#0046AD]">
                    <TableHead className="text-lg font-bold text-white">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        <span>Horaires</span>
                      </div>
                    </TableHead>
                    <TableHead className="text-lg font-bold text-white">Lundi</TableHead>
                    <TableHead className="text-lg font-bold text-white">Mardi</TableHead>
                    <TableHead className="text-lg font-bold text-white">Mercredi</TableHead>
                    <TableHead className="text-lg font-bold text-white">Jeudi</TableHead>
                    <TableHead className="text-lg font-bold text-white">Vendredi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {["8h00-9h00", "9h00-10h00", "10h00-10h15", "10h15-11h15", "11h15-12h15", "12h15-13h30", "13h30-14h30", "14h30-15h30", "15h30-15h45", "15h45-16h45"].map((horaire) => (
                    <TableRow key={horaire} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium">{horaire}</TableCell>
                      {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"].map((jour) => {
                        const cours = data[selectedWeek][jour]?.find(c => c.horaire === horaire);
                        return (
                          <TableCell key={jour} className="p-2">
                            {cours ? (
                              cours.type === "pause" ? (
                                <div className="h-20 flex items-center justify-center bg-gray-50 rounded-lg">
                                  <Coffee className="h-4 w-4 text-gray-400" />
                                </div>
                              ) : (
                                <div className="p-2 rounded-lg bg-gray-50 border border-gray-200">
                                  <div className="font-semibold text-gray-800">{cours.matiere}</div>
                                  <div className="text-sm text-gray-600">{cours.professeur}</div>
                                  <div className="text-xs text-gray-500">{cours.salle}</div>
                                </div>
                              )
                            ) : (
                              <div className="h-20 flex items-center justify-center text-gray-400">
                                -
                              </div>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="text-center py-4">
          <p className="text-lg font-semibold text-[#0046AD] italic">
            Excellente semaine à vous !!!
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default EmploiDuTemps;
