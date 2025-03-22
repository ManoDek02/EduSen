
import React from 'react';
import { formatDate } from '@/lib/utils';
import { Bulletin, BulletinMatiere } from '@/data/bulletinsMockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { School } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';

interface BulletinTemplateProps {
  bulletin: Bulletin;
  printMode?: boolean;
}

const BulletinTemplate: React.FC<BulletinTemplateProps> = ({ bulletin, printMode = false }) => {
  const containerClassName = printMode 
    ? "max-w-4xl mx-auto bg-white p-8 print:p-0" 
    : "max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-lg border";

  return (
    <div className={containerClassName}>
      {/* En-tête du bulletin */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-primary">
            <AvatarFallback className="bg-primary text-primary-foreground">
              <School className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">Collège / Lycée EDUSn</h1>
            <p className="text-muted-foreground">Bulletin de notes - {bulletin.annee}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-medium">Trimestre {bulletin.trimestre}</p>
          <p className="text-muted-foreground">{printMode && bulletin.datePrinted ? `Imprimé le ${formatDate(bulletin.datePrinted)}` : ""}</p>
        </div>
      </div>

      {/* Informations de l'élève */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Informations de l'élève</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Nom et prénom</p>
              <p className="font-medium">{bulletin.eleveNom} {bulletin.elevePrenom}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Classe</p>
              <p className="font-medium">{bulletin.classe}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des matières */}
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-3">Résultats par matière</h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Matière</TableHead>
                <TableHead className="w-[100px] text-center">Moyenne</TableHead>
                <TableHead className="w-[100px] text-center">Moy. Classe</TableHead>
                <TableHead className="w-[150px]">Professeur</TableHead>
                <TableHead>Appréciation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bulletin.matieres.map((matiere: BulletinMatiere, index: number) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{matiere.matiere}</TableCell>
                  <TableCell className="text-center">
                    <span 
                      className={`font-medium ${
                        matiere.moyenne >= 14 ? 'text-green-600' : 
                        matiere.moyenne >= 10 ? 'text-blue-600' : 
                        'text-red-600'
                      }`}
                    >
                      {matiere.moyenne.toFixed(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">{matiere.moyenneClasse.toFixed(1)}</TableCell>
                  <TableCell>{matiere.professeur}</TableCell>
                  <TableCell className="max-w-[300px]">{matiere.appreciation}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Résultats généraux */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Moyenne générale</CardTitle>
          </CardHeader>
          <CardContent>
            <p 
              className={`text-2xl font-bold ${
                bulletin.moyenneGenerale >= 14 ? 'text-green-600' : 
                bulletin.moyenneGenerale >= 10 ? 'text-blue-600' : 
                'text-red-600'
              }`}
            >
              {bulletin.moyenneGenerale.toFixed(1)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Moyenne de la classe</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-muted-foreground">{bulletin.moyenneClasse.toFixed(1)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Rang dans la classe</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{'N/A'}</p>
          </CardContent>
        </Card>
      </div>

      {/* Appréciation générale */}
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-3">Appréciation générale</h2>
        <Card>
          <CardContent className="p-4">
            <p>{bulletin.appreciationGenerale}</p>
          </CardContent>
        </Card>
      </div>

      {/* Pied de page */}
      <Separator className="my-6" />
      <div className="flex justify-between text-sm text-muted-foreground">
        <div>
          <p>Collège / Lycée EDUSn</p>
          <p>123 Avenue de l'Éducation, 75001 Paris</p>
        </div>
        <div className="text-right">
          <p>contact@edusn.edu</p>
          <p>01 23 45 67 89</p>
        </div>
      </div>
    </div>
  );
};

export default BulletinTemplate;
