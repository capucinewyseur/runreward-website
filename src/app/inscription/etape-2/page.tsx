'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { userDB } from '@/lib/userDatabase';

export default function InscriptionEtape2() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    postalCode: '',
    birthDate: '',
    gender: '',
    shoeSize: ''
  });
  const [etape1Data, setEtape1Data] = useState<{firstName: string; lastName: string; email: string} | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Récupérer les données de l'étape 1
    const data = localStorage.getItem('inscription-etape-1');
    if (data) {
      setEtape1Data(JSON.parse(data));
    } else {
      // Rediriger vers l'étape 1 si pas de données
      router.push('/inscription/etape-1');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Récupérer l'utilisateur actuel
    const currentUser = userDB.getCurrentUser();
    if (!currentUser) {
      alert('Erreur: Utilisateur non connecté.');
      setIsLoading(false);
      return;
    }

    // Mettre à jour les informations de l'utilisateur
    const updatedUser = userDB.updateUser(currentUser.id, {
      address: formData.address,
      city: formData.city,
      postalCode: formData.postalCode,
      birthDate: formData.birthDate,
      gender: formData.gender,
      shoeSize: formData.shoeSize
    });

    if (updatedUser) {
      // Récupérer la course sélectionnée
      const selectedRaceData = localStorage.getItem('selected-race');
      if (selectedRaceData) {
        const raceData = JSON.parse(selectedRaceData);
        // Finaliser l'inscription avec la course
        userDB.completeRegistration(currentUser.id, raceData);
      }

      setTimeout(() => {
        setIsLoading(false);
        router.push('/inscription/confirmation');
      }, 500);
    } else {
      alert('Erreur lors de la mise à jour des informations.');
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!etape1Data) {
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
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Inscription - Étape 2
          </h1>
          <p className="text-gray-600">
            Informations complémentaires
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progression</span>
              <span className="text-sm text-gray-500">2/2</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-orange-500 h-2 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Adresse *
              </label>
              <div className="mt-1">
                <input
                  id="address"
                  name="address"
                  type="text"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="123 rue de la Paix"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  Ville *
                </label>
                <div className="mt-1">
                  <input
                    id="city"
                    name="city"
                    type="text"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="Paris"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                  Code postal *
                </label>
                <div className="mt-1">
                  <input
                    id="postalCode"
                    name="postalCode"
                    type="text"
                    required
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="75001"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                Date de naissance *
              </label>
              <div className="mt-1">
                <input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  required
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                Sexe *
              </label>
              <div className="mt-1">
                <select
                  id="gender"
                  name="gender"
                  required
                  value={formData.gender}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                >
                  <option value="">Sélectionner</option>
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="shoeSize" className="block text-sm font-medium text-gray-700">
                Pointure *
              </label>
              <div className="mt-1">
                <select
                  id="shoeSize"
                  name="shoeSize"
                  required
                  value={formData.shoeSize}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                >
                  <option value="">Sélectionner</option>
                  {Array.from({ length: 20 }, (_, i) => i + 35).map(size => (
                    <option key={size} value={size}>Taille {size}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => router.push('/inscription/etape-1')}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Retour
              </button>
              <button
                type="submit"
                disabled={isLoading || !formData.address || !formData.city || !formData.postalCode || !formData.birthDate || !formData.gender || !formData.shoeSize}
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Finalisation...
                  </>
                ) : (
                  'Finaliser l\'inscription'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
