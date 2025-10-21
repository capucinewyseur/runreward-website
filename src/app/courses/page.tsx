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
    name: "Marathon de la Solidarité",
    location: "Bois de Vincennes, Paris",
    date: "2024-05-20",
    distance: "42.2 km",
    reward: "500€ + voyage sportif",
    description: "Marathon caritatif au profit des associations locales. Défi sportif et engagement social.",
    maxParticipants: 100,
    currentParticipants: 78,
    difficulty: 'Difficile',
    type: 'Route',
    image: "/api/placeholder/400/250",
    coordinates: { lat: 48.8282, lng: 2.4395 } // Bois de Vincennes, Paris
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
    type: 'Route',
    image: "/api/placeholder/400/250",
    coordinates: { lat: 48.8566, lng: 2.3522 } // Quai de Seine, Paris
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
    type: 'Trail',
    image: "/api/placeholder/400/250",
    coordinates: { lat: 48.4047, lng: 2.7012 } // Fontainebleau
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
    type: 'Route',
    image: "/api/placeholder/400/250",
    coordinates: { lat: 48.8808, lng: 2.3833 } // Parc des Buttes-Chaumont, Paris
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
    type: 'Trail',
    image: "/api/placeholder/400/250",
    coordinates: { lat: 45.9237, lng: 6.8694 } // Chamonix
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
  const [filter, setFilter] = useState<'all' | 'easy' | 'moderate' | 'hard'>('all');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [radiusKm, setRadiusKm] = useState<number>(50);
  const [useGeoFilter, setUseGeoFilter] = useState<boolean>(false);

  const filteredRaces = races.filter(race => {
    const matchesSearch = race.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         race.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         race.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDifficulty = filter === 'all' || 
                         (filter === 'easy' && race.difficulty === 'Facile') ||
                         (filter === 'moderate' && race.difficulty === 'Modéré') ||
                         (filter === 'hard' && race.difficulty === 'Difficile');
    
    const matchesLocation = !locationFilter || 
                           race.location.toLowerCase().includes(locationFilter.toLowerCase());
    
    const matchesDate = !dateFilter || race.date === dateFilter;
    
    // Filtre géographique
    let matchesGeo = true;
    if (useGeoFilter && selectedCity) {
      try {
        const selectedCityData = majorCities.find(city => city.name === selectedCity);
        if (selectedCityData && race.coordinates) {
          const distance = calculateDistance(
            selectedCityData.coordinates.lat,
            selectedCityData.coordinates.lng,
            race.coordinates.lat,
            race.coordinates.lng
          );
          matchesGeo = distance <= radiusKm && distance !== Infinity;
        }
      } catch (error) {
        console.error('Erreur dans le filtre géographique:', error);
        matchesGeo = true; // En cas d'erreur, on affiche toutes les courses
      }
    }
    
    return matchesSearch && matchesDifficulty && matchesLocation && matchesDate && matchesGeo;
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

  // Obtenir les lieux uniques pour le filtre
  const uniqueLocations = Array.from(new Set(races.map(race => race.location.split(',')[0])));

  // Obtenir les dates uniques pour le filtre
  const uniqueDates = Array.from(new Set(races.map(race => race.date))).sort();

  // Villes principales avec coordonnées
  const majorCities = [
    { name: 'Paris', coordinates: { lat: 48.8566, lng: 2.3522 } },
    { name: 'Lyon', coordinates: { lat: 45.7640, lng: 4.8357 } },
    { name: 'Marseille', coordinates: { lat: 43.2965, lng: 5.3698 } },
    { name: 'Toulouse', coordinates: { lat: 43.6047, lng: 1.4442 } },
    { name: 'Nice', coordinates: { lat: 43.7102, lng: 7.2620 } },
    { name: 'Nantes', coordinates: { lat: 47.2184, lng: -1.5536 } },
    { name: 'Strasbourg', coordinates: { lat: 48.5734, lng: 7.7521 } },
    { name: 'Montpellier', coordinates: { lat: 43.6110, lng: 3.8767 } },
    { name: 'Bordeaux', coordinates: { lat: 44.8378, lng: -0.5792 } },
    { name: 'Lille', coordinates: { lat: 50.6292, lng: 3.0573 } },
    { name: 'Genève', coordinates: { lat: 46.2044, lng: 6.1432 } },
    { name: 'Chamonix', coordinates: { lat: 45.9237, lng: 6.8694 } },
    { name: 'Fontainebleau', coordinates: { lat: 48.4047, lng: 2.7012 } }
  ];

  // Fonction pour calculer la distance entre deux points (formule de Haversine)
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    try {
      // Vérification des paramètres
      if (!lat1 || !lng1 || !lat2 || !lng2 || 
          isNaN(lat1) || isNaN(lng1) || isNaN(lat2) || isNaN(lng2)) {
        return Infinity;
      }

      const R = 6371; // Rayon de la Terre en km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLng = (lng2 - lng1) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;
      
      return isNaN(distance) ? Infinity : distance;
    } catch (error) {
      console.error('Erreur dans le calcul de distance:', error);
      return Infinity;
    }
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
          {/* Filtre géographique */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg border border-blue-200">
            <div className="flex items-center mb-3">
              <input
                type="checkbox"
                id="geoFilter"
                checked={useGeoFilter}
                onChange={(e) => setUseGeoFilter(e.target.checked)}
                className="mr-2 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="geoFilter" className="text-sm font-medium text-gray-700">
                🗺️ Recherche géographique
              </label>
            </div>
            
            {useGeoFilter && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ville de référence</label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner une ville</option>
                    {majorCities.map(city => (
                      <option key={city.name} value={city.name}>{city.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rayon: {radiusKm} km
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    step="10"
                    value={radiusKm}
                    onChange={(e) => setRadiusKm(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>10km</span>
                    <span>200km</span>
                  </div>
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setUseGeoFilter(false);
                      setSelectedCity('');
                      setRadiusKm(50);
                    }}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-orange-500 transition-colors"
                  >
                    Désactiver
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
              <input
                type="text"
                placeholder="Nom, lieu, description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            
            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lieu</label>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Tous les lieux</option>
                {uniqueLocations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Toutes les dates</option>
                {uniqueDates.map(date => (
                  <option key={date} value={date}>{formatDate(date)}</option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulté</label>
              <div className="flex gap-1">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    filter === 'all' 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Toutes
                </button>
                <button
                  onClick={() => setFilter('easy')}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    filter === 'easy' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Facile
                </button>
                <button
                  onClick={() => setFilter('moderate')}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    filter === 'moderate' 
                      ? 'bg-yellow-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Modéré
                </button>
                <button
                  onClick={() => setFilter('hard')}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
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
          
          {/* Reset Filters */}
          <div className="flex justify-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setLocationFilter('');
                setDateFilter('');
                setFilter('all');
                setUseGeoFilter(false);
                setSelectedCity('');
                setRadiusKm(50);
              }}
              className="px-4 py-2 text-sm text-gray-600 hover:text-orange-500 transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        </div>

        {/* Races Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRaces.map((race) => (
            <div key={race.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900">
                    <span className="mr-2" aria-hidden>🏅</span>{race.name}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(race.difficulty)}`}>
                    {race.difficulty}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <span className="mr-2" aria-hidden>📍</span>
                    {race.location}
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <span className="mr-2" aria-hidden>📅</span>
                    {formatDate(race.date)}
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <span className="mr-2" aria-hidden>🏁</span>
                    {race.distance}
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{race.description}</p>
                
                <div className="bg-orange-50 p-4 rounded-lg mb-4">
                  <div className="text-base md:text-lg font-semibold text-orange-800 mb-1"><span className="mr-2" aria-hidden>🎁</span>Récompense</div>
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
