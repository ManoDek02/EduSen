import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { School } from "lucide-react";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { Users } from '@/types/user';

// Schéma de validation pour le formulaire de connexion
const loginSchema = z.object({
  matricule: z.string().min(1, { message: "Le matricule est obligatoire" })
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Données de test pour simuler les différents profils
const MOCK_USERS = {
  "ADMIN001": { role: "admin", name: "Admin" },
  "PROF001": { role: "professeur", name: "Marie Dubois" },
  "ELEVE001": { role: "eleve", name: "Alex Martin" },
  "PARENT001": { role: "parent", name: "Paul Dubois" }
};

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      matricule: ""
    }
  });

  const onSubmit = (data: LoginFormValues) => {
    setIsLoading(true);
    
    // Simuler un délai de connexion
    setTimeout(() => {
      const user = (MOCK_USERS as unknown as Users)[data.matricule];
      
      if (user) {
        // Stocker les informations de l'utilisateur dans localStorage
        localStorage.setItem('currentUser', JSON.stringify({
          matricule: data.matricule,
          role: user.role,
          name: user.name
        }));
        
        // Rediriger en fonction du rôle
        switch (user.role) {
          case "admin":
            navigate("/administration/eleves");
            break;
          case "professeur":
            navigate("/professeurs/classes");
            break;
          case "eleve":
            navigate("/eleves/syllabus");
            break;
          case "parent":
            navigate("/parents");
            break;
          default:
            navigate("/");
        }
        
        toast.success(`Bienvenue, ${user.name}`);
      } else {
        toast.error("Matricule invalide");
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0046AD]">
      {/* Header */}
      <header className="bg-[#0046AD] text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center">
          <div className="flex items-center gap-2">
            <School className="h-8 w-8" />
            <h1 className="text-2xl font-bold">EDUSn</h1>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 flex flex-col md:flex-row">
        {/* Left sidebar */}
        <div className="w-full md:w-80 bg-[#0046AD] text-white p-6 flex flex-col">
          <h2 className="text-xl font-bold mb-8">Connexion</h2>
          <div className="mt-auto">
            <p className="text-sm opacity-70">© 2023 EDUSn</p>
            <p className="text-sm opacity-70">Gestion scolaire</p>
          </div>
        </div>
        
        {/* Right content */}
        <div className="flex-1 bg-white rounded-tl-3xl md:rounded-none p-8 md:p-12">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-[#0046AD]">Bienvenue sur EDUSn</h1>
            <p className="text-gray-600 mb-8">Veuillez saisir votre matricule pour accéder à la plateforme</p>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="matricule"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Matricule</FormLabel>
                      <FormControl>
                        <Input placeholder="Saisissez votre matricule" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full bg-[#0046AD] hover:bg-[#003c91]"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <LoadingSpinner className="mr-2" size="sm" />
                        Connexion...
                      </>
                    ) : (
                      "Se connecter"
                    )}
                  </Button>
                </div>
                
                <div className="text-sm text-center text-gray-500 mt-6">
                  <p>Pour les besoins de démonstration, utilisez:</p>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                    <div className="rounded p-1 bg-gray-100">ADMIN001 (Admin)</div>
                    <div className="rounded p-1 bg-gray-100">PROF001 (Professeur)</div>
                    <div className="rounded p-1 bg-gray-100">ELEVE001 (Élève)</div>
                    <div className="rounded p-1 bg-gray-100">PARENT001 (Parent)</div>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
