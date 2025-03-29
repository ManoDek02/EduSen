import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, FileText, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Données de test
const notesData = {
  "2023-2024": {
    semestre1: {
      "Mathématiques": { note1: 15, note2: 14, coefficient: 4 },
      "Français": { note1: 12, note2: 13, coefficient: 3 },
      "Histoire-Géographie": { note1: 14, note2: 15, coefficient: 3 },
      "Anglais": { note1: 16, note2: 17, coefficient: 3 },
      "Physique-Chimie": { note1: 8, note2: 11, coefficient: 4 },
      "SVT": { note1: 13, note2: 14, coefficient: 3 },
      "EPS": { note1: 15, note2: 16, coefficient: 2 }
    },
    semestre2: {
      "Mathématiques": { note1: 14, note2: 15, coefficient: 4 },
      "Français": { note1: 13, note2: 14, coefficient: 3 },
      "Histoire-Géographie": { note1: 15, note2: 16, coefficient: 3 },
      "Anglais": { note1: 17, note2: 18, coefficient: 3 },
      "Physique-Chimie": { note1: 11, note2: 12, coefficient: 4 },
      "SVT": { note1: 14, note2: 15, coefficient: 3 },
      "EPS": { note1: 16, note2: 17, coefficient: 2 }
    }
  },
  "2022-2023": {
    semestre1: {
      "Mathématiques": { note1: 13, note2: 12, coefficient: 4 },
      "Français": { note1: 11, note2: 13, coefficient: 3 },
      "Histoire-Géographie": { note1: 12, note2: 11, coefficient: 3 },
      "Anglais": { note1: 14, note2: 15, coefficient: 3 },
      "Physique-Chimie": { note1: 10, note2: 9, coefficient: 4 },
      "SVT": { note1: 12, note2: 13, coefficient: 3 },
      "EPS": { note1: 14, note2: 15, coefficient: 2 }
    },
    semestre2: {
      "Mathématiques": { note1: 12, note2: 13, coefficient: 4 },
      "Français": { note1: 13, note2: 14, coefficient: 3 },
      "Histoire-Géographie": { note1: 11, note2: 12, coefficient: 3 },
      "Anglais": { note1: 15, note2: 16, coefficient: 3 },
      "Physique-Chimie": { note1: 9, note2: 10, coefficient: 4 },
      "SVT": { note1: 13, note2: 14, coefficient: 3 },
      "EPS": { note1: 15, note2: 16, coefficient: 2 }
    }
  }
};

const NotesEleve = () => {
  const [selectedYear, setSelectedYear] = useState("2023-2024");
  const navigate = useNavigate();

  const calculateAverage = (semester: any) => {
    let totalPoints = 0;
    let totalCoefficients = 0;
    Object.values(semester).forEach((matiere: any) => {
      const moyenne = (matiere.note1 + matiere.note2) / 2;
      totalPoints += moyenne * matiere.coefficient;
      totalCoefficients += matiere.coefficient;
    });
    return totalPoints / totalCoefficients;
  };

  const calculateMatiereAverage = (matiere: string) => {
    const note1 = notesData[selectedYear].semestre1[matiere];
    const note2 = notesData[selectedYear].semestre2[matiere];
    return ((note1.note1 + note1.note2 + note2.note1 + note2.note2) / 4).toFixed(1);
  };

  const getNoteStyle = (note: number) => {
    if (note < 10) return "text-red-500 font-semibold";
    return "";
  };

  return (
    <MainLayout title={`Notes de "2023-2024-001"`}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-[#0046AD]">Suivi des notes</h2>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sélectionner une année" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(notesData).map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Premier Semestre */}
        <Card className="border-t-4 border-t-[#0046AD]">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-[#0046AD]">Semestre 1</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table className="font-georgia">
                <TableHeader>
                  <TableRow className="bg-green-100">
                    <TableHead className="text-lg font-bold text-black">Matières</TableHead>
                    <TableHead className="text-center text-lg font-bold text-black">Note 1</TableHead>
                    <TableHead className="text-center text-lg font-bold text-black">Note 2</TableHead>
                    <TableHead className="text-center text-lg font-bold text-black">Coefficient</TableHead>
                    <TableHead className="text-center text-lg font-bold text-black">Moyenne</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(notesData[selectedYear].semestre1).map(([matiere, notes]: [string, any]) => (
                    <TableRow key={matiere} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium">{matiere}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className={getNoteStyle(notes.note1)}>
                            {notes.note1}/20
                          </span>
                          {notes.note1 < 10 && (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className={getNoteStyle(notes.note2)}>
                            {notes.note2}/20
                          </span>
                          {notes.note2 < 10 && (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{notes.coefficient}</TableCell>
                      <TableCell className="text-center">
                        <span className={getNoteStyle((notes.note1 + notes.note2) / 2)}>
                          {((notes.note1 + notes.note2) / 2).toFixed(1)}/20
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-blue-50 font-bold">
                    <TableCell colSpan={4} className="text-right">Moyenne générale du semestre :</TableCell>
                    <TableCell className="text-center">{calculateAverage(notesData[selectedYear].semestre1).toFixed(2)}/20</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Deuxième Semestre */}
        <Card className="border-t-4 border-t-[#0046AD]">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-[#0046AD]">Semestre 2</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table className="font-georgia">
                <TableHeader>
                  <TableRow className="bg-green-100">
                    <TableHead className="text-lg font-bold text-black">Matières</TableHead>
                    <TableHead className="text-center text-lg font-bold text-black">Note 1</TableHead>
                    <TableHead className="text-center text-lg font-bold text-black">Note 2</TableHead>
                    <TableHead className="text-center text-lg font-bold text-black">Coefficient</TableHead>
                    <TableHead className="text-center text-lg font-bold text-black">Moyenne</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(notesData[selectedYear].semestre2).map(([matiere, notes]: [string, any]) => (
                    <TableRow key={matiere} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium">{matiere}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className={getNoteStyle(notes.note1)}>
                            {notes.note1}/20
                          </span>
                          {notes.note1 < 10 && (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className={getNoteStyle(notes.note2)}>
                            {notes.note2}/20
                          </span>
                          {notes.note2 < 10 && (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{notes.coefficient}</TableCell>
                      <TableCell className="text-center">
                        <span className={getNoteStyle((notes.note1 + notes.note2) / 2)}>
                          {((notes.note1 + notes.note2) / 2).toFixed(1)}/20
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-blue-50 font-bold">
                    <TableCell colSpan={4} className="text-right">Moyenne générale du semestre :</TableCell>
                    <TableCell className="text-center">{calculateAverage(notesData[selectedYear].semestre2).toFixed(2)}/20</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[#0046AD] text-lg px-4 py-2">
              <GraduationCap className="mr-2 h-5 w-5" />
              Moyenne générale: {((calculateAverage(notesData[selectedYear].semestre1) + 
                calculateAverage(notesData[selectedYear].semestre2)) / 2).toFixed(2)}/20
            </Badge>
          </div>
          <Button 
            onClick={() => navigate('/eleves/bulletin')}
            className="bg-[#0046AD] hover:bg-[#003c91] text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            <FileText className="h-5 w-5" />
            <span className="font-medium">Voir le bulletin</span>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotesEleve;
