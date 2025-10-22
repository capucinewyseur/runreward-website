import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#F08040] to-[#6A70F0] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Comment ça marche ?
            </h1>
            <p className="text-xl md:text-2xl text-white/90">
              Découvrez notre processus détaillé pour devenir bénévole
            </p>
          </div>
        </div>
      </div>

      {/* Processus détaillé */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Étape 1 */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <div className="bg-[#F08040]/10 w-16 h-16 rounded-full flex items-center justify-center mr-6">
                <svg className="w-8 h-8 text-[#F08040]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">1. Inscrivez-vous</h2>
                <p className="text-[#F08040] font-semibold">Création du compte</p>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700">
                Créez votre compte RunReward gratuitement en quelques minutes. 
                Remplissez votre profil de coureur avec vos informations personnelles.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Nom, prénom et adresse email</li>
                <li>Adresse complète et informations de contact</li>
                <li>Date de naissance et taille de chaussure</li>
                <li>Préférences de course (route, trail, etc.)</li>
              </ul>
            </div>
          </div>

          {/* Étape 2 */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <div className="bg-[#6A70F0]/10 w-16 h-16 rounded-full flex items-center justify-center mr-6">
                <svg className="w-8 h-8 text-[#6A70F0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">2. Choisissez une course</h2>
                <p className="text-[#6A70F0] font-semibold">Sélection et inscription</p>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700">
                Parcourez notre catalogue de courses bénévoles et sélectionnez celle qui vous intéresse. 
                Chaque course propose des récompenses attractives pour les bénévoles.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Filtrez par lieu, date et type de course</li>
                <li>Consultez les détails et récompenses</li>
                <li>Inscrivez-vous en tant que bénévole</li>
                <li>Recevez une confirmation d&apos;inscription</li>
              </ul>
            </div>
          </div>

          {/* Étape 3 */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <div className="bg-[#F08040]/10 w-16 h-16 rounded-full flex items-center justify-center mr-6">
                <svg className="w-8 h-8 text-[#F08040]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">3. Validation</h2>
                <p className="text-[#F08040] font-semibold">Contact de l&apos;organisateur</p>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700">
                L&apos;organisateur de la course vous contacte directement pour valider votre inscription 
                et vous donner toutes les informations pratiques pour le jour J.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Vérification de votre profil bénévole</li>
                <li>Attribution de votre poste spécifique</li>
                <li>Informations sur le rendez-vous</li>
                <li>Briefing sur vos responsabilités</li>
              </ul>
            </div>
          </div>

          {/* Étape 4 */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <div className="bg-[#6A70F0]/10 w-16 h-16 rounded-full flex items-center justify-center mr-6">
                <svg className="w-8 h-8 text-[#6A70F0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">4. Soyez bénévole</h2>
                <p className="text-[#6A70F0] font-semibold">Participation et récompense</p>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700">
                Le jour de la course, participez activement en tant que bénévole pour encadrer les coureurs. 
                À la fin de votre mission, récupérez votre récompense !
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Accueil et orientation des coureurs</li>
                <li>Distribution de ravitaillements</li>
                <li>Sécurité et encouragement</li>
                <li>Récupération de votre récompense</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section récompenses */}
        <div className="mt-16 bg-gradient-to-r from-[#F08040]/10 to-[#6A70F0]/10 rounded-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              🎁 Types de récompenses
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Nos partenaires offrent des récompenses variées pour vous remercier de votre engagement bénévole
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Bons d&apos;achat</h3>
              <p className="text-gray-600">Vouchers pour équipements sportifs, restaurants, ou services</p>
            </div>
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">👕</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Équipements</h3>
              <p className="text-gray-600">T-shirts techniques, casquettes, gourdes, ou accessoires de course</p>
            </div>
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">🏃‍♂️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Réductions</h3>
              <p className="text-gray-600">Remises sur vos prochains dossards de course</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Prêt à commencer votre aventure ?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Rejoignez notre communauté de bénévoles et découvrez les courses disponibles près de chez vous.
          </p>
          <Link
            href="/courses"
            className="inline-block bg-[#F08040] hover:bg-[#e06d2a] text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
          >
            Voir les courses
          </Link>
        </div>
      </div>
    </div>
  );
}
