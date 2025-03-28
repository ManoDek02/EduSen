import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ClipboardList, Calendar, BookOpen, Clock, MessageSquare, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const DashboardProf = () => {
  const navigate = useNavigate();
  // Ces données seront à remplacer par des données réelles de l'API
  const stats = {
    totalEleves: 120,
    notesAEvaluer: 45,
    coursAujourdhui: 4,
    chapitresTermines: 15,
    prochaineClasse: "Terminal S1 - Mathématiques",
    prochaineHeure: "10:30",
    messagesNonLus: 3
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/professeur')}
          className="hover:bg-slate-100"
        >
          <ArrowLeft className="h-6 w-6 text-[#0046AD]" />
        </Button>
        <h2 className="text-3xl font-bold text-[#0046AD]">Tableau de bord professeur</h2>
      </div>
      
      {/* Prochain cours */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Prochain cours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-bold text-[#0046AD]">{stats.prochaineClasse}</p>
              <p className="text-sm text-gray-500">Dans 30 minutes</p>
            </div>
            <div className="text-2xl font-bold text-[#0046AD]">{stats.prochaineHeure}</div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques principales */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Élèves</CardTitle>
            <Users className="h-4 w-4 text-[#0046AD]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEleves}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notes à Évaluer</CardTitle>
            <ClipboardList className="h-4 w-4 text-[#0046AD]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.notesAEvaluer}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cours Aujourd'hui</CardTitle>
            <Calendar className="h-4 w-4 text-[#0046AD]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.coursAujourdhui}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chapitres Terminés</CardTitle>
            <BookOpen className="h-4 w-4 text-[#0046AD]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.chapitresTermines}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages non lus</CardTitle>
            <MessageSquare className="h-4 w-4 text-[#0046AD]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.messagesNonLus}</div>
          </CardContent>
        </Card>
      </div>

      {/* Emploi du temps du jour */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Emploi du temps aujourd'hui</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Clock className="h-4 w-4 text-[#0046AD]" />
                <div>
                  <p className="font-medium">Terminal S1 - Mathématiques</p>
                  <p className="text-sm text-gray-500">Salle 102</p>
                </div>
              </div>
              <p className="text-sm font-medium">08:00 - 10:00</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Clock className="h-4 w-4 text-[#0046AD]" />
                <div>
                  <p className="font-medium">Terminal S2 - Mathématiques</p>
                  <p className="text-sm text-gray-500">Salle 103</p>
                </div>
              </div>
              <p className="text-sm font-medium">10:30 - 12:30</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardProf; 