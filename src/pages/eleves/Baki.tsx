import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FileText, FolderOpen, ChevronRight, ChevronDown, ChevronLeft, Download, Plus, Upload, Eye, ArrowLeft } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

// Données de test pour les classes et leurs sujets
const bakiData = [
  {
    id: 1,
    classe: "AS2",
    matieres: [
      {
        id: 1,
        nom: "Mathématiques",
        sujets: [
          { id: 1, nom: "Sujet BAC 2023", url: "/sujets/math-2023.pdf" },
          { id: 2, nom: "Sujet BAC 2022", url: "/sujets/math-2022.pdf" },
          { id: 3, nom: "Sujet BAC 2021", url: "/sujets/math-2021.pdf" }
        ]
      },
      {
        id: 2,
        nom: "Français",
        sujets: [
          { id: 4, nom: "Sujet BAC 2023", url: "/sujets/fr-2023.pdf" },
          { id: 5, nom: "Sujet BAC 2022", url: "/sujets/fr-2022.pdf" }
        ]
      },
      {
        id: 3,
        nom: "Histoire-Géo",
        sujets: [
          { id: 6, nom: "Sujet BAC 2023", url: "/sujets/hg-2023.pdf" },
          { id: 7, nom: "Sujet BAC 2022", url: "/sujets/hg-2022.pdf" }
        ]
      }
    ]
  },
  {
    id: 2,
    classe: "AS1",
    matieres: [
      {
        id: 4,
        nom: "Physique-Chimie",
        sujets: [
          { id: 8, nom: "Sujet BAC 2023", url: "/sujets/phys-2023.pdf" },
          { id: 9, nom: "Sujet BAC 2022", url: "/sujets/phys-2022.pdf" }
        ]
      },
      {
        id: 5,
        nom: "Anglais",
        sujets: [
          { id: 10, nom: "Sujet BAC 2023", url: "/sujets/angl-2023.pdf" },
          { id: 11, nom: "Sujet BAC 2022", url: "/sujets/angl-2022.pdf" }
        ]
      }
    ]
  }
];

const Baki = () => {
  const navigate = useNavigate();
  const [selectedClasse, setSelectedClasse] = useState<string | null>(null);
  const [expandedMatieres, setExpandedMatieres] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMatiere, setSelectedMatiere] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const toggleMatiere = (matiereId: number) => {
    setExpandedMatieres(prev =>
      prev.includes(matiereId)
        ? prev.filter(id => id !== matiereId)
        : [...prev, matiereId]
    );
  };

  const filteredClasses = bakiData.filter(classe =>
    classe.classe.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMatieres = (matieres: typeof bakiData[0]['matieres']) =>
    matieres.filter(matiere =>
      matiere.nom.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleDownload = (url: string) => {
    // Simuler le téléchargement
    console.log(`Téléchargement du fichier: ${url}`);
  };

  const handleView = (url: string) => {
    // Ouvrir le document dans un nouvel onglet
    window.open(url, '_blank');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      // Définir le nom du document par défaut si vide
      if (!documentName) {
        setDocumentName(selectedFile.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleUpload = async () => {
    if (!file || !selectedMatiere || !documentName) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setIsUploading(true);
    try {
      // Simuler un upload
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Ajouter le nouveau document à la liste
      const classe = bakiData.find(c => c.classe === selectedClasse);
      if (classe) {
        const matiere = classe.matieres.find(m => m.nom === selectedMatiere);
        if (matiere) {
          const newSujet = {
            id: Date.now(),
            nom: documentName,
            url: URL.createObjectURL(file)
          };
          matiere.sujets.unshift(newSujet);
        }
      }

      toast.success("Document ajouté avec succès");
      setFile(null);
      setDocumentName("");
      setSelectedMatiere("");
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Erreur lors de l'ajout du document");
    } finally {
      setIsUploading(false);
    }
  };

  const handleBack = () => {
    navigate(-1); // Retour à la page précédente
  };

  return (
    <MainLayout title="BAKI (ANCIENS SUJETS)">
      <div className="space-y-6">
        {selectedClasse && (
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setSelectedClasse(null)}
              className="text-[#0046AD] hover:bg-[#0046AD]/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux classes
            </Button>
          </div>
        )}
        <Card className="border-t-4 border-t-[#0046AD]">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-[#0046AD]">Anciens sujets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher une classe ou une matière..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {!selectedClasse ? (
              // Vue des classes
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClasses.map((classe) => (
                  <Card
                    key={classe.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedClasse(classe.classe)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <FolderOpen className="h-8 w-8 text-[#0046AD]" />
                        <div>
                          <h3 className="font-semibold text-lg text-[#0046AD]">
                            {classe.classe}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {classe.matieres.length} matières disponibles
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              // Vue des matières d'une classe
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[#0046AD]">
                    {selectedClasse}
                  </h2>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#0046AD] hover:bg-[#003c91] text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter un document
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Ajouter un document</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Matière</Label>
                          <Select value={selectedMatiere} onValueChange={setSelectedMatiere}>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner une matière" />
                            </SelectTrigger>
                            <SelectContent>
                              {bakiData
                                .find(c => c.classe === selectedClasse)
                                ?.matieres.map((matiere) => (
                                  <SelectItem key={matiere.id} value={matiere.nom}>
                                    {matiere.nom}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Nom du document</Label>
                          <Input
                            placeholder="Entrez le nom du document"
                            value={documentName}
                            onChange={(e) => setDocumentName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Document</Label>
                          <Input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="cursor-pointer"
                          />
                          {file && (
                            <p className="text-sm text-gray-500">
                              Fichier sélectionné : {file.name}
                            </p>
                          )}
                        </div>
                        <Button
                          className="w-full bg-[#0046AD] hover:bg-[#003c91] text-white"
                          onClick={handleUpload}
                          disabled={isUploading || !file || !selectedMatiere || !documentName}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {isUploading ? "Ajout en cours..." : "Ajouter le document"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {filteredMatieres(
                  bakiData.find(c => c.classe === selectedClasse)?.matieres || []
                ).map((matiere) => (
                  <Card key={matiere.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div
                        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                        onClick={() => toggleMatiere(matiere.id)}
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-[#0046AD]" />
                          <span className="font-medium">{matiere.nom}</span>
                        </div>
                        {expandedMatieres.includes(matiere.id) ? (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      {expandedMatieres.includes(matiere.id) && (
                        <div className="border-t">
                          {matiere.sujets.map((sujet) => (
                            <div
                              key={sujet.id}
                              className="p-4 flex items-center justify-between hover:bg-gray-50"
                            >
                              <span className="text-sm text-gray-600">{sujet.nom}</span>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleView(sujet.url)}
                                  className="text-[#0046AD]"
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  Voir
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDownload(sujet.url)}
                                  className="text-[#0046AD]"
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Télécharger
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Baki;
