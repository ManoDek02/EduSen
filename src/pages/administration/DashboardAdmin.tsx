import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { School, Users, GraduationCap, ClipboardList, Calendar, Bell, ArrowLeft, TrendingUp, AlertTriangle, CheckCircle2, Clock, BookOpen, Target, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DashboardAdmin = () => {
  const navigate = useNavigate();
  
  // Données pour les graphiques
  const performanceData = [
    { mois: 'Jan', moyenne: 12.5 },
    { mois: 'Fév', moyenne: 13.2 },
    { mois: 'Mar', moyenne: 12.8 },
    { mois: 'Avr', moyenne: 13.5 },
    { mois: 'Mai', moyenne: 13.8 },
    { mois: 'Juin', moyenne: 14.2 },
  ];

  const repartitionClasses = [
    { classe: '6ème', eleves: 120 },
    { classe: '5ème', eleves: 115 },
    { classe: '4ème', eleves: 110 },
    { classe: '3ème', eleves: 105 },
    { classe: '2nde', eleves: 100 },
    { classe: '1ère', eleves: 95 },
    { classe: 'Terminale', eleves: 90 },
  ];

  // Données par classe
  const classesData = [
    {
      nom: "3ème A",
      eleves: 28,
      moyenneGenerale: 13.5,
      tauxReussite: 92,
      tauxAbsence: 2.5,
      professeurs: 8,
      matieres: [
        { nom: "Mathématiques", moyenne: 14.2, professeur: "M. Dupont" },
        { nom: "Français", moyenne: 13.8, professeur: "Mme Martin" },
        { nom: "Histoire-Géo", moyenne: 13.5, professeur: "M. Bernard" },
      ]
    },
    {
      nom: "3ème B",
      eleves: 25,
      moyenneGenerale: 12.8,
      tauxReussite: 88,
      tauxAbsence: 3.1,
      professeurs: 8,
      matieres: [
        { nom: "Mathématiques", moyenne: 13.5, professeur: "M. Dupont" },
        { nom: "Français", moyenne: 12.9, professeur: "Mme Martin" },
        { nom: "Histoire-Géo", moyenne: 12.7, professeur: "M. Bernard" },
      ]
    },
    {
      nom: "4ème A",
      eleves: 30,
      moyenneGenerale: 13.2,
      tauxReussite: 90,
      tauxAbsence: 2.8,
      professeurs: 8,
      matieres: [
        { nom: "Mathématiques", moyenne: 13.8, professeur: "M. Dupont" },
        { nom: "Français", moyenne: 13.1, professeur: "Mme Martin" },
        { nom: "Histoire-Géo", moyenne: 13.0, professeur: "M. Bernard" },
      ]
    },
    {
      nom: "4ème B",
      eleves: 27,
      moyenneGenerale: 12.9,
      tauxReussite: 87,
      tauxAbsence: 3.3,
      professeurs: 8,
      matieres: [
        { nom: "Mathématiques", moyenne: 13.2, professeur: "M. Dupont" },
        { nom: "Français", moyenne: 12.8, professeur: "Mme Martin" },
        { nom: "Histoire-Géo", moyenne: 12.6, professeur: "M. Bernard" },
      ]
    }
  ];

  // Statistiques
  const stats = {
    totalEleves: 1250,
    totalProfesseurs: 45,
    totalClasses: 28,
    notesRecentes: 156,
    coursAujourdhui: 32,
    alertes: 5,
    tauxReussite: 85,
    tauxAbsence: 3.2,
    tauxRetard: 5.5,
    tauxParticipation: 92
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/administration/eleves')}
          className="hover:bg-slate-100"
        >
          <ArrowLeft className="h-6 w-6 text-[#0046AD]" />
        </Button>
        <h2 className="text-3xl font-bold text-[#0046AD]">Tableau de bord administratif</h2>
      </div>
      
      {/* Statistiques principales */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Élèves</CardTitle>
            <GraduationCap className="h-4 w-4 text-[#0046AD]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEleves}</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2.5% depuis le mois dernier
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Professeurs</CardTitle>
            <Users className="h-4 w-4 text-[#0046AD]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProfesseurs}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {Math.round(stats.totalEleves / stats.totalProfesseurs)} élèves par professeur
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Réussite</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.tauxReussite}%</div>
            <Progress value={stats.tauxReussite} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes</CardTitle>
            <Bell className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.alertes}</div>
            <div className="text-xs text-red-500 mt-1">
              {stats.alertes > 0 ? "Action requise" : "Tout est en ordre"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Évolution des moyennes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
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

        <Card>
          <CardHeader>
            <CardTitle>Répartition par niveau</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={repartitionClasses}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="classe" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="eleves" fill="#0046AD" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Détails par classe */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Détails par classe</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="3ème A" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              {classesData.map((classe) => (
                <TabsTrigger key={classe.nom} value={classe.nom}>
                  {classe.nom}
                </TabsTrigger>
              ))}
            </TabsList>
            {classesData.map((classe) => (
              <TabsContent key={classe.nom} value={classe.nom}>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Élèves</CardTitle>
                      <Users className="h-4 w-4 text-[#0046AD]" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{classe.eleves}</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Moyenne Générale</CardTitle>
                      <Target className="h-4 w-4 text-[#0046AD]" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{classe.moyenneGenerale.toFixed(1)}</div>
                      <Progress value={(classe.moyenneGenerale / 20) * 100} className="mt-2" />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Taux de Réussite</CardTitle>
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-500">{classe.tauxReussite}%</div>
                      <Progress value={classe.tauxReussite} className="mt-2" />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Taux d'Absence</CardTitle>
                      <Activity className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-500">{classe.tauxAbsence}%</div>
                      <Progress value={100 - classe.tauxAbsence} className="mt-2" />
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Matières principales</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    {classe.matieres.map((matiere) => (
                      <Card key={matiere.nom}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">{matiere.nom}</CardTitle>
                          <BookOpen className="h-4 w-4 text-[#0046AD]" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{matiere.moyenne.toFixed(1)}</div>
                          <div className="text-xs text-muted-foreground">{matiere.professeur}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Statistiques secondaires et activités */}
      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Statistiques de présence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Taux d'absence</span>
                  <span className="text-sm text-red-500">{stats.tauxAbsence}%</span>
                </div>
                <Progress value={100 - stats.tauxAbsence} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Taux de retard</span>
                  <span className="text-sm text-yellow-500">{stats.tauxRetard}%</span>
                </div>
                <Progress value={100 - stats.tauxRetard} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Participation aux cours</span>
                  <span className="text-sm text-green-500">{stats.tauxParticipation}%</span>
                </div>
                <Progress value={stats.tauxParticipation} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activités Récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">Nouvelle note ajoutée</p>
                  <p className="text-xs text-gray-500">Il y a 5 minutes</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">Absence signalée</p>
                  <p className="text-xs text-gray-500">Il y a 15 minutes</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Clock className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">Emploi du temps modifié</p>
                  <p className="text-xs text-gray-500">Il y a 1 heure</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardAdmin; 