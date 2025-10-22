export interface Course {
  id: number;
  name: string;
  location: string;
  department: string;
  date: string;
  distance: string;
  reward: string;
  description: string;
  type: 'Route' | 'Trail';
  image: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

class CourseDatabase {
  private courses: Course[] = [];

  constructor() {
    this.loadCourses();
  }

  private loadCourses() {
    if (typeof window !== 'undefined') {
      const storedCourses = localStorage.getItem('runreward-courses');
      if (storedCourses) {
        this.courses = JSON.parse(storedCourses);
      } else {
        // Courses par défaut
        this.courses = [
          {
            id: 1,
            name: "Marathon de Paris",
            location: "Paris",
            department: "75",
            date: "2024-04-14",
            distance: "42.2 km",
            reward: "Médaille finisher + T-shirt technique",
            description: "Le mythique Marathon de Paris à travers les plus beaux monuments de la capitale. Une expérience inoubliable pour tous les coureurs.",
            type: "Route",
            image: "/images/paris-marathon.jpg",
            coordinates: { lat: 48.8566, lng: 2.3522 }
          },
          {
            id: 2,
            name: "Trail des Vosges",
            location: "Épinal",
            department: "88",
            date: "2024-05-18",
            distance: "25 km",
            reward: "Buff technique + Repas local",
            description: "Découvrez les magnifiques paysages vosgiens lors de ce trail technique et exigeant. Parfait pour les amateurs de nature.",
            type: "Trail",
            image: "/images/vosges-trail.jpg",
            coordinates: { lat: 48.1728, lng: 6.4518 }
          },
          {
            id: 3,
            name: "Semi-Marathon de Lyon",
            location: "Lyon",
            department: "69",
            date: "2024-06-02",
            distance: "21.1 km",
            reward: "Médaille + Produits locaux",
            description: "Parcourez les rues historiques de Lyon lors de ce semi-marathon urbain. Une course accessible à tous les niveaux.",
            type: "Route",
            image: "/images/lyon-semi.jpg",
            coordinates: { lat: 45.7640, lng: 4.8357 }
          },
          {
            id: 4,
            name: "Trail du Mont-Blanc",
            location: "Chamonix",
            department: "74",
            date: "2024-07-15",
            distance: "30 km",
            reward: "T-shirt technique + Accès spa",
            description: "L'un des plus beaux trails d'Europe au pied du Mont-Blanc. Une expérience unique pour les coureurs expérimentés.",
            type: "Trail",
            image: "/images/mont-blanc-trail.jpg",
            coordinates: { lat: 45.9237, lng: 6.8694 }
          },
          {
            id: 5,
            name: "10km de Nice",
            location: "Nice",
            department: "06",
            date: "2024-08-25",
            distance: "10 km",
            reward: "Médaille + Crème solaire",
            description: "Course rapide le long de la Promenade des Anglais. Parfait pour débuter ou battre ses records personnels.",
            type: "Route",
            image: "/images/nice-10k.jpg",
            coordinates: { lat: 43.7102, lng: 7.2620 }
          },
          {
            id: 6,
            name: "Generali Genève Marathon",
            location: "Genève",
            department: "Suisse",
            date: "2024-12-15",
            distance: "42.2 km",
            reward: "Un tee-shirt et une casquette rouge avec le logo du Generali Genève Marathon, Un repas, si votre mission se déroule sur les horaires des repas, Un bon de réduction de 50% pour un dossard individuel de votre choix pour les Balexert 20km de Genève 2026 ou le Generali Genève Marathon 2027.",
            description: "Rejoindre l'équipe de bénévole du Generali Genève Marathon s'est faire partie d'une équipe de 1'200 personnes et contribuer à faire courir plus de 25'000 personnes dans Genève et sa campagne. Nous vous proposons plus de 14 missions variées et ouvertes à tous.",
            type: "Route",
            image: "/images/geneve-marathon.jpg",
            coordinates: { lat: 46.2044, lng: 6.1432 }
          }
        ];
        this.saveCourses();
      }
    }
  }

  private saveCourses() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('runreward-courses', JSON.stringify(this.courses));
    }
  }

  getAllCourses(): Course[] {
    return [...this.courses];
  }

  getCourseById(id: number): Course | undefined {
    return this.courses.find(course => course.id === id);
  }

  addCourse(courseData: Omit<Course, 'id'>): Course {
    const newId = Math.max(...this.courses.map(c => c.id), 0) + 1;
    const newCourse: Course = {
      ...courseData,
      id: newId
    };
    
    this.courses.push(newCourse);
    this.saveCourses();
    return newCourse;
  }

  updateCourse(id: number, updates: Partial<Course>): Course | null {
    const courseIndex = this.courses.findIndex(course => course.id === id);
    if (courseIndex > -1) {
      this.courses[courseIndex] = { ...this.courses[courseIndex], ...updates };
      this.saveCourses();
      return this.courses[courseIndex];
    }
    return null;
  }

  deleteCourse(id: number): boolean {
    const courseIndex = this.courses.findIndex(course => course.id === id);
    if (courseIndex > -1) {
      this.courses.splice(courseIndex, 1);
      this.saveCourses();
      return true;
    }
    return false;
  }

  getCoursesByDepartment(department: string): Course[] {
    return this.courses.filter(course => course.department === department);
  }

  getCoursesByType(type: 'Route' | 'Trail'): Course[] {
    return this.courses.filter(course => course.type === type);
  }

  searchCourses(query: string): Course[] {
    const lowercaseQuery = query.toLowerCase();
    return this.courses.filter(course => 
      course.name.toLowerCase().includes(lowercaseQuery) ||
      course.location.toLowerCase().includes(lowercaseQuery) ||
      course.description.toLowerCase().includes(lowercaseQuery)
    );
  }
}

export const courseDB = new CourseDatabase();
