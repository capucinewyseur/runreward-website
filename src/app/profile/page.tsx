'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { userDB, User, CourseFavorite, CourseRegistration } from '@/lib/userDatabase';
import { courseDB, Course } from '@/lib/courseDatabase';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setFavorites] = useState<CourseFavorite[]>([]);
  const [registrations, setRegistrations] = useState<CourseRegistration[]>([]);
  const [favoriteCourses, setFavoriteCourses] = useState<Course[]>([]);
  const [registeredCourses, setRegisteredCourses] = useState<Course[]>([]);

  useEffect(() => {
    const currentUser = userDB.getCurrentUser();
    if (!currentUser) {
      // Rediriger vers la page de connexion si pas connecté
      router.push('/auth');
      return;
    }
    setUser(currentUser);
    
    // Charger les favoris et inscriptions
    const userFavorites = userDB.getUserFavorites();
    const userRegistrations = userDB.getCourseRegistrations().filter(reg => reg.userId === currentUser.id);
    
    setFavorites(userFavorites);
    setRegistrations(userRegistrations);
    
    // Charger les détails des courses
    const favoriteCoursesDetails = userFavorites.map(fav => courseDB.getCourseById(fav.courseId)).filter(Boolean) as Course[];
    const registeredCoursesDetails = userRegistrations.map(reg => courseDB.getCourseById(reg.courseId)).filter(Boolean) as Course[];
    
    setFavoriteCourses(favoriteCoursesDetails);
    setRegisteredCourses(registeredCoursesDetails);
    
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    // Utiliser la méthode logout de la base de données
    userDB.logout();
    // Forcer le rechargement de la page pour s'assurer que l'état est mis à jour
    window.location.href = '/auth';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Non renseigné';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F08040] mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès non autorisé</h1>
          <p className="text-gray-600 mb-6">Vous devez être connecté pour accéder à cette page.</p>
          <Link
            href="/auth"
            className="bg-[#F08040] hover:bg-[#e06d2a] text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#F08040] to-[#6A70F0] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Mon Profil
            </h1>
            <p className="text-xl md:text-2xl text-white/90">
              Bienvenue, {user.firstName} !
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations personnelles */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 text-[#F08040] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Informations personnelles
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-900 font-medium">{user.firstName}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-900 font-medium">{user.lastName}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-900 font-medium">{user.email}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date de naissance</label>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-900 font-medium">{formatDate(user.birthDate)}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sexe</label>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-900 font-medium capitalize">{user.gender || 'Non renseigné'}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pointure</label>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-900 font-medium">{user.shoeSize || 'Non renseigné'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Adresse */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 text-[#6A70F0] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Adresse
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adresse complète</label>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-900 font-medium">{user.address || 'Non renseigné'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-900 font-medium">{user.city || 'Non renseigné'}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Code postal</label>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-900 font-medium">{user.postalCode || 'Non renseigné'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Statut du compte */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statut du compte</h3>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${user.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <span className="text-gray-700">
                  {user.status === 'completed' ? 'Profil complet' : 'Profil en cours'}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Inscrit le {new Date(user.inscriptionDate).toLocaleDateString('fr-FR')}
              </p>
            </div>

            {/* Course sélectionnée */}
            {user.selectedRace && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Course sélectionnée</h3>
                <div className="bg-gradient-to-r from-[#F08040]/10 to-[#6A70F0]/10 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">{user.selectedRace.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">📍 {user.selectedRace.location}</p>
                  <p className="text-sm text-gray-600 mb-2">📅 {formatDate(user.selectedRace.date)}</p>
                  <div className="bg-[#F08040]/20 rounded-lg p-2 mt-3">
                    <p className="text-sm font-medium text-[#F08040]">🎁 {user.selectedRace.reward}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Courses favorites */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">❤️ Mes courses favorites</h3>
              {favoriteCourses.length > 0 ? (
                <div className="space-y-3">
                  {favoriteCourses.map((course) => (
                    <div key={course.id} className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-lg border border-red-200">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{course.name}</h4>
                          <p className="text-sm text-gray-600">📍 {course.location}</p>
                          <p className="text-sm text-gray-600">📅 {formatDate(course.date)}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              userDB.removeFromFavorites(course.id);
                              // Recharger les données
                              const updatedFavorites = userDB.getUserFavorites();
                              setFavorites(updatedFavorites);
                              const updatedFavoriteCourses = updatedFavorites.map(fav => courseDB.getCourseById(fav.courseId)).filter(Boolean) as Course[];
                              setFavoriteCourses(updatedFavoriteCourses);
                            }}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Retirer des favoris"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </button>
                          <Link
                            href={`/course-details?raceId=${course.id}`}
                            className="text-[#F08040] hover:text-[#e06d2a] text-sm font-medium"
                          >
                            Voir détails
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <p className="text-lg font-medium mb-2">Aucune course favorite</p>
                  <p className="text-sm">Ajoutez des courses à vos favoris pour les retrouver facilement !</p>
                  <Link
                    href="/courses"
                    className="inline-block mt-4 bg-[#F08040] hover:bg-[#e06d2a] text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                  >
                    Découvrir les courses
                  </Link>
                </div>
              )}
            </div>

            {/* Courses inscrites */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📝 Mes inscriptions</h3>
              {registeredCourses.length > 0 ? (
                <div className="space-y-3">
                  {registeredCourses.map((course) => {
                    const registration = registrations.find(reg => reg.courseId === course.id);
                    return (
                      <div key={course.id} className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{course.name}</h4>
                            <p className="text-sm text-gray-600">📍 {course.location}</p>
                            <p className="text-sm text-gray-600">📅 {formatDate(course.date)}</p>
                            <div className="mt-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                registration?.status === 'confirmed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : registration?.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {registration?.status === 'confirmed' ? '✅ Confirmé' : 
                                 registration?.status === 'pending' ? '⏳ En attente' : 
                                 '❌ Annulé'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Link
                              href={`/course-details?raceId=${course.id}`}
                              className="text-[#F08040] hover:text-[#e06d2a] text-sm font-medium"
                            >
                              Voir détails
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-lg font-medium mb-2">Aucune inscription</p>
                  <p className="text-sm">Inscrivez-vous à des courses pour commencer à gagner des récompenses !</p>
                  <Link
                    href="/courses"
                    className="inline-block mt-4 bg-[#F08040] hover:bg-[#e06d2a] text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                  >
                    Voir les courses
                  </Link>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/courses"
                  className="w-full bg-[#F08040] hover:bg-[#e06d2a] text-white font-semibold py-2 px-4 rounded-lg text-center transition-colors block"
                >
                  Voir les courses
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Se déconnecter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
