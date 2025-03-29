import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const editEleveSchema = z.object({
  nom: z.string().min(1, "Le nom est obligatoire"),
  prenom: z.string().min(1, "Le prénom est obligatoire"),
  classe: z.string().min(1, "La classe est obligatoire"),
  dateNaissance: z.string().min(1, "La date de naissance est obligatoire"),
  responsable: z.string().min(1, "Le responsable est obligatoire"),
  status: z.string().min(1, "Le statut est obligatoire"),
});

type EditEleveFormValues = z.infer<typeof editEleveSchema>;

interface EditEleveDialogProps {
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
  onSave: (eleve: EditEleveFormValues) => void;
}

const EditEleveDialog: React.FC<EditEleveDialogProps> = ({
  eleve,
  open,
  onOpenChange,
  onSave,
}) => {
  const form = useForm<EditEleveFormValues>({
    resolver: zodResolver(editEleveSchema),
    defaultValues: {
      nom: eleve?.nom || "",
      prenom: eleve?.prenom || "",
      classe: eleve?.classe || "",
      dateNaissance: eleve?.dateNaissance || "",
      responsable: eleve?.responsable || "",
      status: eleve?.status || "",
    },
  });

  React.useEffect(() => {
    if (eleve) {
      form.reset({
        nom: eleve.nom,
        prenom: eleve.prenom,
        classe: eleve.classe,
        dateNaissance: eleve.dateNaissance,
        responsable: eleve.responsable,
        status: eleve.status,
      });
    }
  }, [eleve, form]);

  const onSubmit = (data: EditEleveFormValues) => {
    onSave(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier l'élève</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="prenom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="classe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Classe</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateNaissance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de naissance</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="responsable"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsable</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit">Enregistrer</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEleveDialog; 