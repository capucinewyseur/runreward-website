import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#F08040] to-[#6A70F0] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Contactez-nous
            </h1>
            <p className="text-xl md:text-2xl text-white/90">
              Nous sommes là pour vous aider
            </p>
          </div>
        </div>
      </div>

      {/* Contact Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-r from-[#F08040] to-[#6A70F0] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Une question ? Besoin d&apos;aide ?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Notre équipe est là pour répondre à toutes vos questions concernant les courses, 
              les inscriptions ou toute autre demande.
            </p>
          </div>

          {/* Contact Methods */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Email Contact */}
            <div className="text-center p-6 bg-gradient-to-br from-[#F08040]/5 to-[#6A70F0]/5 rounded-xl">
              <div className="w-16 h-16 bg-[#F08040] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Email</h3>
              <p className="text-gray-600 mb-4">
                Pour toutes vos questions, envoyez-nous un email
              </p>
              <a 
                href="mailto:capucine.runreward@gmail.com"
                className="inline-block bg-[#F08040] hover:bg-[#e06d2a] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                capucine.runreward@gmail.com
              </a>
            </div>

            {/* Instagram Contact */}
            <div className="text-center p-6 bg-gradient-to-br from-[#6A70F0]/5 to-[#F08040]/5 rounded-xl">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Instagram</h3>
              <p className="text-gray-600 mb-4">
                Suivez-nous pour les dernières actualités et photos
              </p>
              <a 
                href="https://www.instagram.com/run.reward/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                @run.reward
              </a>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-[#F08040]/10 to-[#6A70F0]/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                💬 Réponse rapide garantie
              </h3>
              <p className="text-gray-600">
                Nous nous efforçons de répondre à tous les emails dans les <strong>24 heures</strong>. 
                Pour les questions urgentes, n&apos;hésitez pas à nous mentionner sur Instagram !
              </p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              ← Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
