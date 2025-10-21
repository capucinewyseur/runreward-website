'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ConfirmationPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<{firstName: string; lastName: string; email: string; address: string; city: string; postalCode: string; birthDate: string; gender: string; shoeSize: string; inscriptionDate: string; status: string} | null>(null);
  const [selectedRace, setSelectedRace] = useState<{id: number; name: string; location: string; date: string; distance: string; reward: string; type: string} | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Récupérer les données complètes
    const data = localStorage.getItem('inscription-complete');
    if (data) {
      setUserData(JSON.parse(data));
    } else {
      // Rediriger vers l'étape 1 si pas de données
      router.push('/inscription/etape-1');
    }

    // Récupérer la course sélectionnée
    const raceData = localStorage.getItem('selected-race');
    if (raceData) {
      setSelectedRace(JSON.parse(raceData));
    }
  }, [router]);

  const generateDocument = () => {
    if (!userData) return;
    
    setIsGenerating(true);
    
    // Simuler la génération du document
    setTimeout(() => {
      // Créer le contenu du document
      const documentContent = `
INSCRIPTION RUNREWARD - CONFIRMATION

Date d'inscription: ${new Date(userData.inscriptionDate).toLocaleDateString('fr-FR')}

INFORMATIONS PERSONNELLES:
- Prénom: ${userData.firstName}
- Nom: ${userData.lastName}
- Email: ${userData.email}

INFORMATIONS DE CONTACT:
- Adresse: ${userData.address}
- Ville: ${userData.city}
- Code postal: ${userData.postalCode}

INFORMATIONS COMPLÉMENTAIRES:
- Date de naissance: ${new Date(userData.birthDate).toLocaleDateString('fr-FR')}
- Sexe: ${userData.gender}
- Pointure: ${userData.shoeSize}

STATUT: ${userData.status === 'completed' ? 'Inscription validée' : 'En attente'}

---
Ce document a été généré automatiquement par RunReward
Plateforme de bénévolat pour coureurs récompensés
      `;

      // Créer et télécharger le fichier
      const blob = new Blob([documentContent], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `inscription-runreward-${userData.firstName}-${userData.lastName}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setIsGenerating(false);
    }, 2000);
  };

  const clearData = () => {
    localStorage.removeItem('inscription-etape-1');
    localStorage.removeItem('inscription-complete');
    router.push('/courses');
  };

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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-2">
            Merci pour ton inscription ! 🎉
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            L&apos;organisateur de la course vous recontactera directement afin de valider votre inscription avec toutes les informations nécessaires.
          </p>
        </div>

        {/* Information Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Prochaines étapes
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Vérifiez votre boîte email pour recevoir un accusé de réception</li>
                  <li>L&apos;organisateur vous contactera sous 48h pour finaliser votre inscription</li>
                  <li>Préparez-vous à vivre une expérience unique de bénévolat sportif !</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Récapitulatif de votre inscription
            </h2>

            {/* Course Information */}
            {selectedRace && (
              <div className="bg-gradient-to-r from-orange-50 to-blue-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Course sélectionnée</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium text-gray-900">{selectedRace.name}</p>
                    <p className="text-gray-600">📍 {selectedRace.location}</p>
                    <p className="text-gray-600">📅 {new Date(selectedRace.date).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">🏁 {selectedRace.distance}</p>
                    <p className="text-gray-600">🏃 {selectedRace.type}</p>
                    <p className="text-orange-700 font-medium">🎁 {selectedRace.reward}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Informations personnelles</h3>
                <dl className="space-y-1">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Prénom:</dt>
                    <dd className="text-sm text-gray-900">{userData.firstName}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Nom:</dt>
                    <dd className="text-sm text-gray-900">{userData.lastName}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Email:</dt>
                    <dd className="text-sm text-gray-900">{userData.email}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Informations de contact</h3>
                <dl className="space-y-1">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Adresse:</dt>
                    <dd className="text-sm text-gray-900">{userData.address}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Ville:</dt>
                    <dd className="text-sm text-gray-900">{userData.city}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Code postal:</dt>
                    <dd className="text-sm text-gray-900">{userData.postalCode}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Informations complémentaires</h3>
                <dl className="space-y-1">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Date de naissance:</dt>
                    <dd className="text-sm text-gray-900">{new Date(userData.birthDate).toLocaleDateString('fr-FR')}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Sexe:</dt>
                    <dd className="text-sm text-gray-900">{userData.gender}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Pointure:</dt>
                    <dd className="text-sm text-gray-900">Taille {userData.shoeSize}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Statut</h3>
                <dl className="space-y-1">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Date d&apos;inscription:</dt>
                    <dd className="text-sm text-gray-900">{new Date(userData.inscriptionDate).toLocaleDateString('fr-FR')}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Statut:</dt>
                    <dd className="text-sm text-green-600 font-medium">✓ Inscription validée</dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={generateDocument}
                disabled={isGenerating}
                className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Génération du document...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Télécharger le document
                  </>
                )}
              </button>

              <button
                onClick={clearData}
                className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
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
