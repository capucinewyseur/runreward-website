// Système de gestion des utilisateurs et inscriptions par course
import { externalDataService } from './externalDataService';
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address: string;
  city: string;
  postalCode: string;
  birthDate: string;
  gender: string;
  shoeSize: string;
  inscriptionDate: string;
  status: 'active' | 'pending' | 'completed';
  selectedRace?: {
    id: number;
    name: string;
    location: string;
    date: string;
    distance: string;
    reward: string;
    type: string;
  };
  favoriteCourses: number[]; // IDs des courses mises en favori
}

export interface CourseRegistration {
  id: string;
  userId: string;
  courseId: number;
  courseName: string;
  registrationDate: string;
  userInfo: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    birthDate: string;
    gender: string;
    shoeSize: string;
  };
  customFields?: Record<string, string>; // Champs personnalisés spécifiques à la course
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface CourseStats {
  courseId: number;
  courseName: string;
  totalRegistrations: number;
  confirmedRegistrations: number;
  pendingRegistrations: number;
  cancelledRegistrations: number;
  totalFavorites: number; // Nombre total de favoris pour cette course
  registrations: CourseRegistration[];
}

export interface CourseFavorite {
  id: string;
  userId: string;
  courseId: number;
  courseName: string;
  favoriteDate: string;
  userInfo: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

class UserDatabase {
  private users: User[] = [];
  private currentUser: User | null = null;
  private courseRegistrations: CourseRegistration[] = [];
  private courseFavorites: CourseFavorite[] = [];

  constructor() {
    // Charger les utilisateurs et inscriptions depuis localStorage au démarrage
    this.loadUsers();
    this.loadCourseRegistrations();
    this.loadCourseFavorites();
    this.loadCurrentUser();
    
    // Migrer les données vers le service externe
    this.migrateToExternalService();
  }

  private loadUsers() {
    if (typeof window !== 'undefined') {
      const storedUsers = localStorage.getItem('runreward-users');
      if (storedUsers) {
        this.users = JSON.parse(storedUsers);
      }
    }
  }

  private loadCourseRegistrations() {
    if (typeof window !== 'undefined') {
      const storedRegistrations = localStorage.getItem('runreward-course-registrations');
      if (storedRegistrations) {
        this.courseRegistrations = JSON.parse(storedRegistrations);
      }
    }
  }

