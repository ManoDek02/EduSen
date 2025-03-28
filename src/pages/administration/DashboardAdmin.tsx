import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { School, Users, GraduationCap, ClipboardList, Calendar, Bell, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const DashboardAdmin = () => {
  const navigate = useNavigate();
  // Ces données seront à remplacer par des données réelles de l'API
  const stats = {
    totalEleves: 1250,
    totalProfesseurs: 45,
    totalClasses: 28,
    notesRecentes: 156,
    coursAujourdhui: 32,
    alertes: 5
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/administration')}
          className="hover:bg-slate-100"
        >
          <ArrowLeft className="h-6 w-6 text-[#0046AD]" />
        </Button>
        <h2 className="text-3xl font-bold text-[#0046AD]">Tableau de bord administratif</h2>
      </div>
      
      {/* Statistiques principales */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Élèves</CardTitle>
            <GraduationCap className="h-4 w-4 text-[#0046AD]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEleves}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Professeurs</CardTitle>
            <Users className="h-4 w-4 text-[#0046AD]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProfesseurs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <School className="h-4 w-4 text-[#0046AD]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClasses}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notes Récentes</CardTitle>
            <ClipboardList className="h-4 w-4 text-[#0046AD]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.notesRecentes}</div>
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
            <CardTitle className="text-sm font-medium">Alertes</CardTitle>
            <Bell className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.alertes}</div>
          </CardContent>
        </Card>
      </div>

      {/* Activités récentes */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Activités Récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="ml-4">
                <p className="text-sm font-medium">Nouvelle note ajoutée</p>
                <p className="text-xs text-gray-500">Il y a 5 minutes</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="ml-4">
                <p className="text-sm font-medium">Absence signalée</p>
                <p className="text-xs text-gray-500">Il y a 15 minutes</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="ml-4">
                <p className="text-sm font-medium">Emploi du temps modifié</p>
                <p className="text-xs text-gray-500">Il y a 1 heure</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardAdmin; 