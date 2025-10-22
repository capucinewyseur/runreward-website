'use client';

import { useState, useEffect } from 'react';
import { courseDB, Course } from '@/lib/courseDatabase';

export default function CoursesPage() {
  const [races, setRaces] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Charger les courses depuis la base de données
    const allCourses = courseDB.getAllCourses();
    setRaces(allCourses);
  }, []);

  const handleSearch = () => {
    setIsSearching(true);
    
    let filteredRaces = courseDB.getAllCourses();

    // Filtre par terme de recherche
    if (searchTerm) {
      filteredRaces = courseDB.searchCourses(searchTerm);
    }

    // Filtre par lieu
    if (locationFilter) {
      filteredRaces = filteredRaces.filter(race => 
        race.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Filtre par département
    if (departmentFilter) {
      filteredRaces = filteredRaces.filter(race => 
        race.department === departmentFilter
      );
    }

    // Filtre par date
    if (dateFilter) {
      filteredRaces = filteredRaces.filter(race => 
        race.date >= dateFilter
      );
    }

    setRaces(filteredRaces);
    setIsSearching(false);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setLocationFilter('');
    setDateFilter('');
    setDepartmentFilter('');
    setRaces(courseDB.getAllCourses());
  };

  // Obtenir la liste unique des départements
  const departments = [...new Set(courseDB.getAllCourses().map(race => race.department))].sort();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🏃‍♂️ Courses à venir
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez toutes les courses disponibles et trouvez celle qui vous correspond. 
            Participez en tant que bénévole et gagnez des récompenses !
          </p>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">🔍 Rechercher une course</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Recherche générale */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recherche
              </label>
              <input
                type="text"
                placeholder="Nom, lieu, description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F08040]"
              />
            </div>

            {/* Filtre par lieu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lieu
              </label>
              <input
                type="text"
                placeholder="Ville, région..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F08040]"
              />
            </div>

            {/* Filtre par département */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Département
              </label>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F08040]"
              >
                <option value="">Tous les départements</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Filtre par date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date minimum
              </label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F08040]"
              />
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="flex-1 bg-[#F08040] hover:bg-[#e06d2a] text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSearching ? 'Recherche en cours...' : '🔍 Rechercher les courses'}
            </button>
            <button
              onClick={resetFilters}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              🔄 Réinitialiser les filtres
            </button>
          </div>
        </div>

        {/* Liste des courses */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {races.map((race) => {
            return (
              <div key={race.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {/* Image de la course */}
                <div className="h-48 bg-gradient-to-br from-[#F08040]/10 to-[#6A70F0]/10 flex items-center justify-center">
                  <div className="text-6xl">🏃‍♂️</div>
                </div>

                {/* Contenu de la course */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{race.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      race.type === 'Route' ? 'bg-[#6A70F0]/10 text-[#6A70F0]' : 'bg-green-100 text-green-800'
                    }`}>
                      {race.type}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-gray-600 flex items-center">
                      <span className="mr-2">📍</span>
                      {race.location}
                    </p>
                    <p className="text-gray-600 flex items-center">
                      <span className="mr-2">📅</span>
                      {formatDate(race.date)}
                    </p>
                    <p className="text-gray-600 flex items-center">
                      <span className="mr-2">🏁</span>
                      {race.distance}
                    </p>
                    <p className="text-gray-600 flex items-center">
                      <span className="mr-2">🗺️</span>
                      {race.department}
                    </p>
                  </div>

                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                    {race.description}
                  </p>

                  {/* Récompense - Version améliorée */}
                  <div className="bg-gradient-to-r from-[#F08040] to-[#e06d2a] rounded-xl p-4 mb-6 shadow-lg border-2 border-[#F08040]/30">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3">🎁</span>
                      <h4 className="text-lg font-bold text-white">Récompense</h4>
                    </div>
                    <p className="text-white font-semibold text-base leading-relaxed">
                      {race.reward}
                    </p>
                  </div>

                  {/* Bouton d'inscription uniquement */}
                  <div className="w-full">
                    <a
                      href={`/auth?raceId=${race.id}`}
                      className="w-full bg-gradient-to-r from-[#6A70F0] to-[#5a60d4] hover:from-[#5a60d4] hover:to-[#4a50c8] text-white font-bold py-4 px-8 rounded-xl text-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg"
                    >
                      S&apos;inscrire
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Message si aucune course trouvée */}
        {races.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucune course trouvée
            </h3>
            <p className="text-gray-600 mb-4">
              Essayez de modifier vos critères de recherche ou réinitialisez les filtres.
            </p>
            <button
              onClick={resetFilters}
              className="bg-[#F08040] hover:bg-[#e06d2a] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Voir toutes les courses
            </button>
          </div>
        )}
      </div>
    </div>
  );
}