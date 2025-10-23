'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { courseDB, Course } from '@/lib/courseDatabase';
import { userDB, User } from '@/lib/userDatabase';

function InscriptionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [race, setRace] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const user = userDB.getCurrentUser();
    if (!user) {
      router.push('/auth');
      return;
    }
    setIsAuthenticated(true);
    setCurrentUser(user);

    // Récupérer l'ID de la course depuis l'URL ou localStorage
    const raceId = searchParams.get('raceId') || (() => {
      const storedRace = localStorage.getItem('selected-race');
      if (storedRace) {
        const raceData = JSON.parse(storedRace);
        return raceData.id.toString();
      }
      return null;
    })();
    
    if (raceId) {
      const foundRace = courseDB.getCourseById(parseInt(raceId));
      if (foundRace) {
        setRace(foundRace);
      } else {
        router.push('/courses');
      }
    } else {
      router.push('/courses');
    }
    setIsLoading(false);
  }, [searchParams, router]);

  const handleConfirmInscription = () => {
    if (race && currentUser) {
      // Enregistrer l'inscription
      userDB.completeRegistration(currentUser.id, {
        id: race.id,
        name: race.name,
        location: race.location,
        date: race.date,
        distance: race.distance,
        reward: race.reward,
        type: race.type
      });
      // Rediriger vers la page de confirmation
      router.push('/inscription/confirmation');
    }
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

  if (!isAuthenticated || !race) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec dégradé */}
      <div className="bg-gradient-to-r from-orange-500 to-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Inscription pour l&apos;encadrement
            </h1>
            <p className="text-xl md:text-2xl text-orange-100">
              {race.name}
            </p>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded shadow-lg overflow-hidden">
          {/* Header de la course */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{race.name}</h2>
                <div className="flex items-center space-x-4 text-gray-600">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {race.location}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(race.date)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Informations détaillées */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 mr-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <span className="font-medium">Distance :</span> {race.distance}
                  </div>
                </div>
                <div className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 mr-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <div>
                    <span className="font-medium">Type :</span> {race.type}
                  </div>
                </div>
                <div className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 mr-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  <div>
                    <span className="font-medium">Participants :</span> {race.currentParticipants}/{race.maxParticipants}
                  </div>
                </div>
                <div className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 mr-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <div>
                    <span className="font-medium">Département :</span> {race.department}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {race.description}
                </p>
              </div>
            </div>

            {/* Section récompense */}
            <div className="bg-gradient-to-r from-orange-50 to-blue-50 p-6 rounded mb-6">
              <div className="flex items-center text-orange-700 font-semibold mb-3">
                <svg className="w-6 h-6 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <span className="text-xl">Récompenses pour l&apos;encadrement</span>
              </div>
              <p className="text-orange-800 font-medium text-lg">
                {race.reward}
              </p>
            </div>

            {/* Barre de progression */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Inscriptions pour l&apos;encadrement</span>
                <span className="text-sm text-gray-500">{race.currentParticipants}/{race.maxParticipants}</span>
              </div>
              <div className="w-full bg-gray-200 rounded h-3">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded transition-all duration-300"
                  style={{ width: `${(race.currentParticipants / race.maxParticipants) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Informations importantes */}
            <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
              <h4 className="text-lg font-semibold text-blue-800 mb-2">Informations importantes</h4>
              <ul className="text-blue-700 space-y-1">
                <li>• Vous vous inscrivez pour <strong>l&apos;encadrement</strong> de la course en tant que bénévole</li>
                <li>• L&apos;organisateur vous contactera pour finaliser votre inscription</li>
                <li>• Vous recevrez votre récompense après participation à l&apos;encadrement</li>
                <li>• Votre engagement bénévole contribue au bon déroulement de l&apos;événement</li>
              </ul>
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleConfirmInscription}
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded text-center transition-all duration-200 text-lg"
              >
                Confirmer mon inscription
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

export default function InscriptionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    }>
      <InscriptionContent />
    </Suspense>
  );
}
