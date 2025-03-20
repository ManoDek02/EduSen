
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, FileText, Video, FileQuestion } from 'lucide-react';

const Syllabus = () => {
  // Exemple de cours pour le syllabus
  const courses = [
    {
      id: 1,
      title: "Mathématiques",
      description: "Algèbre, géométrie et analyse",
      topics: ["Équations du second degré", "Géométrie euclidienne", "Trigonométrie", "Suites et séries"],
      professor: "Marie Dubois",
      icon: <FileText className="h-10 w-10 text-blue-600" />
    },
    {
      id: 2,
      title: "Physique-Chimie",
      description: "Mécanique, énergie et transformation de la matière",
      topics: ["Mécanique Newtonienne", "Thermodynamique", "Réactions chimiques", "Électricité"],
      professor: "David Petit",
      icon: <FileQuestion className="h-10 w-10 text-purple-600" />
    },
    {
      id: 3,
      title: "Histoire-Géographie",
      description: "Histoire contemporaine et géographie mondiale",
      topics: ["Le monde après 1945", "Mondialisation", "Géopolitique", "Développement durable"],
      professor: "Thomas Martin",
      icon: <BookOpen className="h-10 w-10 text-green-600" />
    },
    {
      id: 4,
      title: "Anglais",
      description: "Langue et civilisation anglaise",
      topics: ["Compréhension orale", "Expression écrite", "Littérature anglophone", "Civilisation"],
      professor: "Sophie Lambert",
      icon: <Video className="h-10 w-10 text-red-600" />
    }
  ];

  return (
    <MainLayout title="INFORMATIONS GLOBALES SUR LES COURS">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-[#0046AD]">Programme des cours</h2>
        <p className="text-gray-600">
          Consulter le programme des cours pour le semestre en cours
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="border-t-4 border-t-[#0046AD] hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">{course.title}</CardTitle>
                {course.icon}
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-500 mb-3">{course.description}</p>
                <div className="mb-3">
                  <h4 className="text-sm font-medium mb-2">Thèmes abordés :</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {course.topics.map((topic, index) => (
                      <li key={index}>{topic}</li>
                    ))}
                  </ul>
                </div>
                <div className="text-sm text-[#0046AD] font-medium">
                  Professeur: {course.professor}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Syllabus;
