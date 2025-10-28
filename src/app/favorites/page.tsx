'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { userDB, CourseFavorite } from '@/lib/userDatabase';
import { courseDB, Course } from '@/lib/courseDatabase';

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<CourseFavorite[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const currentUser = userDB.getCurrentUser();
    if (!currentUser) {
      router.push('/auth');
      return;
    }

    // Charger les favoris de l'utilisateur
    const userFavorites = userDB.getUserFavorites();
    setFavorites(userFavorites);

    // Charger toutes les courses pour obtenir les détails
    const allCourses = courseDB.getAllCourses();
    setCourses(allCourses);

    setIsLoading(false);
  }, [router]);

  const handleRemoveFavorite = (courseId: number) => {
    userDB.removeFromFavorites(courseId);
    // Mettre à jour la liste des favoris
    const updatedFavorites = userDB.getUserFavorites();
    setFavorites(updatedFavorites);
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Mes courses favorites
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Retrouvez ici toutes les courses que vous avez mises en favori pour l&apos;encadrement.
          </p>
        </div>

        {/* Liste des favoris */}
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">
              <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucune course en favori
            </h3>
            <p className="text-gray-600 mb-6">
              Vous n&apos;avez pas encore mis de courses en favori. 
              Explorez nos courses et ajoutez celles qui vous intéressent !
            </p>
            <button
              onClick={() => router.push('/courses')}
              className="bg-[#F08040] hover:bg-[#e06d2a] text-black px-6 py-3 rounded font-semibold transition-colors"
            >
              Découvrir les courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((favorite) => {
              const course = courses.find(c => c.id === favorite.courseId);
              if (!course) return null;

              return (
                <div key={favorite.id} className="bg-white rounded shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  {/* Image de la course */}
                  <div className="h-48 bg-gradient-to-br from-[#F08040]/10 to-[#6A70F0]/10 flex items-center justify-center">
                    <svg className="w-16 h-16 text-[#F08040]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>

                  {/* Contenu de la course */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900 flex-1">{course.name}</h3>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleRemoveFavorite(course.id)}
                          className="p-2 rounded-full transition-all duration-200 hover:scale-110 text-red-500 bg-red-50 hover:bg-red-100"
                          title="Retirer des favoris"
                        >
                          <svg 
                            className="w-5 h-5" 
                            fill="currentColor" 
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
                          course.type === 'Route' ? 'bg-[#6A70F0]/10 text-[#6A70F0]' : 'bg-green-100 text-green-800'
                        }`}>
                          {course.type}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="text-gray-600 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {course.location}
                      </p>
                      <p className="text-gray-600 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(course.date)}
                      </p>
                      <p className="text-gray-600 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {course.distance}
                      </p>
                      <p className="text-gray-600 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {course.department}
                      </p>
                    </div>

                    {/* Description */}
                    <div className="mb-4 p-4 bg-blue-50 rounded border border-blue-200">
                      <h4 className="text-sm font-semibold text-blue-800 mb-2">Description</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    {/* Les + */}
                    <div className="bg-white rounded p-4 mb-6 shadow-lg border-2 border-[#F08040]">
                      <div className="flex items-center mb-2">
                        <svg className="w-6 h-6 mr-3 text-[#F08040]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        <h4 className="text-lg font-bold text-black">$ Les +</h4>
                      </div>
                      <p className="text-black font-semibold text-base leading-relaxed">
                        {course.reward}
                      </p>
                    </div>

                    {/* Date d'ajout aux favoris */}
                    <div className="text-xs text-gray-500 mb-4">
                      Ajouté aux favoris le {formatDate(favorite.favoriteDate)}
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex space-x-3">
                      <button
                        onClick={() => router.push(`/course-details?raceId=${course.id}`)}
                        className="flex-1 bg-[#6A70F0] hover:bg-[#5a60d4] text-black font-bold py-3 px-4 rounded text-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                      >
                        Voir les détails
                      </button>
                      <button
                        onClick={() => router.push(`/auth?raceId=${course.id}`)}
                        className="flex-1 bg-[#F08040] hover:bg-[#e06d2a] text-black font-bold py-3 px-4 rounded text-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                      >
                        S&apos;inscrire
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bouton retour */}
        <div className="text-center mt-12">
          <button
            onClick={() => router.push('/courses')}
            className="bg-gray-500 hover:bg-gray-600 text-black px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Retour aux courses
          </button>
        </div>
      </div>
    </div>
  );
}
