// Utilitaires de sécurité pour RunReward
export class SecurityUtils {
  
  // Sanitisation des entrées utilisateur
  static sanitizeInput(input: string): string {
    if (!input) return '';
    
    return input
      .trim()
      .replace(/[<>]/g, '') // Supprimer les balises HTML
      .replace(/javascript:/gi, '') // Supprimer les scripts JS
      .replace(/on\w+=/gi, '') // Supprimer les événements JS
      .substring(0, 1000); // Limiter la longueur
  }

  // Validation email
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  // Validation mot de passe
  static isValidPassword(password: string): boolean {
    return password.length >= 8 && 
           password.length <= 128 &&
           /[A-Z]/.test(password) && // Au moins une majuscule
           /[a-z]/.test(password) && // Au moins une minuscule
           /[0-9]/.test(password) && // Au moins un chiffre
           /[^A-Za-z0-9]/.test(password); // Au moins un caractère spécial
  }

  // Validation téléphone
  static isValidPhone(phone: string): boolean {
    const phoneRegex = /^[+]?[0-9\s\-\(\)]{10,15}$/;
    return phoneRegex.test(phone);
  }

  // Validation date
  static isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    const now = new Date();
    const minAge = new Date(now.getFullYear() - 100, now.getMonth(), now.getDate());
    const maxAge = new Date(now.getFullYear() - 13, now.getMonth(), now.getDate());
    
    return date instanceof Date && 
           !isNaN(date.getTime()) && 
           date >= minAge && 
           date <= maxAge;
  }

  // Génération de token CSRF simple
  static generateCSRFToken(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  // Validation des champs de course
  static validateCourseField(field: Record<string, unknown>): boolean {
    if (!field || typeof field !== 'object') return false;
    
    const validTypes = ['text', 'email', 'tel', 'number', 'select', 'textarea', 'date'];
    const validId = /^[a-zA-Z][a-zA-Z0-9_]*$/.test(String(field.id || ''));
    const validLabel = field.label && String(field.label).length <= 100;
    const validType = validTypes.includes(String(field.type || ''));
    
    return validId && validLabel && validType;
  }

  // Rate limiting simple (basé sur localStorage)
  static checkRateLimit(action: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
    if (typeof window === 'undefined') return true;
    
    const key = `rate_limit_${action}`;
    const now = Date.now();
    const attempts = JSON.parse(localStorage.getItem(key) || '[]');
    
    // Nettoyer les tentatives anciennes
    const recentAttempts = attempts.filter((time: number) => now - time < windowMs);
    
    if (recentAttempts.length >= maxAttempts) {
      return false;
    }
    
    // Ajouter la nouvelle tentative
    recentAttempts.push(now);
    localStorage.setItem(key, JSON.stringify(recentAttempts));
    
    return true;
  }

  // Validation des données d'inscription
  static validateRegistrationData(data: Record<string, string>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!data.firstName || data.firstName.length < 2) {
      errors.push('Le prénom doit contenir au moins 2 caractères');
    }
    
    if (!data.lastName || data.lastName.length < 2) {
      errors.push('Le nom doit contenir au moins 2 caractères');
    }
    
    if (!this.isValidEmail(data.email)) {
      errors.push('Email invalide');
    }
    
    if (!this.isValidPassword(data.password)) {
      errors.push('Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial');
    }
    
    if (data.password !== data.confirmPassword) {
      errors.push('Les mots de passe ne correspondent pas');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}