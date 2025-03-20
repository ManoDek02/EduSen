
import React from 'react';
import { Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const EleveDetailDialog = ({ eleve }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Détails de l'élève</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="informations" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="informations">Informations</TabsTrigger>
            <TabsTrigger value="scolarite">Scolarité</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
          </TabsList>
          <TabsContent value="informations" className="space-y-4 pt-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg">{eleve.prenom[0]}{eleve.nom[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-medium">{eleve.prenom} {eleve.nom}</h3>
                <p className="text-sm text-muted-foreground">Élève en {eleve.classe}</p>
              </div>
            </div>
            
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm font-medium">Date de naissance</p>
                    <p className="text-sm text-muted-foreground">{eleve.dateNaissance}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Âge</p>
                    <p className="text-sm text-muted-foreground">14 ans</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Genre</p>
                    <p className="text-sm text-muted-foreground">Féminin</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Numéro d'identification</p>
                    <p className="text-sm text-muted-foreground">E-{eleve.id.padStart(5, '0')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm">Adresse</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm">15 rue des Écoles</p>
                <p className="text-sm">75005 Paris</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="scolarite" className="space-y-4 pt-4">
            <Card>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm">Classe actuelle</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm font-medium">{eleve.classe}</p>
                <p className="text-sm text-muted-foreground">Année scolaire 2023-2024</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm">Parcours scolaire</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3">
                <div className="border-l-2 border-muted pl-4 space-y-3">
                  <div>
                    <p className="text-sm font-medium">2022-2023</p>
                    <p className="text-sm">4ème B - Collège Jean Moulin</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">2021-2022</p>
                    <p className="text-sm">5ème A - Collège Jean Moulin</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="contacts" className="space-y-4 pt-4">
            <Card>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm">Responsable principal</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{eleve.responsable.split(' ')[0][0]}{eleve.responsable.split(' ')[1][0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{eleve.responsable}</p>
                    <p className="text-sm text-muted-foreground">Parent</p>
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <p>📱 06 XX XX XX XX</p>
                  <p>✉️ {eleve.responsable.split(' ')[0].toLowerCase()}.{eleve.responsable.split(' ')[1].toLowerCase()}@email.com</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm">Autres contacts</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground">Aucun autre contact enregistré</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EleveDetailDialog;
