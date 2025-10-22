'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { userDB, User } from '@/lib/userDatabase';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = userDB.getCurrentUser();
    if (!currentUser) {
      // Rediriger vers la page de connexion si pas connecté
      router.push('/auth');
      return;
    }
    setUser(currentUser);
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    // Supprimer l'utilisateur de la session
    localStorage.removeItem('currentUser');
    router.push('/');
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
