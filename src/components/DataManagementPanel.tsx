'use client';

import { useState } from 'react';
import { userDB, User } from '@/lib/userDatabase';
import { externalDataService } from '@/lib/externalDataService';

export default function DataManagementPanel() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleExportData = () => {
    setIsLoading(true);
    try {
      const users = userDB.getAllUsers();
      const registrations = userDB.getCourseRegistrations();
      const favorites = userDB.getUserFavorites();
      
      const data = {
        users,
        registrations,
        favorites,
        exportDate: new Date().toISOString()
      };

      // Créer un fichier JSON téléchargeable
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `runreward-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setMessage('✅ Données exportées avec succès !');
    } catch (error) {
      setMessage('❌ Erreur lors de l\'export: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        // Importer les données
        if (data.users) {
          data.users.forEach((user: User) => {
            userDB.createUser(user);
          });
        }
        
        setMessage('✅ Données importées avec succès !');
      } catch (error) {
        setMessage('❌ Erreur lors de l\'import: ' + error);
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsText(file);
  };

  const handleMigrateToExternal = async () => {
    setIsLoading(true);
    try {
      await externalDataService.migrateFromLocalStorage();
      setMessage('✅ Migration vers le service externe terminée !');
    } catch (error) {
      setMessage('❌ Erreur lors de la migration: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearData = () => {
    if (confirm('Êtes-vous sûr de vouloir effacer toutes les données ?')) {
      localStorage.clear();
      setMessage('✅ Toutes les données ont été effacées !');
    }
  };

  return (
    <div className="bg-white rounded shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Gestion des données</h2>
      
      {message && (
        <div className={`p-4 rounded mb-6 ${
          message.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export */}
        <div className="border border-gray-200 rounded p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">📤 Exporter les données</h3>
          <p className="text-gray-600 mb-4">
            Téléchargez toutes les données utilisateurs au format JSON
          </p>
          <button
            onClick={handleExportData}
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-medium transition-colors disabled:bg-gray-400"
          >
            {isLoading ? 'Export en cours...' : 'Exporter les données'}
          </button>
        </div>

        {/* Import */}
        <div className="border border-gray-200 rounded p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">📥 Importer les données</h3>
          <p className="text-gray-600 mb-4">
            Importez des données depuis un fichier JSON
          </p>
          <input
            type="file"
            accept=".json"
            onChange={handleImportData}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm disabled:bg-gray-100"
          />
        </div>

        {/* Migration */}
        <div className="border border-gray-200 rounded p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">🔄 Migration externe</h3>
          <p className="text-gray-600 mb-4">
            Migrer les données localStorage vers le service externe
          </p>
          <button
            onClick={handleMigrateToExternal}
            disabled={isLoading}
            className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-medium transition-colors disabled:bg-gray-400"
          >
            {isLoading ? 'Migration...' : 'Migrer vers externe'}
          </button>
        </div>

        {/* Clear */}
        <div className="border border-gray-200 rounded p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">🗑️ Effacer les données</h3>
          <p className="text-gray-600 mb-4">
            Supprimer toutes les données du localStorage
          </p>
          <button
            onClick={handleClearData}
            disabled={isLoading}
            className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-medium transition-colors disabled:bg-gray-400"
          >
            Effacer toutes les données
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Statistiques</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded">
            <div className="text-2xl font-bold text-blue-600">
              {userDB.getAllUsers().length}
            </div>
            <div className="text-blue-800">Utilisateurs</div>
          </div>
          <div className="bg-green-50 p-4 rounded">
            <div className="text-2xl font-bold text-green-600">
              {userDB.getCourseRegistrations().length}
            </div>
            <div className="text-green-800">Inscriptions</div>
          </div>
          <div className="bg-purple-50 p-4 rounded">
            <div className="text-2xl font-bold text-purple-600">
              {userDB.getUserFavorites().length}
            </div>
            <div className="text-purple-800">Favoris</div>
          </div>
        </div>
      </div>
    </div>
  );
}
