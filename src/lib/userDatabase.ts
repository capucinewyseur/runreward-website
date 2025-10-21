// Système de gestion des utilisateurs et inscriptions par course
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
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface CourseStats {
  courseId: number;
  courseName: string;
  totalRegistrations: number;
  confirmedRegistrations: number;
  pendingRegistrations: number;
  cancelledRegistrations: number;
  registrations: CourseRegistration[];
}

class UserDatabase {
  private users: User[] = [];
  private currentUser: User | null = null;
  private courseRegistrations: CourseRegistration[] = [];

  constructor() {
    // Charger les utilisateurs et inscriptions depuis localStorage au démarrage
    this.loadUsers();
    this.loadCourseRegistrations();
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
      status: 'pending'
    };

    this.users.push(newUser);
    this.saveUsers();
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
  completeRegistration(userId: string, raceData: {id: number; name: string; location: string; date: string; distance: string; reward: string; type: string}): User | null {
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
}

// Instance singleton
export const userDB = new UserDatabase();
