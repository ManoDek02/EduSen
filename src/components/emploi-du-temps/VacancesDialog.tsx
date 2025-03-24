import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { Calendar } from "@/components/ui/calendar";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Vacances {
  id: string;
  nom: string;
  dateDebut: Date;
  dateFin: Date;
}

interface VacancesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vacances: Vacances[];
  onAddVacances: (vacances: Vacances) => void;
  onDeleteVacances: (id: string) => void;
}

export const VacancesDialog = ({ open, onOpenChange, vacances, onAddVacances, onDeleteVacances }: VacancesDialogProps) => {
  const [nom, setNom] = useState('');
  const [dateDebut, setDateDebut] = useState<Date | undefined>();
  const [dateFin, setDateFin] = useState<Date | undefined>();

  const handleSubmit = () => {
    if (!nom || !dateDebut || !dateFin) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    if (dateFin < dateDebut) {
      toast.error('La date de fin doit être postérieure à la date de début');
      return;
    }

    onAddVacances({
      id: Date.now().toString(),
      nom,
      dateDebut,
      dateFin
    });

    setNom('');
    setDateDebut(undefined);
    setDateFin(undefined);
    toast.success('Période de vacances ajoutée avec succès');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Gestion des périodes de vacances</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Formulaire d'ajout */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nom de la période</Label>
              <Input
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Ex: Vacances d'été 2024"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date de début</Label>
                <Calendar
                  mode="single"
                  selected={dateDebut}
                  onSelect={setDateDebut}
                  locale={fr}
                />
              </div>
              <div className="space-y-2">
                <Label>Date de fin</Label>
                <Calendar
                  mode="single"
                  selected={dateFin}
                  onSelect={setDateFin}
                  locale={fr}
                />
              </div>
            </div>

            <Button onClick={handleSubmit} className="w-full">
              Ajouter la période
            </Button>
          </div>

          {/* Liste des périodes */}
          <div className="space-y-2">
            <Label>Périodes enregistrées</Label>
            <div className="space-y-2">
              {vacances.map((periode) => (
                <div
                  key={periode.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <div className="font-medium">{periode.nom}</div>
                    <div className="text-sm text-muted-foreground">
                      {format(periode.dateDebut, 'dd MMMM yyyy', { locale: fr })} -{' '}
                      {format(periode.dateFin, 'dd MMMM yyyy', { locale: fr })}
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDeleteVacances(periode.id)}
                  >
                    Supprimer
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 