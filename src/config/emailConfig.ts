// Configuration EmailJS - MODIFIEZ CES VALEURS AVEC VOS VRAIES CLÉS
export const EMAILJS_CONFIG = {
  // Remplacez par vos vraies clés EmailJS
  SERVICE_ID: 'service_abc123', // Votre Service ID depuis EmailJS
  TEMPLATE_ID: 'template_xyz789', // Votre Template ID depuis EmailJS
  PUBLIC_KEY: 'user_def456', // Votre Public Key depuis EmailJS
  
  // Votre adresse email (celle qui enverra les emails)
  FROM_EMAIL: 'votre.email@gmail.com',
  
  // Nom d'affichage pour l'expéditeur
  FROM_NAME: 'RunReward Team'
};

// Instructions pour obtenir vos clés :
/*
1. Aller sur https://www.emailjs.com/
2. Créer un compte gratuit
3. Dans "Email Services" :
   - Ajouter votre service email (Gmail, Outlook, etc.)
   - Noter le Service ID
4. Dans "Email Templates" :
   - Créer un nouveau template
   - Utiliser les variables : {{to_name}}, {{course_name}}, {{course_date}}, {{course_location}}, {{organizer_message}}
   - Noter le Template ID
5. Dans "Account" :
   - Copier la Public Key
6. Remplacer les valeurs ci-dessus par vos vraies clés
*/
