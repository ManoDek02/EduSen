import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Printer, UserCog } from "lucide-react";

interface EleveDetailDialogProps {
  eleve: {
    id: string;
    nom: string;
    prenom: string;
    classe: string;
    dateNaissance: string;
    responsable: string;
    status: string;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EleveDetailDialog: React.FC<EleveDetailDialogProps> = ({
  eleve,
  open,
  onOpenChange,
}) => {
  if (!eleve) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Détails de l'élève</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nom</p>
                  <p className="text-base">{eleve.nom}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Prénom</p>
                  <p className="text-base">{eleve.prenom}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Classe</p>
                  <p className="text-base">{eleve.classe}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date de naissance</p>
                  <p className="text-base">{eleve.dateNaissance}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Responsable</p>
                  <p className="text-base">{eleve.responsable}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Statut</p>
                  <Badge variant={eleve.status === 'Actif' ? 'default' : 'secondary'}>
                    {eleve.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Voir le bulletin
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Imprimer
            </Button>
            <Button variant="outline" size="sm">
              <UserCog className="mr-2 h-4 w-4" />
              Gérer le dossier
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EleveDetailDialog;
