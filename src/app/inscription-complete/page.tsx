'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { userDB } from '@/lib/userDatabase';
import { courseDB, Course } from '@/lib/courseDatabase';

function InscriptionCompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [race, setRace] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    postalCode: '',
    birthDate: '',
    gender: '',
    shoeSize: ''
  });

  useEffect(() => {
    const raceId = searchParams.get('raceId');

    // Attendre un peu pour que la base de données se charge
    const checkUser = () => {
      const currentUser = userDB.getCurrentUser();
      if (!currentUser) {
        // Rediriger vers l'authentification en préservant le raceId
        if (raceId) {
          router.push(`/auth?raceId=${raceId}`);
        } else {
          router.push('/auth');
        }
        return;
      }

      if (raceId) {
        const foundRace = courseDB.getCourseById(parseInt(raceId));
        if (foundRace) {
          setRace(foundRace);
        }
      }
    };

    // Vérifier immédiatement et après un court délai
    checkUser();
    const timeout = setTimeout(checkUser, 100);

    return () => clearTimeout(timeout);
  }, [searchParams, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const currentUser = userDB.getCurrentUser();
    if (!currentUser) {
      alert('Erreur: Utilisateur non connecté. Redirection vers la page de connexion...');
      setIsLoading(false);
      router.push('/auth');
      return;
    }

    const updatedUser = userDB.updateUser(currentUser.id, {
      address: formData.address,
      city: formData.city,
      postalCode: formData.postalCode,
      birthDate: formData.birthDate,
      gender: formData.gender,
      shoeSize: formData.shoeSize
    });

    if (updatedUser && race) {
      userDB.completeRegistration(currentUser.id, race);
      setTimeout(() => {
        setIsLoading(false);
        router.push('/inscription/confirmation');
      }, 500);
    } else {
      alert('Erreur lors de la mise à jour des informations ou course non sélectionnée.');
      setIsLoading(false);
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F08040] mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des détails de la course...</p>
        </div>
      </div>
    );
  }

  if (!race) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course non trouvée</h1>
          <p className="text-gray-600 mb-6">La course demandée n&apos;existe pas.</p>
          <button
            onClick={() => router.push('/courses')}
            className="bg-[#F08040] hover:bg-[#e06d2a] text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Retour aux courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#F08040] to-[#6A70F0] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Inscription bénévole
            </h1>
            <p className="text-xl md:text-2xl text-white/90">
              {race.name}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Course Details */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Détails de la course</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center text-gray-700">
                <span className="mr-3 text-[#F08040]">📍</span>
                <div>
                  <span className="font-medium">Lieu :</span> {race.location}
                </div>
              </div>
              <div className="flex items-center text-gray-700">
                <span className="mr-3 text-[#F08040]">📅</span>
                <div>
                  <span className="font-medium">Date :</span> {formatDate(race.date)}
                </div>
              </div>
              <div className="flex items-center text-gray-700">
                <span className="mr-3 text-[#F08040]">🏁</span>
                <div>
                  <span className="font-medium">Distance :</span> {race.distance}
                </div>
              </div>
              <div className="flex items-center text-gray-700">
                <span className="mr-3 text-[#F08040]">🗺️</span>
                <div>
                  <span className="font-medium">Département :</span> {race.department}
                </div>
              </div>
            </div>

            {/* Récompense - Version améliorée */}
            <div className="bg-gradient-to-r from-[#F08040] to-[#e06d2a] rounded-xl p-4 mb-6 shadow-lg border-2 border-[#F08040]/30">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-3">🎁</span>
                <h3 className="text-lg font-bold text-white">Récompense</h3>
              </div>
              <p className="text-white font-semibold text-base leading-relaxed">
                {race.reward}
              </p>
            </div>

            <p className="text-gray-700 leading-relaxed">
              {race.description}
            </p>
          </div>

          {/* Registration Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Vos informations</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse complète
                </label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F08040] focus:border-[#F08040]"
                />
              </div>

              {/* City and Postal Code */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                    Ville
                  </label>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F08040] focus:border-[#F08040]"
                  />
                </div>
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                    Code postal
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F08040] focus:border-[#F08040]"
                  />
                </div>
              </div>

              {/* Birth Date */}
              <div>
                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Date de naissance
                </label>
                <input
                  type="date"
                  name="birthDate"
                  id="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F08040] focus:border-[#F08040]"
                />
              </div>

              {/* Gender */}
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                  Sexe
                </label>
                <select
                  name="gender"
                  id="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F08040] focus:border-[#F08040]"
                >
                  <option value="">Sélectionner</option>
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              {/* Shoe Size */}
              <div>
                <label htmlFor="shoeSize" className="block text-sm font-medium text-gray-700 mb-2">
                  Pointure
                </label>
                <input
                  type="number"
                  name="shoeSize"
                  id="shoeSize"
                  value={formData.shoeSize}
                  onChange={handleChange}
                  required
                  min="20"
                  max="50"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F08040] focus:border-[#F08040]"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#F08040] to-[#e06d2a] hover:from-[#e06d2a] hover:to-[#d45a1a] text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? 'Inscription en cours...' : 'Je m\'inscris en tant que bénévole'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InscriptionCompletePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F08040] mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    }>
      <InscriptionCompleteContent />
    </Suspense>
  );
}
