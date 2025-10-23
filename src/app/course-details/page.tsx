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
    // Sauvegarder l'ID de la course pour l'inscription
    if (race) {
      localStorage.setItem('selected-race', JSON.stringify(race));
      router.push(`/auth?raceId=${race.id}`);
    }
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
        <div className="bg-white rounded shadow-lg overflow-hidden">
          {/* Course Header */}
          <div className="p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{race.name}</h2>
            
            {/* Reward Section */}
            <div className="bg-gradient-to-r from-orange-50 to-blue-50 p-6 rounded mb-8">
              <div className="flex items-center justify-center text-orange-700 font-semibold mb-3">
                <svg className="w-6 h-6 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <span className="text-xl">Les + pour l&apos;encadrement</span>
              </div>
              <p className="text-orange-800 font-medium text-lg">
                {race.reward}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <button
                onClick={handleInscription}
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded text-center transition-all duration-200 text-lg"
              >
                Je m&apos;inscris pour l&apos;encadrement
              </button>
              <button
                onClick={() => router.push('/courses')}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded transition-colors duration-200"
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
