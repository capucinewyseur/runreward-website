import Link from 'next/link';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <Logo size="md" className="mr-3" />
              <span className="text-xl runreward-title text-white">RunReward</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              La plateforme qui récompense les coureurs pour leur engagement bénévole. 
              Participez à des courses et gagnez des récompenses tout en contribuant à la communauté.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/run.reward/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#F08040] transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-[#F08040] transition-colors">Accueil</Link></li>
              <li><Link href="/courses" className="text-gray-300 hover:text-[#F08040] transition-colors">Courses</Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-[#F08040] transition-colors">À propos</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-[#F08040] transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/help" className="text-gray-300 hover:text-[#F08040] transition-colors">Centre d&apos;aide</Link></li>
              <li><Link href="/faq" className="text-gray-300 hover:text-[#F08040] transition-colors">FAQ</Link></li>
              <li><Link href="/terms" className="text-gray-300 hover:text-[#F08040] transition-colors">Conditions d&apos;utilisation</Link></li>
              <li><Link href="/privacy" className="text-gray-300 hover:text-[#F08040] transition-colors">Politique de confidentialité</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 RunReward. Tous droits réservés. Fait avec ❤️ pour la communauté des coureurs.
          </p>
        </div>
      </div>
    </footer>
  );
}
