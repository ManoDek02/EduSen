
import React from 'react';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Layers, 
  Clock, 
  FileText 
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/dashboard/StatCard';
import RecentActivityCard from '@/components/dashboard/RecentActivityCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Exemple d'activités récentes
const recentActivities = [
  {
    id: '1',
    user: {
      name: 'Marie Dubois',
      role: 'Professeur'
    },
    action: 'a ajouté les notes de',
    target: 'Mathématiques - Classe de 3ème A',
    timestamp: 'Il y a 10 minutes'
  },
  {
    id: '2',
    user: {
      name: 'Thomas Martin',
      role: 'Administrateur'
    },
    action: 'a modifié l\'emploi du temps de la',
    target: 'Classe de 1ère B',
    timestamp: 'Il y a 2 heures'
  },
  {
    id: '3',
    user: {
      name: 'Clara Bernard',
      role: 'Secrétaire'
    },
    action: 'a enregistré un nouvel',
    target: 'élève en classe de 6ème C',
    timestamp: 'Hier à 15:30'
  },
  {
    id: '4',
    user: {
      name: 'Pierre Lambert',
      role: 'Professeur'
    },
    action: 'a publié le programme de',
    target: 'Histoire-Géographie - Terminale S',
    timestamp: 'Il y a 2 jours'
  }
];

// Données de la carte de prochains événements
const upcomingEvents = [
  {
    id: '1',
    title: 'Conseils de classe 3ème trimestre',
    date: '15 juin 2023',
    time: '14:00 - 18:00',
    location: 'Salle du conseil'
  },
  {
    id: '2',
    title: 'Réunion parents-professeurs',
    date: '20 juin 2023',
    time: '17:00 - 20:00',
    location: 'Hall principal'
  },
  {
    id: '3',
    title: 'Remise des bulletins',
    date: '28 juin 2023',
    time: '09:00 - 12:00',
    location: 'Salles de classe'
  }
];

const Dashboard = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title="Tableau de bord"
          description="Aperçu de la gestion scolaire"
          actions={
            <Button>Exporter des rapports</Button>
          }
        />

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="Élèves"
            value="742"
            icon={<GraduationCap size={24} />}
            description="Total des élèves inscrits"
            trend={{ value: 5, isPositive: true }}
            className="animate-scale-in"
          />
          <StatCard
            title="Professeurs"
            value="58"
            icon={<Users size={24} />}
            description="Personnel enseignant"
            className="animate-scale-in animation-delay-100"
          />
          <StatCard
            title="Classes"
            value="32"
            icon={<Layers size={24} />}
            description="Réparties sur tous les niveaux"
            className="animate-scale-in animation-delay-200"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <RecentActivityCard activities={recentActivities} />
          </div>

          {/* Upcoming Events */}
          <div>
            <Card className="h-full animate-fade-in animation-delay-300">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Événements à venir</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="divide-y">
                  {upcomingEvents.map((event) => (
                    <li key={event.id} className="px-6 py-4 hover:bg-muted/40 transition-colors">
                      <div className="space-y-1">
                        <h4 className="font-medium">{event.title}</h4>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          {event.date} • {event.time}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          📍 {event.location}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-primary/5 border-primary/20 animate-fade-in animation-delay-400 hover:shadow-md transition-all">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
                <GraduationCap size={24} />
              </div>
              <h3 className="font-medium">Gestion des élèves</h3>
              <p className="text-sm text-muted-foreground mb-4">Inscriptions, dossiers et suivi</p>
              <Button variant="outline" size="sm" className="w-full">Accéder</Button>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20 animate-fade-in animation-delay-500 hover:shadow-md transition-all">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
                <Clock size={24} />
              </div>
              <h3 className="font-medium">Emploi du temps</h3>
              <p className="text-sm text-muted-foreground mb-4">Planning des cours et activités</p>
              <Button variant="outline" size="sm" className="w-full">Accéder</Button>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20 animate-fade-in animation-delay-600 hover:shadow-md transition-all">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
                <BookOpen size={24} />
              </div>
              <h3 className="font-medium">Notes & Évaluations</h3>
              <p className="text-sm text-muted-foreground mb-4">Saisie et consultation des notes</p>
              <Button variant="outline" size="sm" className="w-full">Accéder</Button>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20 animate-fade-in animation-delay-700 hover:shadow-md transition-all">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
                <FileText size={24} />
              </div>
              <h3 className="font-medium">Bulletins scolaires</h3>
              <p className="text-sm text-muted-foreground mb-4">Génération et historique</p>
              <Button variant="outline" size="sm" className="w-full">Accéder</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
