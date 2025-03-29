import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Mail, Phone, Building2, RefreshCw } from 'lucide-react';

// Données de test pour les professeurs
const professeursData = [
  {
    id: 1,
    nom: "Martin",
    prenom: "Jean",
    matiere: "Mathématiques",
    email: "jean.martin@edusn.edu",
    telephone: "01 23 45 67 89",
    bureau: "Bureau 101",
    classe: "AS2"
  },
  {
    id: 2,
    nom: "Dubois",
    prenom: "Marie",
    matiere: "Français",
    email: "marie.dubois@edusn.edu",
    telephone: "01 23 45 67 90",
    bureau: "Bureau 102",
    classe: "AS2"
  },
  {
    id: 3,
    nom: "Bernard",
    prenom: "Pierre",
    matiere: "Histoire-Géo",
    email: "pierre.bernard@edusn.edu",
    telephone: "01 23 45 67 91",
    bureau: "Bureau 103",
    classe: "AS2"
  },
  {
    id: 4,
    nom: "Petit",
    prenom: "Sophie",
    matiere: "Anglais",
    email: "sophie.petit@edusn.edu",
    telephone: "01 23 45 67 92",
    bureau: "Bureau 104",
    classe: "AS2"
  },
  {
    id: 5,
    nom: "Durand",
    prenom: "Marc",
    matiere: "Physique-Chimie",
    email: "marc.durand@edusn.edu",
    telephone: "01 23 45 67 93",
    bureau: "Labo 1",
    classe: "AS2"
  }
];

const ContactProfesseurs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredProfesseurs = professeursData.filter(professeur =>
    professeur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    professeur.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    professeur.matiere.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simuler un chargement
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <MainLayout title="CONTACT PROFESSEURS">
      <div className="space-y-6">
        <Card className="border-t-4 border-t-[#0046AD]">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-bold text-[#0046AD]">Liste des professeurs</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="bg-[#0046AD] hover:bg-[#003c91] text-white"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher un professeur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfesseurs.map((professeur) => (
                <Card key={professeur.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div>
                      <h3 className="font-semibold text-lg text-[#0046AD]">
                        {professeur.prenom} {professeur.nom}
                      </h3>
                      <p className="text-sm text-gray-600">{professeur.matiere}</p>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4" />
                          <span>{professeur.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span>{professeur.telephone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Building2 className="h-4 w-4" />
                          <span>{professeur.bureau}</span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button
                          variant="outline"
                          className="w-full bg-[#0046AD] hover:bg-[#003c91] text-white"
                        >
                          Envoyer un message
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ContactProfesseurs;
