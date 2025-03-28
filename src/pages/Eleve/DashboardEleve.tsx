import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ClipboardList, Calendar, Clock, Trophy, MessageSquare, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const DashboardEleve = () => {
  const navigate = useNavigate();
  // Ces données seront à remplacer par des données réelles de l'API
  const stats = {
    moyenneGenerale: 15.5,
    prochainCours: "Mathématiques",
    prochainHoraire: "10:30",
    devoirsEnAttente: 3,
    chapitresEnCours: 4,
    messagesNonLus: 2
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/eleve')}
          className="hover:bg-slate-100"
        >
          <ArrowLeft className="h-6 w-6 text-[#0046AD]" />
        </Button>
        <h2 className="text-3xl font-bold text-[#0046AD]">Tableau de bord élève</h2>
      </div>
      
      {/* Moyenne générale */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Moyenne Générale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Trophy className="h-8 w-8 text-[#0046AD]" />
              <div>
                <p className="text-3xl font-bold text-[#0046AD]">{stats.moyenneGenerale}/20</p>
                <p className="text-sm text-gray-500">Trimestre en cours</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prochain cours */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Prochain cours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Clock className="h-6 w-6 text-[#0046AD]" />
              <div>
                <p className="text-xl font-bold text-[#0046AD]">{stats.prochainCours}</p>
                <p className="text-sm text-gray-500">Salle 102</p>
              </div>
            </div>
            <div className="text-xl font-bold text-[#0046AD]">{stats.prochainHoraire}</div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Devoirs en attente</CardTitle>
            <ClipboardList className="h-4 w-4 text-[#0046AD]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.devoirsEnAttente}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chapitres en cours</CardTitle>
            <BookOpen className="h-4 w-4 text-[#0046AD]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.chapitresEnCours}</div>
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
                  <p className="font-medium">Mathématiques</p>
                  <p className="text-sm text-gray-500">Salle 102</p>
                </div>
              </div>
              <p className="text-sm font-medium">08:00 - 10:00</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Clock className="h-4 w-4 text-[#0046AD]" />
                <div>
                  <p className="font-medium">Physique-Chimie</p>
                  <p className="text-sm text-gray-500">Salle 205</p>
                </div>
              </div>
              <p className="text-sm font-medium">10:30 - 12:30</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Clock className="h-4 w-4 text-[#0046AD]" />
                <div>
                  <p className="font-medium">Anglais</p>
                  <p className="text-sm text-gray-500">Salle 304</p>
                </div>
              </div>
              <p className="text-sm font-medium">14:00 - 16:00</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardEleve; 