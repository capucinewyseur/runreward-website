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
  difficulty: 'Facile' | 'Modéré' | 'Difficile';
  image: string;
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
    image: "/api/placeholder/400/250"
  },
  {
    id: 2,
    name: "Marathon de la Solidarité",
    location: "Bois de Vincennes, Paris",
    date: "2024-05-20",
    distance: "42.2 km",
    reward: "500€ + voyage sportif",
    description: "Marathon caritatif au profit des associations locales. Défi sportif et engagement social.",
    maxParticipants: 100,
    currentParticipants: 78,
    difficulty: 'Difficile',
    image: "/api/placeholder/400/250"
  },
  {
    id: 3,
    name: "Course Nocturne",
    location: "Quai de Seine, Paris",
    date: "2024-06-10",
    distance: "5 km",
    reward: "75€ + dîner gastronomique",
    description: "Course nocturne le long de la Seine avec vue sur les monuments parisiens illuminés.",
    maxParticipants: 150,
    currentParticipants: 89,
    difficulty: 'Facile',
    image: "/api/placeholder/400/250"
  },
  {
    id: 4,
    name: "Trail des Monts",
    location: "Fontainebleau",
    date: "2024-07-05",
    distance: "21 km",
    reward: "200€ + week-end nature",
    description: "Trail dans la forêt de Fontainebleau. Parcours technique avec dénivelé positif.",
    maxParticipants: 80,
    currentParticipants: 45,
    difficulty: 'Modéré',
    image: "/api/placeholder/400/250"
  },
  {
    id: 5,
    name: "Course Familiale",
    location: "Parc des Buttes-Chaumont, Paris",
    date: "2024-08-18",
    distance: "3 km",
    reward: "50€ + activités familiales",
    description: "Course accessible à tous les âges. Parfait pour une sortie en famille.",
    maxParticipants: 300,
    currentParticipants: 234,
    difficulty: 'Facile',
    image: "/api/placeholder/400/250"
  },
  {
    id: 6,
    name: "Ultra Trail",
    location: "Chamonix",
    date: "2024-09-22",
    distance: "50 km",
    reward: "1000€ + séjour montagne",
    description: "Ultra trail en montagne. Défi extrême pour les coureurs expérimentés.",
    maxParticipants: 50,
    currentParticipants: 32,
    difficulty: 'Difficile',
    image: "/api/placeholder/400/250"
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
    image: "/api/placeholder/400/250"
  }
];

export default function CoursesPage() {
  const [filter, setFilter] = useState<'all' | 'easy' | 'moderate' | 'hard'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRaces = races.filter(race => {
    const matchesSearch = race.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         race.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'easy' && race.difficulty === 'Facile') ||
                         (filter === 'moderate' && race.difficulty === 'Modéré') ||
                         (filter === 'hard' && race.difficulty === 'Difficile');
    
    return matchesSearch && matchesFilter;
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

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Rechercher une course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            
            {/* Difficulty Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Toutes
              </button>
              <button
                onClick={() => setFilter('easy')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'easy' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Facile
              </button>
              <button
                onClick={() => setFilter('moderate')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'moderate' 
                    ? 'bg-yellow-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Modéré
              </button>
              <button
                onClick={() => setFilter('hard')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'hard' 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Difficile
              </button>
            </div>
          </div>
        </div>

        {/* Races Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRaces.map((race) => (
            <div key={race.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{race.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(race.difficulty)}`}>
                    {race.difficulty}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {race.location}
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(race.date)}
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    {race.distance}
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{race.description}</p>
                
                <div className="bg-orange-50 p-4 rounded-lg mb-4">
                  <div className="text-base md:text-lg font-semibold text-orange-800 mb-1">Récompense</div>
                  <div className="text-2xl md:text-3xl text-orange-600 font-extrabold tracking-tight">{race.reward}</div>
                </div>
                
                {/* Section participants retirée */}
                
                {race.id === 7 ? (
                  <a 
                    href="https://2d86d697.sibforms.com/serve/MUIFAF4cUc_1flMsDuEl6Sj4mwD-cSNPvCEyzG9GMbP4KE3BIZGL-S2ipfqv0ISuZ3jN162O6I5faEpqEBWxZuu9XqV8OnOYTDLilOpnvqBsJoTAlK_3pbV7pcqEyEsf-XNb97S9r_pTdaFXthaRS62GzG9Gp4rL1A7vAQiPopU2FqzKLOqJGI_q4CwQsyDrcglkOEQCtzDkD-Q=?utm_source=brevo&utm_campaign=GGM25%20-%20Bnvoles%20-%20Remerciementssurvey&utm_medium=email"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-medium transition-colors text-center block"
                  >
                    S&apos;inscrire
                  </a>
                ) : (
                  <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                    S&apos;inscrire
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredRaces.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              Aucune course trouvée avec ces critères.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
