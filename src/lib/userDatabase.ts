// Système de gestion des utilisateurs pour éviter les doublons
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

class UserDatabase {
  private users: User[] = [];
  private currentUser: User | null = null;

  constructor() {
    // Charger les utilisateurs depuis localStorage au démarrage
    this.loadUsers();
  }

  private loadUsers() {
    if (typeof window !== 'undefined') {
      const storedUsers = localStorage.getItem('runreward-users');
      if (storedUsers) {
        this.users = JSON.parse(storedUsers);
      }
    }
  }

  private saveUsers() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('runreward-users', JSON.stringify(this.users));
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
    return this.updateUser(userId, {
      status: 'completed',
      selectedRace: raceData
    });
  }
}

// Instance singleton
export const userDB = new UserDatabase();
