'use client';

import { useState, useEffect } from 'react';
import { userDB, User, CourseStats } from '@/lib/userDatabase';
import { courseDB, Course } from '@/lib/courseDatabase';
import { emailService, EmailData } from '@/lib/emailService';


export default function AdminPage() {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [courseStats, setCourseStats] = useState<CourseStats[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sendingEmails, setSendingEmails] = useState<Set<string>>(new Set());
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAddCourseForm, setShowAddCourseForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Mot de passe admin simple (en production, utiliser une authentification plus sécurisée)
  const ADMIN_PASSWORD = 'runreward2024';

  useEffect(() => {
    // Charger les utilisateurs, statistiques et courses depuis la base de données
    const users = userDB.getAllUsers();
    const stats = userDB.getCourseStats();
    const courses = courseDB.getAllCourses();
    setAllUsers(users);
    setCourseStats(stats);
    setAllCourses(courses);
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('Mot de passe incorrect');
    }
  };

  const handleConfirmRegistration = async (registrationId: string, courseName: string, courseDate: string, courseLocation: string, userEmail: string, userName: string) => {
    setSendingEmails(prev => new Set(prev).add(registrationId));
    
    try {
      // Confirmer l'inscription dans la base de données
      const success = userDB.confirmRegistration(registrationId);
      
      if (success) {
        // Envoyer l'email de confirmation
        const emailData: EmailData = {
          to_email: userEmail,
          to_name: userName,
          course_name: courseName,
          course_date: courseDate,
          course_location: courseLocation,
          organizer_message: 'Vos coordonnées ont été transmises à l\'organisateur de la course qui vous contactera directement pour finaliser les détails de votre participation.'
        };

        const emailSent = await emailService.sendConfirmationEmail(emailData);
        
        if (emailSent) {
          alert(`✅ Inscription confirmée et email envoyé à ${userEmail}`);
        } else {
          alert(`⚠️ Inscription confirmée mais erreur lors de l'envoi de l'email à ${userEmail}`);
        }
        
        // Recharger les données
        const stats = userDB.getCourseStats();
        setCourseStats(stats);
      } else {
        alert('❌ Erreur lors de la confirmation de l\'inscription');
      }
    } catch (error) {
      console.error('Erreur lors de la confirmation:', error);
      alert('❌ Erreur lors de la confirmation de l\'inscription');
    } finally {
      setSendingEmails(prev => {
        const newSet = new Set(prev);
        newSet.delete(registrationId);
        return newSet;
      });
    }
  };

  // Fonctions de gestion des courses
  const handleAddCourse = (courseData: Course | Omit<Course, 'id'>) => {
    try {
      const newCourse = courseDB.addCourse(courseData as Omit<Course, 'id'>);
      setAllCourses(courseDB.getAllCourses());
      setShowAddCourseForm(false);
      alert(`✅ Course "${newCourse.name}" ajoutée avec succès !`);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la course:', error);
      alert('❌ Erreur lors de l\'ajout de la course');
    }
  };

  const handleEditCourse = (courseData: Course | Omit<Course, 'id'>) => {
    try {
      const updatedCourse = courseDB.updateCourse((courseData as Course).id, courseData);
      if (updatedCourse) {
        setAllCourses(courseDB.getAllCourses());
        setEditingCourse(null);
        alert(`✅ Course "${updatedCourse.name}" modifiée avec succès !`);
      } else {
        alert('❌ Course non trouvée');
      }
    } catch (error) {
      console.error('Erreur lors de la modification de la course:', error);
      alert('❌ Erreur lors de la modification de la course');
    }
  };

  const handleDeleteCourse = (courseId: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette course ?')) {
      try {
        const success = courseDB.deleteCourse(courseId);
        if (success) {
          setAllCourses(courseDB.getAllCourses());
          alert('✅ Course supprimée avec succès !');
        } else {
          alert('❌ Course non trouvée');
        }
      } catch (error) {
        console.error('Erreur lors de la suppression de la course:', error);
        alert('❌ Erreur lors de la suppression de la course');
      }
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

  // Composant de formulaire pour ajouter/modifier une course
  const CourseForm = ({ course, onSave, onCancel }: { course?: Course | null, onSave: (data: Course | Omit<Course, 'id'>) => void, onCancel: () => void }) => {
    const [formData, setFormData] = useState({
      name: course?.name || '',
      location: course?.location || '',
      department: course?.department || '',
      date: course?.date || '',
      distance: course?.distance || '',
      reward: course?.reward || '',
      description: course?.description || '',
      type: course?.type || 'Route' as 'Route' | 'Trail',
      image: course?.image || '/images/default-course.jpg',
      coordinates: {
        lat: course?.coordinates.lat || 0,
        lng: course?.coordinates.lng || 0
      }
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (course) {
        // Modification : inclure l'ID
        onSave({ ...formData, id: course.id });
      } else {
        // Ajout : sans ID
        onSave(formData);
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      if (name === 'lat' || name === 'lng') {
        setFormData(prev => ({
          ...prev,
          coordinates: {
            ...prev.coordinates,
            [name]: parseFloat(value) || 0
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {course ? 'Modifier la course' : 'Ajouter une nouvelle course'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nom de la course */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de la course *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Lieu */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lieu *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Département */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Département *
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Distance */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Distance *
                  </label>
                  <input
                    type="text"
                    name="distance"
                    value={formData.distance}
                    onChange={handleChange}
                    required
                    placeholder="ex: 42.2 km"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de course *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Route">Route</option>
                    <option value="Trail">Trail</option>
                  </select>
                </div>


                {/* Image */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📸 Image de la course
                  </label>
                  <div className="space-y-3">
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      placeholder="https://exemple.com/image.jpg"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F08040]"
                    />
                    <div className="text-xs text-gray-500">
                      💡 <strong>Conseil :</strong> Utilisez des URLs d&apos;images (ex: Unsplash, Pexels) ou hébergez votre image sur un service comme Imgur
                    </div>
                    {formData.image && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 mb-2">Aperçu :</p>
                        <img 
                          src={formData.image} 
                          alt="Aperçu de l'image" 
                          className="w-full h-32 object-cover rounded-lg border"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Coordonnées */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Coordonnées GPS</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Latitude
                      </label>
                      <input
                        type="number"
                        name="lat"
                        value={formData.coordinates.lat}
                        onChange={handleChange}
                        step="0.000001"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Longitude
                      </label>
                      <input
                        type="number"
                        name="lng"
                        value={formData.coordinates.lng}
                        onChange={handleChange}
                        step="0.000001"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Récompense */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Récompense *
                </label>
                <textarea
                  name="reward"
                  value={formData.reward}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Boutons */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {course ? 'Modifier' : 'Ajouter'} la course
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
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

        {/* Liste de tous les utilisateurs inscrits */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">Tous les utilisateurs inscrits pour l&apos;encadrement</h2>
            <div className="flex space-x-3">
              <button
                onClick={generateAllUsersDocument}
                disabled={isGenerating}
                className="bg-[#F08040] hover:bg-[#e06d2a] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:bg-gray-400"
              >
                {isGenerating ? 'Génération...' : '📄 Rapport complet'}
              </button>
              <button
                onClick={generateCSV}
                className="bg-[#6A70F0] hover:bg-[#5a60d4] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                📊 Export CSV
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adresse</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date inscription</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course sélectionnée</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#F08040] to-[#6A70F0] flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.gender} • Pointure {user.shoeSize}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.address ? (
                        <div>
                          <div>{user.address}</div>
                          <div>{user.postalCode} {user.city}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">Non renseignée</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.inscriptionDate).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : user.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.status === 'completed' ? 'Complété' : 
                         user.status === 'pending' ? 'En cours' : 'Actif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.selectedRace ? (
                        <div>
                          <div className="font-medium text-gray-900">{user.selectedRace.name}</div>
                          <div className="text-xs text-gray-500">{user.selectedRace.location}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">Aucune course</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Course Statistics */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Statistiques par course</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courseStats.map((course) => (
              <div key={course.courseId} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{course.courseName}</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-medium">{course.totalRegistrations}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-600">Confirmées:</span>
                    <span className="font-medium text-green-600">{course.confirmedRegistrations}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-600">En attente:</span>
                    <span className="font-medium text-yellow-600">{course.pendingRegistrations}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-600">Annulées:</span>
                    <span className="font-medium text-red-600">{course.cancelledRegistrations}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gestion des courses */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">Gestion des courses</h2>
            <button
              onClick={() => setShowAddCourseForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              + Ajouter une course
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lieu</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allCourses.map((course) => (
                  <tr key={course.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{course.name}</div>
                        <div className="text-sm text-gray-500">{course.distance}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{course.location}</div>
                      <div className="text-sm text-gray-500">{course.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(course.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        course.type === 'Route' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {course.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingCourse(course)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

        {/* Course Registrations Details */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Détails des inscriptions par course</h2>
          <div className="space-y-6">
            {courseStats.map((course) => (
              <div key={course.courseId} className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{course.courseName}</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ville</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Pointure</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {course.registrations.map((registration) => (
                        <tr key={registration.id}>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {registration.userInfo.firstName} {registration.userInfo.lastName}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900">{registration.userInfo.email}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{registration.userInfo.city}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{registration.userInfo.shoeSize}</td>
                          <td className="px-4 py-2 text-sm">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              registration.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              registration.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {registration.status === 'confirmed' ? 'Confirmée' :
                               registration.status === 'pending' ? 'En attente' : 'Annulée'}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500">
                            {new Date(registration.registrationDate).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-4 py-2 text-sm">
                            {registration.status === 'pending' && (
                              <button
                                onClick={() => {
                                  handleConfirmRegistration(
                                    registration.id,
                                    course.courseName,
                                    new Date().toLocaleDateString('fr-FR'),
                                    'Lieu de la course',
                                    registration.userInfo.email,
                                    `${registration.userInfo.firstName} ${registration.userInfo.lastName}`
                                  );
                                }}
                                disabled={sendingEmails.has(registration.id)}
                                className={`mr-2 ${
                                  sendingEmails.has(registration.id)
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-green-600 hover:text-green-900'
                                }`}
                              >
                                {sendingEmails.has(registration.id) ? 'Envoi...' : 'Confirmer'}
                              </button>
                            )}
                            {registration.status !== 'cancelled' && (
                              <button
                                onClick={() => {
                                  userDB.cancelRegistration(registration.id);
                                  // Recharger les données
                                  const stats = userDB.getCourseStats();
                                  setCourseStats(stats);
                                }}
                                className="text-red-600 hover:text-red-900"
                              >
                                Annuler
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
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

      {/* Modales de formulaire */}
      {showAddCourseForm && (
        <CourseForm
          onSave={handleAddCourse}
          onCancel={() => setShowAddCourseForm(false)}
        />
      )}

      {editingCourse && (
        <CourseForm
          course={editingCourse}
          onSave={handleEditCourse}
          onCancel={() => setEditingCourse(null)}
        />
      )}
    </div>
  );
}
