'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { userDB } from '@/lib/userDatabase';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);

  useEffect(() => {
    const currentUser = userDB.getCurrentUser();
    setIsAuthenticated(!!currentUser);
    
    if (currentUser) {
      const favorites = userDB.getUserFavorites();
      setFavoritesCount(favorites.length);
    }
  }, []);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="logo-navbar">RR</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-[#F08040] px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Accueil
            </Link>
            <Link href="/courses" className="text-gray-700 hover:text-[#F08040] px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Courses
            </Link>
            {isAuthenticated && (
              <Link href="/favorites" className="text-gray-700 hover:text-[#F08040] px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
                <span className="mr-1">❤️</span>
                Favoris
                {favoritesCount > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                    {favoritesCount}
                  </span>
                )}
              </Link>
            )}
            <Link href="/about" className="text-gray-700 hover:text-[#F08040] px-3 py-2 rounded-md text-sm font-medium transition-colors">
              À propos
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-[#F08040] px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Contact
            </Link>
            <Link href="/profile" className="bg-[#F08040] hover:bg-[#e06d2a] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              {isAuthenticated ? 'Mon profil' : 'Se connecter'}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-[#F08040] focus:outline-none focus:text-[#F08040]"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link href="/" className="text-gray-700 hover:text-[#F08040] block px-3 py-2 rounded-md text-base font-medium">
                Accueil
              </Link>
              <Link href="/courses" className="text-gray-700 hover:text-[#F08040] block px-3 py-2 rounded-md text-base font-medium">
                Courses
              </Link>
              {isAuthenticated && (
                <Link href="/favorites" className="text-gray-700 hover:text-[#F08040] block px-3 py-2 rounded-md text-base font-medium flex items-center">
                  <span className="mr-2">❤️</span>
                  Favoris
                  {favoritesCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {favoritesCount}
                    </span>
                  )}
                </Link>
              )}
              <Link href="/about" className="text-gray-700 hover:text-[#F08040] block px-3 py-2 rounded-md text-base font-medium">
                À propos
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-[#F08040] block px-3 py-2 rounded-md text-base font-medium">
                Contact
              </Link>
              <Link href="/profile" className="bg-[#F08040] hover:bg-[#e06d2a] text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium">
                {isAuthenticated ? 'Mon profil' : 'Se connecter'}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
