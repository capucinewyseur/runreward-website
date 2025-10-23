import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl runreward-title text-gray-900 mb-6">
              <span className="logo-rr">RR</span>
              RunReward
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              La plateforme qui récompense les coureurs pour leur engagement bénévole. 
              Encadrez des courses en tant que bénévole et gagnez <span className="font-semibold text-gray-800">des récompenses et réductions sur vos prochains dossards</span> tout en passant un moment convivial dans l&apos;ambiance festive de la course.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/courses" 
                className="bg-[#F08040] hover:bg-[#e06d2a] text-white px-8 py-4 rounded text-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
              >
                Voir les courses
              </Link>
              <Link 
                href="/about" 
                className="bg-[#6A70F0] hover:bg-[#5a60d4] text-white px-8 py-4 rounded text-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
              >
                En savoir plus
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Quatre étapes simples pour commencer à gagner des récompenses en courant
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="bg-[#F08040]/10 w-16 h-16 rounded flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#F08040]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Inscrivez-vous</h3>
              <p className="text-gray-600">
                Créez votre compte gratuitement et complétez votre profil de coureur
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-[#6A70F0]/10 w-16 h-16 rounded flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#6A70F0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Choisissez une course</h3>
              <p className="text-gray-600">
                Sélectionnez une course bénévole qui vous intéresse et inscrivez-vous
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-[#F08040]/10 w-16 h-16 rounded flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#F08040]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Validation</h3>
              <p className="text-gray-600">
                L&apos;organisateur de la course vous contacte pour valider votre inscription
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-[#6A70F0]/10 w-16 h-16 rounded flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#6A70F0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">4. Soyez bénévole</h3>
              <p className="text-gray-600">
                Soyez bénévole pour encadrer la course et récupérez votre récompense
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-[#F08040] to-[#6A70F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-white/90">Courses organisées</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100+</div>
              <div className="text-white/90">Récompenses et remises disponibles</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">25</div>
              <div className="text-white/90">Villes partenaires</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Prêt à commencer votre aventure ?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Rejoignez notre communauté de coureurs motivés et commencez à gagner des récompenses dès aujourd&apos;hui.
          </p>
          <Link 
            href="/courses" 
            className="inline-block bg-[#F08040] hover:bg-[#e06d2a] text-white px-8 py-4 rounded text-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
          >
            Découvrir les courses disponibles
          </Link>
        </div>
      </section>
    </div>
  );
}