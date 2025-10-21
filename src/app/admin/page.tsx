'use client';

import { useState, useEffect } from 'react';
import { userDB, User } from '@/lib/userDatabase';


export default function AdminPage() {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Mot de passe admin simple (en production, utiliser une authentification plus sécurisée)
  const ADMIN_PASSWORD = 'runreward2024';

  useEffect(() => {
    // Charger les utilisateurs depuis la base de données
    const users = userDB.getAllUsers();
    setAllUsers(users);
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('Mot de passe incorrect');
    }
  };

  const generateAllUsersDocument = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const documentContent = `
RUNREWARD - RAPPORT ADMINISTRATEUR
=====================================

Date de génération: ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}
Nombre total d'inscrits: ${allUsers.length}

DÉTAIL DES INSCRIPTIONS:
=======================

${allUsers.map((user, index) => `
INSCRIPTION #${index + 1}
-------------------
Date d'inscription: ${new Date(user.inscriptionDate).toLocaleDateString('fr-FR')}

INFORMATIONS PERSONNELLES:
- Prénom: ${user.firstName}
- Nom: ${user.lastName}
- Email: ${user.email}

INFORMATIONS DE CONTACT:
- Adresse: ${user.address}
- Ville: ${user.city}
- Code postal: ${user.postalCode}

INFORMATIONS COMPLÉMENTAIRES:
- Date de naissance: ${new Date(user.birthDate).toLocaleDateString('fr-FR')}
- Sexe: ${user.gender}
- Pointure: Taille ${user.shoeSize}

STATUT: ${user.status === 'completed' ? 'Inscription validée' : 'En attente'}

`).join('\n')}

STATISTIQUES GÉNÉRALES:
=======================
- Total des inscriptions: ${allUsers.length}
- Hommes: ${allUsers.filter(u => u.gender === 'homme').length}
- Femmes: ${allUsers.filter(u => u.gender === 'femme').length}
- Autres: ${allUsers.filter(u => u.gender === 'autre').length}

RÉPARTITION PAR VILLE:
${Object.entries(
  allUsers.reduce((acc, user) => {
    acc[user.city] = (acc[user.city] || 0) + 1;
    return acc;
  }, {} as Record<string, number>)
).map(([city, count]) => `- ${city}: ${count} inscrit(s)`).join('\n')}

RÉPARTITION PAR POINTURE:
${Object.entries(
  allUsers.reduce((acc, user) => {
    acc[user.shoeSize] = (acc[user.shoeSize] || 0) + 1;
    return acc;
  }, {} as Record<string, number>)
).map(([size, count]) => `- Taille ${size}: ${count} personne(s)`).join('\n')}

---
Ce rapport a été généré automatiquement par RunReward
Plateforme de bénévolat pour coureurs récompensés
      `;

      // Créer et télécharger le fichier
      const blob = new Blob([documentContent], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `rapport-admin-runreward-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setIsGenerating(false);
    }, 2000);
  };

  const generateCSV = () => {
    const csvContent = [
      'Prénom,Nom,Email,Adresse,Ville,Code Postal,Date de naissance,Sexe,Pointure,Date inscription,Statut',
      ...allUsers.map(user => 
        `${user.firstName},${user.lastName},${user.email},${user.address},${user.city},${user.postalCode},${new Date(user.birthDate).toLocaleDateString('fr-FR')},${user.gender},${user.shoeSize},${new Date(user.inscriptionDate).toLocaleDateString('fr-FR')},${user.status}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `utilisateurs-runreward-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🔒 Administration RunReward
            </h1>
            <p className="text-gray-600">
              Accès réservé aux administrateurs
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mot de passe administrateur
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Se connecter
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Ou</span>
                </div>
              </div>

              <div className="mt-6">
                <a
                  href="/courses"
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Retour aux courses
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📊 Administration RunReward
          </h1>
          <p className="text-gray-600">
            Gestion des inscriptions et rapports
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">👥</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total inscrits</dt>
                    <dd className="text-lg font-medium text-gray-900">{allUsers.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">👨</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Hommes</dt>
                    <dd className="text-lg font-medium text-gray-900">{allUsers.filter(u => u.gender === 'homme').length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">👩</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Femmes</dt>
                    <dd className="text-lg font-medium text-gray-900">{allUsers.filter(u => u.gender === 'femme').length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">✅</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Validées</dt>
                    <dd className="text-lg font-medium text-gray-900">{allUsers.filter(u => u.status === 'completed').length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Actions d&apos;export</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={generateAllUsersDocument}
              disabled={isGenerating}
              className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Génération du rapport...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Télécharger rapport complet
                </>
              )}
            </button>

            <button
              onClick={generateCSV}
              className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Exporter en CSV
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Liste des inscrits</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Détail de tous les utilisateurs inscrits
            </p>
          </div>
          <ul className="divide-y divide-gray-200">
            {allUsers.map((user, index) => (
              <li key={index}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                          <span className="text-orange-600 font-medium text-sm">
                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email} • {user.city}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-500">
                        {user.gender} • Taille {user.shoeSize}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(user.inscriptionDate).toLocaleDateString('fr-FR')}
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {user.status === 'completed' ? 'Validé' : 'En attente'}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Logout */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-sm text-gray-600 hover:text-orange-500 transition-colors"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}
