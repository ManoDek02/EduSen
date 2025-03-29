import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ClipboardList, Calendar, Bell, MessageSquare, Trophy, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const DashboardParent = () => {
  const navigate = useNavigate();
  // Ces données seront à remplacer par des données réelles de l'API
  const stats = {
    nombreEnfants: 2,
    moyenneGenerale: {
      enfant1: 15.5,
      enfant2: 14.8
    },
    prochainesEvaluations: 3,
    absencesNonJustifiees: 1,
    messagesNonLus: 2,
    reunionsParents: 1
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/parents')}
          className="hover:bg-slate-100"
        >
          <ArrowLeft className="h-6 w-6 text-[#0046AD]" />
        </Button>
        <h2 className="text-3xl font-bold text-[#0046AD]">Tableau de bord parent</h2>
      </div>
      
      {/* Moyennes des enfants */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Ahmed - Terminal S1</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Trophy className="h-8 w-8 text-[#0046AD]" />
              <div>
                <p className="text-3xl font-bold text-[#0046AD]">{stats.moyenneGenerale.enfant1}/20</p>
                <p className="text-sm text-gray-500">Moyenne générale</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fatima - 2nde A</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Trophy className="h-8 w-8 text-[#0046AD]" />
              <div>
                <p className="text-3xl font-bold text-[#0046AD]">{stats.moyenneGenerale.enfant2}/20</p>
                <p className="text-sm text-gray-500">Moyenne générale</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistiques */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prochaines évaluations</CardTitle>
            <ClipboardList className="h-4 w-4 text-[#0046AD]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.prochainesEvaluations}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absences non justifiées</CardTitle>
            <Bell className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.absencesNonJustifiees}</div>
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

      {/* Événements à venir */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Événements à venir</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Calendar className="h-4 w-4 text-[#0046AD]" />
                <div>
                  <p className="font-medium">Réunion parents-professeurs</p>
                  <p className="text-sm text-gray-500">Terminal S1</p>
                </div>
              </div>
              <p className="text-sm font-medium">15 Mars 2024</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Calendar className="h-4 w-4 text-[#0046AD]" />
                <div>
                  <p className="font-medium">Conseil de classe</p>
                  <p className="text-sm text-gray-500">2nde A</p>
                </div>
              </div>
              <p className="text-sm font-medium">22 Mars 2024</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dernières notes */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Dernières notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Ahmed - Mathématiques</p>
                <p className="text-sm text-gray-500">Devoir surveillé</p>
              </div>
              <p className="text-lg font-bold text-[#0046AD]">16/20</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Fatima - Physique</p>
                <p className="text-sm text-gray-500">Contrôle continu</p>
              </div>
              <p className="text-lg font-bold text-[#0046AD]">15/20</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardParent; 