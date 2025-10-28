'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { courseDB, Course } from '@/lib/courseDatabase';
import { userDB } from '@/lib/userDatabase';
import { useRouter } from 'next/navigation';

export default function CoursesPage() {
  const router = useRouter();
  const [races, setRaces] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Charger les courses depuis la base de données
    const allCourses = courseDB.getAllCourses();
    setRaces(allCourses);
    
    // Vérifier si l'utilisateur est connecté
    const currentUser = userDB.getCurrentUser();
    setIsAuthenticated(!!currentUser);
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

  // Fonctions pour gérer les favoris
  const handleFavoriteClick = (courseId: number, courseName: string) => {
    if (!isAuthenticated) {
      // Rediriger vers la page d'authentification
      router.push('/auth');
      return;
    }

    if (userDB.isFavorite(courseId)) {
      userDB.removeFromFavorites(courseId);
    } else {
      userDB.addToFavorites(courseId, courseName);
    }
    
    // Forcer le re-render pour mettre à jour l'état des cœurs
    setRaces([...races]);
  };

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
            Courses à venir
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez toutes les courses disponibles et trouvez celle qui vous correspond. 
            Inscrivez-vous pour l&apos;encadrement de la course en tant que bénévole et gagnez des récompenses !
          </p>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded shadow-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Rechercher une course</h2>
          
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
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F08040]"
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
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F08040]"
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
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F08040]"
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
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F08040]"
              />
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="flex-1 bg-[#F08040] hover:bg-[#e06d2a] text-black px-6 py-3 rounded font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSearching ? 'Recherche en cours...' : 'Rechercher les courses'}
            </button>
            <button
              onClick={resetFilters}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-black px-6 py-3 rounded font-semibold transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        </div>

        {/* Liste des courses */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {races.map((race) => {
            return (
              <div key={race.id} className="bg-white rounded shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {/* Image de la course */}
                <div className="h-48 relative overflow-hidden">
                  <Image
                    src={race.image}
                    alt={race.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>

                {/* Contenu de la course */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 flex-1">{race.name}</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleFavoriteClick(race.id, race.name)}
                        className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                          userDB.isFavorite(race.id) 
                            ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                            : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                        }`}
                        title={userDB.isFavorite(race.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                      >
                        <svg 
                          className="w-5 h-5" 
                          fill={userDB.isFavorite(race.id) ? 'currentColor' : 'none'} 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                          />
                        </svg>
                      </button>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        race.type === 'Route' ? 'bg-[#6A70F0]/10 text-[#6A70F0]' : 'bg-green-100 text-green-800'
                      }`}>
                        {race.type}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-gray-600 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {race.location}
                    </p>
                    <p className="text-gray-600 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(race.date)}
                    </p>
                    <p className="text-gray-600 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {race.distance}
                    </p>
                    <p className="text-gray-600 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {race.department}
                    </p>
                  </div>

                  {/* Les + - Version améliorée */}
                  <div className="bg-white rounded p-4 mb-6 shadow-lg border-2 border-[#F08040]">
                    <div className="flex items-center mb-2">
                      <svg className="w-6 h-6 mr-3 text-[#F08040]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      <h4 className="text-lg font-bold text-black">$ Les +</h4>
                    </div>
                    <p className="text-black font-semibold text-base leading-relaxed">
                      {race.reward}
                    </p>
                  </div>

                  {/* Bouton d'inscription */}
                  <div className="w-full">
                    <a
                      href={`/auth?raceId=${race.id}`}
                      className="w-full bg-gradient-to-r from-[#6A70F0] to-[#5a60d4] hover:from-[#5a60d4] hover:to-[#4a50c8] text-black font-bold py-4 px-2 rounded text-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg block"
                    >
                      S&apos;inscrire comme bénévole
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
            <div className="text-6xl mb-4">
              <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucune course trouvée
            </h3>
            <p className="text-gray-600 mb-4">
              Essayez de modifier vos critères de recherche ou réinitialisez les filtres.
            </p>
            <button
              onClick={resetFilters}
              className="bg-[#F08040] hover:bg-[#e06d2a] text-black px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Voir toutes les courses
            </button>
          </div>
        )}
      </div>
    </div>
  );
}