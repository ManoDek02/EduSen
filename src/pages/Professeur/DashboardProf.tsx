import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ClipboardList, Calendar, BookOpen, Clock, MessageSquare, ArrowLeft, TrendingUp, Target, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const DashboardProf = () => {
  const navigate = useNavigate();
  const [selectedClasse, setSelectedClasse] = useState("Terminal S1");
  const [selectedMatiere, setSelectedMatiere] = useState("Mathématiques");

  // Données de performance
  const performanceData = {
    moyenneClasse: 15.2,
    tauxReussite: 85,
    progression: 12,
    notesDistribution: [
      { note: "0-5", nombre: 2 },
      { note: "6-10", nombre: 5 },
      { note: "11-15", nombre: 12 },
      { note: "16-20", nombre: 8 }
    ],
    evolutionNotes: [
      { mois: "Jan", moyenne: 13.5 },
      { mois: "Fév", moyenne: 14.2 },
      { mois: "Mar", moyenne: 14.8 },
      { mois: "Avr", moyenne: 15.2 }
    ],
    topEleves: [
      { nom: "Marie Martin", note: 19, progression: "+2" },
      { nom: "Pierre Dubois", note: 18, progression: "+1" },
      { nom: "Sophie Bernard", note: 17, progression: "+3" }
    ],
    elevesEnDifficulte: [
      { nom: "Lucas Petit", note: 8, progression: "-1" },
      { nom: "Emma Durand", note: 9, progression: "-2" },
      { nom: "Thomas Moreau", note: 10, progression: "0" }
    ]
  };

  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/professeurs/emploi-du-temps')}
          className="hover:bg-slate-100"
        >
          <ArrowLeft className="h-6 w-6 text-[#0046AD]" />
        </Button>
        <h2 className="text-3xl font-bold text-[#0046AD]">Tableau de bord professeur</h2>
      </div>

      {/* Sélecteurs */}
      <div className="flex gap-4 mb-6">
        <Select value={selectedClasse} onValueChange={setSelectedClasse}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sélectionner une classe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Terminal S1">Terminal S1</SelectItem>
            <SelectItem value="Terminal S2">Terminal S2</SelectItem>
            <SelectItem value="Première S1">Première S1</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedMatiere} onValueChange={setSelectedMatiere}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sélectionner une matière" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Mathématiques">Mathématiques</SelectItem>
            <SelectItem value="Physique-Chimie">Physique-Chimie</SelectItem>
            <SelectItem value="SVT">SVT</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Statistiques principales */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moyenne de la classe</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#0046AD]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceData.moyenneClasse}/20</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de réussite</CardTitle>
            <Target className="h-4 w-4 text-[#0046AD]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceData.tauxReussite}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progression</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#0046AD]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceData.progression}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Élèves en difficulté</CardTitle>
            <AlertCircle className="h-4 w-4 text-[#0046AD]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceData.elevesEnDifficulte.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribution des notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData.notesDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="note" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="nombre" fill="#0046AD" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Évolution des moyennes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData.evolutionNotes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mois" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="moyenne" stroke="#0046AD" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top élèves et élèves en difficulté */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top élèves</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceData.topEleves.map((eleve, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{eleve.nom}</p>
                    <p className="text-sm text-gray-500">Note: {eleve.note}/20</p>
                  </div>
                  <span className="text-green-500">{eleve.progression}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Élèves en difficulté</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceData.elevesEnDifficulte.map((eleve, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{eleve.nom}</p>
                    <p className="text-sm text-gray-500">Note: {eleve.note}/20</p>
                  </div>
                  <span className="text-red-500">{eleve.progression}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardProf; 