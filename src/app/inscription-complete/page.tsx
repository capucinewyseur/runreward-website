'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { userDB } from '@/lib/userDatabase';

interface Race {
  id: number;
  name: string;
  location: string;
  department: string;
  date: string;
  distance: string;
  reward: string;
  description: string;
  maxParticipants: number;
  currentParticipants: number;
  type: 'Route' | 'Trail';
  image: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

const races: Race[] = [
  {
    id: 1,
    name: "Course du Printemps",
    location: "Parc de la Villette, Paris",
    department: "Paris (75)",
    date: "2024-04-15",
    distance: "10 km",
    reward: "100€ + équipement de course",
    description: "Course matinale dans le magnifique parc de la Villette. Parfait pour débuter la saison de course.",
    maxParticipants: 200,
    currentParticipants: 156,
    type: 'Route',
    image: "/api/placeholder/400/250",
    coordinates: { lat: 48.8966, lng: 2.3833 }
  },
  {
    id: 2,
    name: "Trail des Alpes",
    location: "Chamonix, Haute-Savoie",
    department: "Haute-Savoie (74)",
    date: "2024-05-20",
    distance: "21 km",
    reward: "150€ + équipement technique",
    description: "Trail en montagne avec vue panoramique sur le Mont-Blanc. Défi pour les coureurs expérimentés.",
    maxParticipants: 100,
    currentParticipants: 89,
    type: 'Trail',
    image: "/api/placeholder/400/250",
    coordinates: { lat: 45.9237, lng: 6.8694 }
  },
  {
    id: 3,
    name: "Course de la Solidarité",
    location: "Parc des Buttes-Chaumont, Paris",
    department: "Paris (75)",
    date: "2024-06-10",
    distance: "5 km",
    reward: "50€ + tee-shirt",
    description: "Course caritative pour soutenir les associations locales. Ouverte à tous les niveaux.",
    maxParticipants: 300,
    currentParticipants: 234,
    type: 'Route',
    image: "/api/placeholder/400/250",
    coordinates: { lat: 48.8833, lng: 2.3833 }
  },
  {
    id: 4,
    name: "Marathon de Lyon",
    location: "Lyon, Rhône",
    department: "Rhône (69)",
    date: "2024-09-15",
    distance: "42.2 km",
    reward: "200€ + médaille + équipement",
    description: "Marathon urbain traversant les plus beaux quartiers de Lyon. Événement majeur de la région.",
    maxParticipants: 5000,
    currentParticipants: 4234,
    type: 'Route',
    image: "/api/placeholder/400/250",
    coordinates: { lat: 45.7640, lng: 4.8357 }
  },
  {
    id: 5,
    name: "Trail de Fontainebleau",
    location: "Forêt de Fontainebleau, Seine-et-Marne",
    department: "Seine-et-Marne (77)",
    date: "2024-07-22",
    distance: "15 km",
    reward: "120€ + casquette + gourde",
    description: "Trail dans la magnifique forêt de Fontainebleau. Parcours varié entre rochers et sentiers forestiers.",
    maxParticipants: 150,
    currentParticipants: 98,
    type: 'Trail',
    image: "/api/placeholder/400/250",
    coordinates: { lat: 48.4047, lng: 2.7012 }
  },
  {
    id: 6,
    name: "Course Nocturne de Nice",
    location: "Promenade des Anglais, Nice",
    department: "Alpes-Maritimes (06)",
    date: "2024-08-05",
    distance: "10 km",
    reward: "80€ + maillot technique",
    description: "Course nocturne le long de la célèbre Promenade des Anglais. Ambiance festive garantie.",
    maxParticipants: 800,
    currentParticipants: 567,
    type: 'Route',
    image: "/api/placeholder/400/250",
    coordinates: { lat: 43.7102, lng: 7.2620 }
  },
  {
    id: 7,
    name: "Generali Genève Marathon",
    location: "Genève, Suisse",
    department: "Suisse",
    date: "2024-12-15",
    distance: "42.2 km",
    reward: "Tee-shirt + casquette + repas + 50% réduction dossard 2026/2027",
    description: "Rejoignez l'équipe de 1200 bénévoles pour faire courir plus de 25000 personnes dans Genève et sa campagne. 14 missions variées ouvertes à tous.",
    maxParticipants: 1200,
    currentParticipants: 856,
    type: 'Route',
    image: "/api/placeholder/400/250",
    coordinates: { lat: 46.2044, lng: 6.1432 }
  }
];

function InscriptionCompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [race, setRace] = useState<Race | null>(null);
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
    if (raceId) {
      const foundRace = races.find(r => r.id === parseInt(raceId));
      if (foundRace) {
        setRace(foundRace);
      }
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Récupérer l'utilisateur actuel
    const currentUser = userDB.getCurrentUser();
    if (!currentUser) {
      alert('Erreur: Utilisateur non connecté. Redirection vers la page de connexion...');
      setIsLoading(false);
      router.push('/auth');
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

    if (updatedUser && race) {
      // Finaliser l'inscription avec la course
      userDB.completeRegistration(currentUser.id, {
        id: race.id,
        name: race.name,
        location: race.location,
        date: race.date,
        distance: race.distance,
        reward: race.reward,
        type: race.type
      });

      setTimeout(() => {
        setIsLoading(false);
        router.push('/inscription/confirmation');
      }, 500);
    } else {
      alert('Erreur lors de la mise à jour des informations.');
      setIsLoading(false);
    }
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

  if (!race) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course non trouvée</h1>
          <p className="text-gray-600 mb-6">La course demandée n&apos;existe pas.</p>
          <button
            onClick={() => router.push('/courses')}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
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
      <div className="bg-gradient-to-r from-orange-500 to-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Inscription bénévole
            </h1>
            <p className="text-xl md:text-2xl text-orange-100">
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
                <span className="mr-3 text-orange-500">📍</span>
                <div>
                  <span className="font-medium">Lieu :</span> {race.location}
                </div>
              </div>
              <div className="flex items-center text-gray-700">
                <span className="mr-3 text-orange-500">📅</span>
                <div>
                  <span className="font-medium">Date :</span> {formatDate(race.date)}
                </div>
              </div>
              <div className="flex items-center text-gray-700">
                <span className="mr-3 text-orange-500">🏁</span>
                <div>
                  <span className="font-medium">Distance :</span> {race.distance}
                </div>
              </div>
              <div className="flex items-center text-gray-700">
                <span className="mr-3 text-orange-500">🏃</span>
                <div>
                  <span className="font-medium">Type :</span> {race.type}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-blue-50 p-4 rounded-lg mb-6">
              <div className="flex items-center text-orange-700 font-semibold mb-3">
                <span className="mr-2 text-2xl">🎁</span>
                <span className="text-xl">Récompenses pour les bénévoles</span>
              </div>
              <p className="text-orange-800 font-medium text-lg">
                {race.reward}
              </p>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Inscriptions bénévoles</span>
                <span className="text-sm text-gray-500">{race.currentParticipants}/{race.maxParticipants}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(race.currentParticipants / race.maxParticipants) * 100}%` }}
                ></div>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed">
              {race.description}
            </p>
          </div>

          {/* Registration Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Informations personnelles</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Adresse */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  autoComplete="street-address"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  placeholder="123 Rue de la Paix"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                    Ville
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    autoComplete="address-level2"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Paris"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                    Code postal
                  </label>
                  <input
                    id="postalCode"
                    name="postalCode"
                    type="text"
                    autoComplete="postal-code"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    placeholder="75001"
                    value={formData.postalCode}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Date de naissance */}
              <div>
                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Date de naissance
                </label>
                <input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  value={formData.birthDate}
                  onChange={handleChange}
                />
              </div>

              {/* Sexe */}
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                  Sexe
                </label>
                <select
                  id="gender"
                  name="gender"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Sélectionner</option>
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              {/* Pointure */}
              <div>
                <label htmlFor="shoeSize" className="block text-sm font-medium text-gray-700 mb-2">
                  Pointure
                </label>
                <select
                  id="shoeSize"
                  name="shoeSize"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  value={formData.shoeSize}
                  onChange={handleChange}
                >
                  <option value="">Sélectionner</option>
                  {Array.from({ length: 20 }, (_, i) => 35 + i).map((size) => (
                    <option key={size} value={`Taille ${size}`}>Taille {size}</option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-all duration-200 text-lg disabled:bg-gray-400"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Traitement...
                    </div>
                  ) : (
                    'Je m\'inscris en tant que bénévole'
                  )}
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    }>
      <InscriptionCompleteContent />
    </Suspense>
  );
}
