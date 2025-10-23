'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { userDB, User } from '@/lib/userDatabase';

export default function ConfirmationPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = userDB.getCurrentUser();
    if (currentUser) {
      setUserData(currentUser);
    } else {
      router.push('/auth');
    }
  }, [router]);

  if (!userData) {
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
    <div className="min-h-screen bg-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Inscription confirmée !
            </h1>
            <p className="text-xl md:text-2xl text-green-100">
              Votre inscription pour l&apos;encadrement a été validée
            </p>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded shadow-lg p-8 text-center">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Félicitations {userData.firstName} !
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Votre inscription pour l&apos;encadrement de la course a été enregistrée avec succès.
            </p>
          </div>

          {/* Prochaines étapes */}
          <div className="bg-blue-50 p-6 rounded mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Prochaines étapes</h3>
            <ul className="text-left text-blue-800 space-y-2">
              <li>• Vous recevrez un email de confirmation dans les prochaines heures</li>
              <li>• Les détails pratiques vous seront communiqués avant la course</li>
              <li>• Vous pouvez consulter vos inscriptions dans votre profil</li>
            </ul>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/profile')}
              className="bg-[#F08040] hover:bg-[#e06d2a] text-white font-semibold py-3 px-6 rounded transition-colors"
            >
              Voir mon profil
            </button>
            <button
              onClick={() => router.push('/courses')}
              className="bg-[#6A70F0] hover:bg-[#5a60d4] text-white font-semibold py-3 px-6 rounded transition-colors"
            >
              Voir d&apos;autres courses
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}