  private saveUsers() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('runreward-users', JSON.stringify(this.users));
    }
  }

  private saveCourseRegistrations() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('runreward-course-registrations', JSON.stringify(this.courseRegistrations));
    }
  }

  private loadCurrentUser() {
    if (typeof window !== 'undefined') {
      const currentUserId = localStorage.getItem('runreward-current-user');
      if (currentUserId) {
        this.currentUser = this.users.find(user => user.id === currentUserId) || null;
      }
    }
  }

  // Vérifier si un email existe déjà
  emailExists(email: string): boolean {
    return this.users.some(user => user.email.toLowerCase() === email.toLowerCase());
  }

  // Créer un nouvel utilisateur
  createUser(userData: Omit<User, 'id' | 'inscriptionDate' | 'status'>): User {
    if (this.emailExists(userData.email)) {
      throw new Error('Un compte avec cet email existe déjà');
    }

    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      inscriptionDate: new Date().toISOString(),
      status: 'pending',
      favoriteCourses: userData.favoriteCourses || []
    };

    this.users.push(newUser);
    this.saveUsers();
    
    // Connecter automatiquement le nouvel utilisateur
    this.currentUser = newUser;
    if (typeof window !== 'undefined') {
      localStorage.setItem('runreward-current-user', newUser.id);
    }
    
    return newUser;
  }

  // Authentifier un utilisateur
  authenticate(email: string, password: string): User | null {
    const user = this.users.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.password === password
    );
    
    if (user) {
      this.currentUser = user;
      // Sauvegarder l'utilisateur connecté dans localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('runreward-current-user', user.id);
      }
      return user;
    }
    
    return null;
  }

  // Obtenir l'utilisateur actuel
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Déconnexion
  logout() {
    this.currentUser = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('runreward-current-user');
    }
  }

  // Mettre à jour les informations d'un utilisateur
  updateUser(userId: string, updates: Partial<User>): User | null {
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) return null;

    this.users[userIndex] = { ...this.users[userIndex], ...updates };
    this.saveUsers();
    
    if (this.currentUser?.id === userId) {
      this.currentUser = this.users[userIndex];
    }
    
    return this.users[userIndex];
  }

  // Obtenir tous les utilisateurs (pour l'admin)
  getAllUsers(): User[] {
    return [...this.users];
  }

  // Supprimer un utilisateur
  deleteUser(userId: string): boolean {
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) return false;

    this.users.splice(userIndex, 1);
    this.saveUsers();
    
    if (this.currentUser?.id === userId) {
      this.currentUser = null;
    }
    
    return true;
  }

  // Finaliser l'inscription d'un utilisateur
  completeRegistration(userId: string, raceData: {id: number; name: string; location: string; date: string; distance: string; reward: string; type: string; customFields?: Record<string, string>}): User | null {
    const user = this.updateUser(userId, {
      status: 'completed',
      selectedRace: raceData
    });

    if (user) {
      // Créer une inscription pour cette course
      const registration: CourseRegistration = {
        id: Date.now().toString(),
        userId: userId,
        courseId: raceData.id,
        courseName: raceData.name,
        registrationDate: new Date().toISOString(),
        userInfo: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          address: user.address,
          city: user.city,
          postalCode: user.postalCode,
          birthDate: user.birthDate,
          gender: user.gender,
          shoeSize: user.shoeSize
        },
        customFields: raceData.customFields, // Ajouter les champs personnalisés
        status: 'pending'
      };

      this.courseRegistrations.push(registration);
      this.saveCourseRegistrations();
    }

    return user;
  }

  // Obtenir toutes les inscriptions par course
  getCourseRegistrations(courseId?: number): CourseRegistration[] {
    if (courseId) {
      return this.courseRegistrations.filter(reg => reg.courseId === courseId);
    }
    return [...this.courseRegistrations];
  }

  // Obtenir les statistiques par course
  getCourseStats(): CourseStats[] {
    const courseMap = new Map<number, CourseStats>();

    this.courseRegistrations.forEach(registration => {
      const courseId = registration.courseId;
      
      if (!courseMap.has(courseId)) {
        courseMap.set(courseId, {
          courseId: courseId,
          courseName: registration.courseName,
          totalRegistrations: 0,
          confirmedRegistrations: 0,
          pendingRegistrations: 0,
          cancelledRegistrations: 0,
          totalFavorites: 0,
          registrations: []
        });
      }

      const stats = courseMap.get(courseId)!;
      stats.totalRegistrations++;
      stats.registrations.push(registration);

      switch (registration.status) {
        case 'confirmed':
          stats.confirmedRegistrations++;
          break;
        case 'pending':
          stats.pendingRegistrations++;
          break;
        case 'cancelled':
          stats.cancelledRegistrations++;
          break;
      }
    });

    // Ajouter les statistiques des favoris
    const favoritesStats = this.getFavoritesStats();
    favoritesStats.forEach(favStat => {
      const stats = courseMap.get(favStat.courseId);
      if (stats) {
        stats.totalFavorites = favStat.totalFavorites;
      }
    });

    return Array.from(courseMap.values());
  }

  // Confirmer une inscription
  confirmRegistration(registrationId: string): boolean {
    const registration = this.courseRegistrations.find(reg => reg.id === registrationId);
    if (registration) {
      registration.status = 'confirmed';
      this.saveCourseRegistrations();
      return true;
    }
    return false;
  }

  // Annuler une inscription
  cancelRegistration(registrationId: string): boolean {
    const registration = this.courseRegistrations.find(reg => reg.id === registrationId);
    if (registration) {
      registration.status = 'cancelled';
      this.saveCourseRegistrations();
      return true;
    }
    return false;
  }

  // === MÉTHODES POUR LES FAVORIS ===

  // Charger les favoris depuis localStorage
  private loadCourseFavorites(): void {
    if (typeof window !== 'undefined') {
      const storedFavorites = localStorage.getItem('runreward-course-favorites');
      if (storedFavorites) {
        this.courseFavorites = JSON.parse(storedFavorites);
      }
    }
  }

  // Sauvegarder les favoris dans localStorage
  private saveCourseFavorites(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('runreward-course-favorites', JSON.stringify(this.courseFavorites));
    }
  }

  // Ajouter une course aux favoris
  addToFavorites(courseId: number, courseName: string): boolean {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return false;
    }

    // Vérifier si déjà en favori
    const existingFavorite = this.courseFavorites.find(
      fav => fav.userId === currentUser.id && fav.courseId === courseId
    );

    if (existingFavorite) {
      return false; // Déjà en favori
    }

    // Ajouter aux favoris
    const favorite: CourseFavorite = {
      id: Date.now().toString(),
      userId: currentUser.id,
      courseId: courseId,
      courseName: courseName,
      favoriteDate: new Date().toISOString(),
      userInfo: {
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email
      }
    };

    this.courseFavorites.push(favorite);

    // Mettre à jour l'utilisateur
    if (!currentUser.favoriteCourses) {
      currentUser.favoriteCourses = [];
    }
    currentUser.favoriteCourses.push(courseId);
    this.saveUsers();
    this.saveCourseFavorites();

    return true;
  }

  // Retirer une course des favoris
  removeFromFavorites(courseId: number): boolean {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return false;
    }

    // Retirer des favoris globaux
    this.courseFavorites = this.courseFavorites.filter(
      fav => !(fav.userId === currentUser.id && fav.courseId === courseId)
    );

    // Mettre à jour l'utilisateur
    if (currentUser.favoriteCourses) {
      currentUser.favoriteCourses = currentUser.favoriteCourses.filter(id => id !== courseId);
    }
    this.saveUsers();
    this.saveCourseFavorites();

    return true;
  }

  // Vérifier si une course est en favori
  isFavorite(courseId: number): boolean {
    const currentUser = this.getCurrentUser();
    if (!currentUser || !currentUser.favoriteCourses) {
      return false;
    }
    return currentUser.favoriteCourses.includes(courseId);
  }

  // Obtenir les courses favorites de l'utilisateur connecté
  getUserFavorites(): CourseFavorite[] {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return [];
    }
    return this.courseFavorites.filter(fav => fav.userId === currentUser.id);
  }

  // Obtenir tous les favoris pour une course spécifique (pour l'admin)
  getCourseFavorites(courseId: number): CourseFavorite[] {
    return this.courseFavorites.filter(fav => fav.courseId === courseId);
  }

  // Obtenir les statistiques des favoris par course
  getFavoritesStats(): { courseId: number; courseName: string; totalFavorites: number }[] {
    const courseMap = new Map<number, { courseName: string; totalFavorites: number }>();

    this.courseFavorites.forEach(favorite => {
      const existing = courseMap.get(favorite.courseId);
      if (existing) {
        existing.totalFavorites++;
      } else {
        courseMap.set(favorite.courseId, {
          courseName: favorite.courseName,
          totalFavorites: 1
        });
      }
    });

    return Array.from(courseMap.entries()).map(([courseId, data]) => ({
      courseId,
      courseName: data.courseName,
      totalFavorites: data.totalFavorites
    }));
  }

  // Méthode pour migrer les données vers le service externe
  private async migrateToExternalService() {
    try {
      // Migrer les utilisateurs
      this.users.forEach(user => {
        externalDataService.addUser(user);
      });

      // Migrer les inscriptions
      this.courseRegistrations.forEach(registration => {
        externalDataService.addCourseRegistration(registration);
      });

      // Migrer les favoris
      this.courseFavorites.forEach(favorite => {
        externalDataService.addCourseFavorite(favorite);
      });

      // Migrer l'utilisateur actuel
      if (this.currentUser) {
        externalDataService.setCurrentUser(this.currentUser);
      }

      console.log('✅ Migration vers le service externe terminée');
    } catch (error) {
      console.error('❌ Erreur lors de la migration:', error);
    }
  }

  // Méthode pour obtenir les données depuis le service externe
  async loadFromExternalService() {
    try {
      this.users = externalDataService.getUsers();
      this.courseRegistrations = externalDataService.getCourseRegistrations();
      this.courseFavorites = externalDataService.getCourseFavorites();
      this.currentUser = externalDataService.getCurrentUser();
      
      console.log('✅ Données chargées depuis le service externe');
    } catch (error) {
      console.error('❌ Erreur lors du chargement depuis le service externe:', error);
    }
  }
}

// Instance singleton
export const userDB = new UserDatabase();
