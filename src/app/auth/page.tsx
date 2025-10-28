'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { userDB } from '@/lib/userDatabase';
import { SecurityUtils } from '@/lib/security';

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const currentUser = userDB.getCurrentUser();
    if (currentUser) {
      // Vérifier s'il y a un raceId dans l'URL
      const raceId = searchParams.get('raceId');
      
      if (raceId) {
        // Rediriger vers la page d'inscription pour la course spécifiée
        router.push(`/inscription?raceId=${raceId}`);
      } else {
        // Rediriger vers la page de profil si déjà connecté
        router.push('/profile');
      }
    }
  }, [router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Vérifier le rate limiting
    if (!SecurityUtils.checkRateLimit('auth_attempt', 5, 300000)) { // 5 tentatives par 5 minutes
      setError('Trop de tentatives. Veuillez attendre avant de réessayer.');
      setIsLoading(false);
      return;
    }
    
    try {
      if (isLogin) {
        // Sanitisation des données de connexion
        const sanitizedEmail = SecurityUtils.sanitizeInput(email).toLowerCase();
        
        if (!SecurityUtils.isValidEmail(sanitizedEmail)) {
          setError('Format d\'email invalide');
          setIsLoading(false);
          return;
        }
        
        // Connexion
        const user = userDB.authenticate(sanitizedEmail, password);
        if (user) {
          // Redirection vers la page d'inscription après connexion
          const raceId = searchParams.get('raceId');
          if (raceId) {
            router.push(`/inscription?raceId=${raceId}`);
          } else {
            router.push('/courses');
          }
        } else {
          setError('Email ou mot de passe incorrect');
        }
      } else {
        // Validation des données d'inscription
        const validation = SecurityUtils.validateRegistrationData({
          firstName,
          lastName,
          email: email.toLowerCase(),
          password,
          confirmPassword: password
        });
        
        if (!validation.isValid) {
          setError(`Erreurs de validation:\n${validation.errors.join('\n')}`);
          setIsLoading(false);
          return;
        }
        
        if (password !== confirmPassword) {
          setError('Les mots de passe ne correspondent pas');
          setIsLoading(false);
          return;
        }

        const lowerEmail = email.toLowerCase();
        
        if (userDB.emailExists(lowerEmail)) {
          setError('Un compte avec cet email existe déjà');
          setIsLoading(false);
          return;
        }

        // Créer le compte et se connecter automatiquement
        try {
          userDB.createUser({
            firstName,
            lastName,
            email: lowerEmail,
            password,
            address: '',
            city: '',
            postalCode: '',
            birthDate: '',
            gender: '',
            shoeSize: '',
            favoriteCourses: []
          });

          // Se connecter automatiquement après l'inscription
          userDB.authenticate(lowerEmail, password);
        } catch (createError) {
          setError(createError instanceof Error ? createError.message : 'Erreur lors de la création du compte');
          setIsLoading(false);
          return;
        }

        // Redirection vers la page d'inscription après inscription
        let raceId = searchParams.get('raceId');
        
        // Si pas de raceId dans l'URL, essayer de le récupérer depuis localStorage
        if (!raceId && typeof window !== 'undefined') {
          const storedRace = localStorage.getItem('selected-race');
          if (storedRace) {
            try {
              const raceData = JSON.parse(storedRace);
              raceId = raceData.id?.toString();
              console.log('🔍 RaceId récupéré depuis localStorage:', raceId);
            } catch (e) {
              console.error('Erreur lors du parsing de la course stockée:', e);
            }
          }
        }
        
        console.log('🔍 Redirection après inscription - raceId final:', raceId);
        
        if (raceId) {
          console.log('✅ Redirection vers /inscription?raceId=' + raceId);
          router.push(`/inscription?raceId=${raceId}`);
        } else {
          console.log('⚠️ Pas de raceId, redirection vers /courses');
          router.push('/courses');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            RunReward
          </h1>
          <p className="text-gray-600">
            Encadrez des courses en tant que bénévole et gagnez des récompenses
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Toggle Login/Signup */}
          <div className="flex mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-l-lg transition-colors ${
                isLogin
                  ? 'bg-[#F08040] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Se connecter
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-r-lg transition-colors ${
                !isLogin
                  ? 'bg-[#F08040] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              S&apos;inscrire
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse e-mail
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-[#F08040] focus:border-[#F08040] sm:text-sm"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            {!isLogin && (
              <>
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    Prénom
                  </label>
                  <div className="mt-1">
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-[#F08040] focus:border-[#F08040] sm:text-sm"
                      placeholder="Votre prénom"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Nom
                  </label>
                  <div className="mt-1">
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-[#F08040] focus:border-[#F08040] sm:text-sm"
                      placeholder="Votre nom"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-[#F08040] focus:border-[#F08040] sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirmer le mot de passe
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-[#F08040] focus:border-[#F08040] sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
                {password && confirmPassword && password !== confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">Les mots de passe ne correspondent pas</p>
                )}
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {isLogin && (
              <div className="text-sm">
                <a href="#" className="font-medium text-[#F08040] hover:text-[#F08040]">
                  Mot de passe oublié ?
                </a>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading || (!isLogin && password !== confirmPassword)}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#F08040] hover:bg-[#e06d2a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F08040] disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isLogin ? 'Connexion...' : 'Création du compte...'}
                  </>
                ) : (
                  isLogin ? 'Se connecter' : 'Créer mon compte'
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    }>
      <AuthPageContent />
    </Suspense>
  );
}
