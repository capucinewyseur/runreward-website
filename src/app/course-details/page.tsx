'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Race {
  id: number;
  name: string;
  location: string;
  department: string;
  date: string;
  distance: string;
  reward: string;
  description: string;
  maxParticipants: number;
  currentParticipants: number;
  type: 'Route' | 'Trail';
  image: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

const races: Race[] = [
  {
    id: 1,
    name: "Course du Printemps",
    location: "Parc de la Villette, Paris",
    department: "Paris (75)",
    date: "2024-04-15",
    distance: "10 km",
    reward: "100€ + équipement de course",
    description: "Course matinale dans le magnifique parc de la Villette. Parfait pour débuter la saison de course.",
    maxParticipants: 200,
    currentParticipants: 156,
    type: 'Route',
    image: "/api/placeholder/400/250",
    coordinates: { lat: 48.8966, lng: 2.3833 }
  },
  {
    id: 2,
    name: "Trail des Alpes",
    location: "Chamonix, Haute-Savoie",
    department: "Haute-Savoie (74)",
    date: "2024-05-20",
    distance: "21 km",
    reward: "150€ + équipement technique",
    description: "Trail en montagne avec vue panoramique sur le Mont-Blanc. Défi pour les coureurs expérimentés.",
    maxParticipants: 100,
    currentParticipants: 89,
    type: 'Trail',
    image: "/api/placeholder/400/250",
    coordinates: { lat: 45.9237, lng: 6.8694 }
  },
  {
    id: 3,
    name: "Course de la Solidarité",
    location: "Parc des Buttes-Chaumont, Paris",
    department: "Paris (75)",
    date: "2024-06-10",
    distance: "5 km",
    reward: "50€ + tee-shirt",
    description: "Course caritative pour soutenir les associations locales. Ouverte à tous les niveaux.",
    maxParticipants: 300,
    currentParticipants: 234,
    type: 'Route',
    image: "/api/placeholder/400/250",
    coordinates: { lat: 48.8833, lng: 2.3833 }
  },
  {
    id: 4,
    name: "Marathon de Lyon",
    location: "Lyon, Rhône",
    department: "Rhône (69)",
    date: "2024-09-15",
    distance: "42.2 km",
    reward: "200€ + médaille + équipement",
    description: "Marathon urbain traversant les plus beaux quartiers de Lyon. Événement majeur de la région.",
    maxParticipants: 5000,
    currentParticipants: 4234,
    type: 'Route',
    image: "/api/placeholder/400/250",
    coordinates: { lat: 45.7640, lng: 4.8357 }
  },
  {
    id: 5,
    name: "Trail de Fontainebleau",
    location: "Forêt de Fontainebleau, Seine-et-Marne",
    department: "Seine-et-Marne (77)",
    date: "2024-07-22",
    distance: "15 km",
    reward: "120€ + casquette + gourde",
    description: "Trail dans la magnifique forêt de Fontainebleau. Parcours varié entre rochers et sentiers forestiers.",
    maxParticipants: 150,
    currentParticipants: 98,
    type: 'Trail',
    image: "/api/placeholder/400/250",
    coordinates: { lat: 48.4047, lng: 2.7012 }
  },
  {
    id: 6,
    name: "Course Nocturne de Nice",
    location: "Promenade des Anglais, Nice",
    department: "Alpes-Maritimes (06)",
    date: "2024-08-05",
    distance: "10 km",
    reward: "80€ + maillot technique",
    description: "Course nocturne le long de la célèbre Promenade des Anglais. Ambiance festive garantie.",
    maxParticipants: 800,
    currentParticipants: 567,
    type: 'Route',
    image: "/api/placeholder/400/250",
    coordinates: { lat: 43.7102, lng: 7.2620 }
  },
  {
    id: 7,
    name: "Generali Genève Marathon",
    location: "Genève, Suisse",
    department: "Suisse",
    date: "2024-12-15",
    distance: "42.2 km",
    reward: "Tee-shirt + casquette + repas + 50% réduction dossard 2026/2027",
    description: "Rejoignez l'équipe de 1200 bénévoles pour faire courir plus de 25000 personnes dans Genève et sa campagne. 14 missions variées ouvertes à tous.",
    maxParticipants: 1200,
    currentParticipants: 856,
    type: 'Route',
    image: "/api/placeholder/400/250",
    coordinates: { lat: 46.2044, lng: 6.1432 }
  }
];

function CourseDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [race, setRace] = useState<Race | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDescription, setShowDescription] = useState(false);

  useEffect(() => {
    const raceId = searchParams.get('raceId');
    if (raceId) {
      const foundRace = races.find(r => r.id === parseInt(raceId));
      if (foundRace) {
        setRace(foundRace);
      }
    }
    setIsLoading(false);
  }, [searchParams]);

  const handleInscription = () => {
    // Afficher la description avant de rediriger
    setShowDescription(true);
    
    // Sauvegarder l'ID de la course pour l'inscription
    if (race) {
      localStorage.setItem('selected-race', JSON.stringify(race));
      // Délai pour permettre à l'utilisateur de voir la description
      setTimeout(() => {
        router.push('/inscription/etape-1');
      }, 2000);
    }
  };


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!race) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course non trouvée</h1>
          <p className="text-gray-600 mb-6">La course demandée n&apos;existe pas.</p>
          <button
            onClick={() => router.push('/courses')}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Retour aux courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {race.name}
            </h1>
            <p className="text-xl md:text-2xl text-orange-100">
              Détails de la course et inscription pour l&apos;encadrement
            </p>
          </div>
        </div>
      </div>

      {/* Course Details */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Course Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{race.name}</h2>
                <div className="flex items-center space-x-4 text-gray-600">
                  <span className="flex items-center">
                    <span className="mr-2">📍</span>
                    {race.location}
                  </span>
                  <span className="flex items-center">
                    <span className="mr-2">📅</span>
                    {formatDate(race.date)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Course Info Grid */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-center text-gray-700">
                  <span className="mr-3 text-orange-500">🏁</span>
                  <div>
                    <span className="font-medium">Distance :</span> {race.distance}
                  </div>
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="mr-3 text-orange-500">🏃</span>
                  <div>
                    <span className="font-medium">Type :</span> {race.type}
                  </div>
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="mr-3 text-orange-500">👥</span>
                  <div>
                    <span className="font-medium">Participants :</span> {race.currentParticipants}/{race.maxParticipants}
                  </div>
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="mr-3 text-orange-500">🏢</span>
                  <div>
                    <span className="font-medium">Département :</span> {race.department}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                {showDescription ? (
                  <p className="text-gray-700 leading-relaxed">
                    {race.description}
                  </p>
                ) : (
                  <p className="text-gray-500 italic">
                    Cliquez sur &quot;Je m&apos;inscris pour l&apos;encadrement&quot; pour voir la description de la course.
                  </p>
                )}
              </div>
            </div>

            {/* Reward Section */}
            <div className="bg-gradient-to-r from-orange-50 to-blue-50 p-6 rounded-lg mb-6">
              <div className="flex items-center text-orange-700 font-semibold mb-3">
                <span className="mr-2 text-2xl">🎁</span>
                <span className="text-xl">Récompenses pour l&apos;encadrement</span>
              </div>
              <p className="text-orange-800 font-medium text-lg">
                {race.reward}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Inscriptions pour l&apos;encadrement</span>
                <span className="text-sm text-gray-500">{race.currentParticipants}/{race.maxParticipants}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(race.currentParticipants / race.maxParticipants) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleInscription}
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-all duration-200 text-lg"
              >
                Je m&apos;inscris pour l&apos;encadrement
              </button>
              <button
                onClick={() => router.push('/courses')}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Retour aux courses
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CourseDetailsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    }>
      <CourseDetailsContent />
    </Suspense>
  );
}
