'use client';

import { useState } from 'react';

interface Race {
  id: number;
  name: string;
  location: string;
  date: string;
  distance: string;
  reward: string;
  description: string;
  maxParticipants: number;
  currentParticipants: number;
  difficulty: string;
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
    date: "2024-04-15",
    distance: "10 km",
    reward: "100€ + équipement de course",
    description: "Course matinale dans le magnifique parc de la Villette. Parfait pour débuter la saison de course.",
    maxParticipants: 200,
    currentParticipants: 156,
    difficulty: 'Facile',
    type: 'Route',
    image: "/api/placeholder/400/250",
    coordinates: { lat: 48.8966, lng: 2.3833 } // Parc de la Villette, Paris
  },
  {
    id: 2,
    name: "Trail des Alpes",
    location: "Chamonix, Haute-Savoie",
    date: "2024-05-20",
    distance: "21 km",
    reward: "150€ + équipement technique",
    description: "Trail en montagne avec vue panoramique sur le Mont-Blanc. Défi pour les coureurs expérimentés.",
    maxParticipants: 100,
    currentParticipants: 89,
    difficulty: 'Difficile',
    type: 'Trail',
    image: "/api/placeholder/400/250",
    coordinates: { lat: 45.9237, lng: 6.8694 } // Chamonix
  },
  {
    id: 3,
    name: "Course de la Solidarité",
    location: "Parc des Buttes-Chaumont, Paris",
    date: "2024-06-10",
    distance: "5 km",
    reward: "50€ + tee-shirt",
    description: "Course caritative pour soutenir les associations locales. Ouverte à tous les niveaux.",
    maxParticipants: 300,
    currentParticipants: 234,
    difficulty: 'Facile',
    type: 'Route',
    image: "/api/placeholder/400/250",
    coordinates: { lat: 48.8833, lng: 2.3833 } // Buttes-Chaumont, Paris
  },
  {
    id: 4,
    name: "Marathon de Lyon",
    location: "Lyon, Rhône",
    date: "2024-09-15",
    distance: "42.2 km",
    reward: "200€ + médaille + équipement",
    description: "Marathon urbain traversant les plus beaux quartiers de Lyon. Événement majeur de la région.",
    maxParticipants: 5000,
    currentParticipants: 4234,
    difficulty: 'Difficile',
    type: 'Route',
    image: "/api/placeholder/400/250",
    coordinates: { lat: 45.7640, lng: 4.8357 } // Lyon
  },
  {
    id: 5,
    name: "Trail de Fontainebleau",
    location: "Forêt de Fontainebleau, Seine-et-Marne",
    date: "2024-07-22",
    distance: "15 km",
    reward: "120€ + casquette + gourde",
    description: "Trail dans la magnifique forêt de Fontainebleau. Parcours varié entre rochers et sentiers forestiers.",
    maxParticipants: 150,
    currentParticipants: 98,
    difficulty: 'Modéré',
    type: 'Trail',
    image: "/api/placeholder/400/250",
    coordinates: { lat: 48.4047, lng: 2.7012 } // Fontainebleau
  },
  {
    id: 6,
    name: "Course Nocturne de Nice",
    location: "Promenade des Anglais, Nice",
    date: "2024-08-05",
    distance: "10 km",
    reward: "80€ + maillot technique",
    description: "Course nocturne le long de la célèbre Promenade des Anglais. Ambiance festive garantie.",
    maxParticipants: 800,
    currentParticipants: 567,
    difficulty: 'Modéré',
    type: 'Route',
    image: "/api/placeholder/400/250",
    coordinates: { lat: 43.7102, lng: 7.2620 } // Nice
  },
  {
    id: 7,
    name: "Generali Genève Marathon",
    location: "Genève, Suisse",
    date: "2024-12-15",
    distance: "42.2 km",
    reward: "Tee-shirt + casquette + repas + 50% réduction dossard 2026/2027",
    description: "Rejoignez l'équipe de 1200 bénévoles pour faire courir plus de 25000 personnes dans Genève et sa campagne. 14 missions variées ouvertes à tous.",
    maxParticipants: 1200,
    currentParticipants: 856,
    difficulty: 'Modéré',
    type: 'Route',
    image: "/api/placeholder/400/250",
    coordinates: { lat: 46.2044, lng: 6.1432 } // Genève, Suisse
  }
];

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRaces = races.filter(race => {
    const matchesSearch = race.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         race.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         race.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Facile': return 'bg-green-100 text-green-800';
      case 'Modéré': return 'bg-yellow-100 text-yellow-800';
      case 'Difficile': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Courses à venir
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto">
              Découvrez toutes les courses bénévoles disponibles et commencez à gagner des récompenses
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="max-w-2xl mx-auto">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
              🔍 Rechercher une course
            </label>
            <input
              type="text"
              placeholder="Nom de la course, lieu, description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 text-center">
            {filteredRaces.length} course{filteredRaces.length > 1 ? 's' : ''} trouvée{filteredRaces.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Races Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRaces.map((race) => (
            <div key={race.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{race.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(race.difficulty)}`}>
                    {race.difficulty}
                  </span>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-gray-600">
                    <span className="mr-2">📍</span>
                    <span>{race.location}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <span className="mr-2">📅</span>
                    <span>{formatDate(race.date)}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <span className="mr-2">🏁</span>
                    <span>{race.distance}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <span className="mr-2">🏃</span>
                    <span>{race.type}</span>
                  </div>
                </div>
                
                <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                  {race.description}
                </p>
                
                <div className="bg-gradient-to-r from-orange-50 to-blue-50 p-4 rounded-lg mb-4">
                  <div className="flex items-center text-orange-700 font-semibold">
                    <span className="mr-2">🎁</span>
                    <span className="text-lg">Récompense</span>
                  </div>
                  <p className="text-orange-800 font-medium mt-1">
                    {race.reward}
                  </p>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm text-gray-500">
                    {race.currentParticipants}/{race.maxParticipants} participants
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {race.id === 7 ? (
                    <a
                      href="https://2d86d697.sibforms.com/serve/MUIFAF4cUc_1flMsDuEl6Sj4mwD-cSNPvCEyzG9GMbP4KE3BIZGL-S2ipfqv0ISuZ3jN162O6I5faEpqEBWxZuu9XqV8OnOYTDLilOpnvqBsJoTAlK_3pbV7pcqEyEsf-XNb97S9r_pTdaFXthaRS62GzG9Gp4rL1A7vAQiPopU2FqzKLOqJGI_q4CwQsyDrcglkOEQCtzDkD-Q=?utm_source=brevo&utm_campaign=GGM25%20-%20Bnvoles%20-%20Remerciementssurvey&utm_medium=email"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2 px-4 rounded-lg text-center transition-all duration-200"
                    >
                      S&apos;inscrire
                    </a>
                  ) : (
                    <button className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200">
                      S&apos;inscrire
                    </button>
                  )}
                  <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                    Détails
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredRaces.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucune course trouvée</h3>
            <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </div>
    </div>
  );
}