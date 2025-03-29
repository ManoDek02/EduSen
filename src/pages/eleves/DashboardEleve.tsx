import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  Award, 
  AlertTriangle, 
  BookOpen, 
  Target,
  BarChart3,
  Edit2,
  Filter
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type Note = {
  matiere: string;
  note: number;
  coefficient: number;
  date: string;
  semestre: number;
};

type Performance = {
  moyenne: number;
  rang: number;
  totalEleves: number;
  notesInferieures: Note[];
};

const DashboardEleve = () => {
  const [semestre, setSemestre] = useState<number>(1);
  const [performance, setPerformance] = useState<Performance>({
    moyenne: 15.5,
    rang: 3,
    totalEleves: 25,
    notesInferieures: [
      { matiere: 'Mathématiques', note: 8.5, coefficient: 4, date: '2024-03-15', semestre: 1 },
      { matiere: 'Physique', note: 9, coefficient: 3, date: '2024-03-10', semestre: 1 }
    ]
  });

  const [objectif, setObjectif] = useState(16);
  const [nouvelObjectif, setNouvelObjectif] = useState(objectif);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [notes, setNotes] = useState<Note[]>([
    { matiere: 'Mathématiques', note: 8.5, coefficient: 4, date: '2024-03-15', semestre: 1 },
    { matiere: 'Physique', note: 9, coefficient: 3, date: '2024-03-10', semestre: 1 },
    { matiere: 'Français', note: 16, coefficient: 3, date: '2024-03-12', semestre: 1 },
    { matiere: 'Histoire', note: 14, coefficient: 2, date: '2024-03-14', semestre: 1 },
    { matiere: 'Anglais', note: 17, coefficient: 3, date: '2024-03-13', semestre: 1 },
    { matiere: 'Mathématiques', note: 12, coefficient: 4, date: '2024-02-15', semestre: 2 },
    { matiere: 'Physique', note: 15, coefficient: 3, date: '2024-02-10', semestre: 2 },
    { matiere: 'Français', note: 18, coefficient: 3, date: '2024-02-12', semestre: 2 },
    { matiere: 'Histoire', note: 16, coefficient: 2, date: '2024-02-14', semestre: 2 },
    { matiere: 'Anglais', note: 19, coefficient: 3, date: '2024-02-13', semestre: 2 }
  ]);

  const notesFiltrees = notes.filter(note => note.semestre === semestre);
  const notesInferieuresFiltrees = performance.notesInferieures.filter(note => note.semestre === semestre);

  const calculerProgression = () => {
    const progression = (performance.moyenne / objectif) * 100;
    if (progression >= 100) return { status: "atteint", message: "Objectif atteint ! 🎉" };
    if (progression >= 80) return { status: "proche", message: "Plus qu'un petit effort ! 💪" };
    return { status: "loin", message: "Objectif encore loin d'être atteint 😢" };
  };

  const progression = calculerProgression();

  // Calculer les moyennes par matière pour chaque semestre
  const calculerMoyennesParMatiere = () => {
    const moyennes: { [key: string]: { semestre1: number; semestre2: number } } = {};
    
    notes.forEach(note => {
      if (!moyennes[note.matiere]) {
        moyennes[note.matiere] = { semestre1: 0, semestre2: 0 };
      }
      
      if (note.semestre === 1) {
        moyennes[note.matiere].semestre1 = note.note;
      } else {
        moyennes[note.matiere].semestre2 = note.note;
      }
    });

    return Object.entries(moyennes).map(([matiere, moyennes]) => ({
      matiere,
      semestre1: moyennes.semestre1,
      semestre2: moyennes.semestre2
    }));
  };

  const donneesGraphique = calculerMoyennesParMatiere();

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#0046AD]">Mon Tableau de Bord</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={semestre.toString()} onValueChange={(value) => setSemestre(Number(value))}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sélectionner un semestre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Semestre 1</SelectItem>
                  <SelectItem value="2">Semestre 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-gray-500">
              Classe: 3ème A • Année scolaire: 2023-2024
            </div>
          </div>
        </div>

        {/* Cartes de performance */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Moyenne Générale</p>
                  <h3 className="text-2xl font-bold text-[#0046AD]">{performance.moyenne}/20</h3>
                  <p className="text-xs text-gray-500 mt-1">Semestre {semestre}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-[#0046AD]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Rang dans la classe</p>
                  <h3 className="text-2xl font-bold text-[#0046AD]">{performance.rang}/{performance.totalEleves}</h3>
                  <p className="text-xs text-gray-500 mt-1">Semestre {semestre}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Notes &lt; 10</p>
                  <h3 className="text-2xl font-bold text-red-500">{notesInferieuresFiltrees.length}</h3>
                  <p className="text-xs text-gray-500 mt-1">Semestre {semestre}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-500">Objectif</p>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Edit2 className="h-3 w-3" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Modifier l'objectif</DialogTitle>
                        </DialogHeader>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={nouvelObjectif}
                            onChange={(e) => setNouvelObjectif(Number(e.target.value))}
                            min="0"
                            max="20"
                            step="0.1"
                            className="w-24"
                          />
                          <span className="text-sm text-gray-500">/20</span>
                          <Button onClick={() => {
                            setObjectif(nouvelObjectif);
                            setIsDialogOpen(false);
                          }}>Valider</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <h3 className="text-2xl font-bold text-[#0046AD]">{objectif}/20</h3>
                  <p className={`text-sm mt-1 ${
                    progression.status === "atteint" ? "text-green-500" :
                    progression.status === "proche" ? "text-yellow-500" :
                    "text-red-500"
                  }`}>
                    {progression.message}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4">
                <Progress 
                  value={(performance.moyenne / objectif) * 100} 
                  className="h-2"
                  max={100}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notes par matière */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[#0046AD]" />
              Notes par matière - Semestre {semestre}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {notesFiltrees.map((note, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{note.matiere}</h4>
                      <p className="text-sm text-gray-500">Coefficient: {note.coefficient}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-semibold ${note.note < 10 ? 'text-red-500' : 'text-[#0046AD]'}`}>
                        {note.note}/20
                      </span>
                      <Badge variant={note.note < 10 ? "destructive" : "default"}>
                        {note.note < 10 ? "À améliorer" : "Satisfaisant"}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={(note.note / 20) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Graphique d'évolution */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#0046AD]" />
              Comparaison des moyennes par matière
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={donneesGraphique}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="matiere" />
                  <YAxis domain={[0, 20]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="semestre1" 
                    stroke="#0046AD" 
                    name="Semestre 1"
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="semestre2" 
                    stroke="#00C853" 
                    name="Semestre 2"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default DashboardEleve; 