// Service d'envoi d'emails pour les confirmations d'inscription
export interface EmailData {
  to_email: string;
  to_name: string;
  course_name: string;
  course_date: string;
  course_location: string;
  organizer_message?: string;
}

export class EmailService {
  private static instance: EmailService;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  // Initialiser le service EmailJS (simulation)
  public async initialize(): Promise<void> {
    // En production, vous utiliseriez EmailJS ou un autre service
    // Pour cette démo, nous simulons l'envoi d'email
    this.isInitialized = true;
    console.log('Service email initialisé');
  }

  // Envoyer un email de confirmation d'inscription
  public async sendConfirmationEmail(emailData: EmailData): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Simulation d'envoi d'email
      console.log('📧 Email de confirmation envoyé:', {
        to: emailData.to_email,
        subject: `Confirmation d'inscription - ${emailData.course_name}`,
        course: emailData.course_name,
        date: emailData.course_date,
        location: emailData.course_location
      });

      // En production, vous utiliseriez EmailJS comme ceci :
      /*
      const templateParams = {
        to_email: emailData.to_email,
        to_name: emailData.to_name,
        course_name: emailData.course_name,
        course_date: emailData.course_date,
        course_location: emailData.course_location,
        organizer_message: emailData.organizer_message || 'Vos coordonnées ont été transmises à l\'organisateur de la course.'
      };

      const response = await emailjs.send(
        'service_id', // Votre service ID EmailJS
        'template_id', // Votre template ID EmailJS
        templateParams,
        'public_key' // Votre clé publique EmailJS
      );

      return response.status === 200;
      */

      // Simulation réussie
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      return false;
    }
  }

  // Générer le contenu de l'email
  public generateEmailContent(emailData: EmailData): string {
    return `
Bonjour ${emailData.to_name},

Nous avons le plaisir de vous confirmer que votre inscription en tant que bénévole pour la course "${emailData.course_name}" a été validée !

📅 Date de la course : ${emailData.course_date}
📍 Lieu : ${emailData.course_location}

Vos coordonnées ont été transmises à l'organisateur de la course qui vous contactera directement pour vous donner toutes les informations pratiques nécessaires.

${emailData.organizer_message || 'L\'organisateur vous contactera sous peu pour finaliser les détails de votre participation.'}

Nous vous remercions pour votre engagement et votre contribution à cet événement sportif !

Cordialement,
L'équipe RunReward

---
RunReward - Plateforme de bénévolat pour coureurs récompensés
    `.trim();
  }

  // Envoyer un email de test
  public async sendTestEmail(): Promise<boolean> {
    const testData: EmailData = {
      to_email: 'test@example.com',
      to_name: 'Utilisateur Test',
      course_name: 'Course Test',
      course_date: '15 décembre 2024',
      course_location: 'Genève, Suisse',
      organizer_message: 'Ceci est un email de test pour vérifier le bon fonctionnement du système.'
    };

    return await this.sendConfirmationEmail(testData);
  }
}

// Instance singleton
export const emailService = EmailService.getInstance();
