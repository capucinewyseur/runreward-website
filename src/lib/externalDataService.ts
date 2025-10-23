// Service de gestion des données externes
import { User, CourseRegistration, CourseFavorite } from './userDatabase';

export interface DatabaseData {
  users: User[];
  courseRegistrations: CourseRegistration[];
  courseFavorites: CourseFavorite[];
  currentUser: User | null;
}

class ExternalDataService {
  private data: DatabaseData = {
    users: [],
    courseRegistrations: [],
    courseFavorites: [],
    currentUser: null
  };

  constructor() {
    this.loadData();
  }

  // Charger les données depuis le fichier JSON
  private async loadData() {
    try {
      const response = await fetch('/data/database.json');
      if (response.ok) {
        this.data = await response.json();
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  }

  // Sauvegarder les données (pour le développement local)
  private async saveData() {
    try {
      // En production, ceci devrait envoyer les données à une API
      console.log('Données à sauvegarder:', this.data);
      
      // Pour le développement, on peut aussi sauvegarder dans localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('runreward-users', JSON.stringify(this.data.users));
        localStorage.setItem('runreward-course-registrations', JSON.stringify(this.data.courseRegistrations));
        localStorage.setItem('runreward-course-favorites', JSON.stringify(this.data.courseFavorites));
        localStorage.setItem('runreward-current-user', JSON.stringify(this.data.currentUser));
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  }

  // Méthodes pour les utilisateurs
  getUsers(): User[] {
    return this.data.users;
  }

  addUser(user: User): void {
    this.data.users.push(user);
    this.saveData();
  }

  updateUser(userId: string, updates: Partial<User>): void {
    const index = this.data.users.findIndex(u => u.id === userId);
    if (index !== -1) {
      this.data.users[index] = { ...this.data.users[index], ...updates };
      this.saveData();
    }
  }

  // Méthodes pour les inscriptions
  getCourseRegistrations(): CourseRegistration[] {
    return this.data.courseRegistrations;
  }

  addCourseRegistration(registration: CourseRegistration): void {
    this.data.courseRegistrations.push(registration);
    this.saveData();
  }

  // Méthodes pour les favoris
  getCourseFavorites(): CourseFavorite[] {
    return this.data.courseFavorites;
  }

  addCourseFavorite(favorite: CourseFavorite): void {
    this.data.courseFavorites.push(favorite);
    this.saveData();
  }

  removeCourseFavorite(userId: string, courseId: number): void {
    this.data.courseFavorites = this.data.courseFavorites.filter(
      f => !(f.userId === userId && f.courseId === courseId)
    );
    this.saveData();
  }

  // Méthodes pour l'utilisateur actuel
  getCurrentUser(): User | null {
    return this.data.currentUser;
  }

  setCurrentUser(user: User | null): void {
    this.data.currentUser = user;
    this.saveData();
  }

  // Méthode pour migrer depuis localStorage
  async migrateFromLocalStorage() {
    if (typeof window !== 'undefined') {
      const users = localStorage.getItem('runreward-users');
      const registrations = localStorage.getItem('runreward-course-registrations');
      const favorites = localStorage.getItem('runreward-course-favorites');
      const currentUser = localStorage.getItem('runreward-current-user');

      if (users) this.data.users = JSON.parse(users);
      if (registrations) this.data.courseRegistrations = JSON.parse(registrations);
      if (favorites) this.data.courseFavorites = JSON.parse(favorites);
      if (currentUser) this.data.currentUser = JSON.parse(currentUser);

      console.log('Migration depuis localStorage terminée:', this.data);
    }
  }
}

export const externalDataService = new ExternalDataService();
