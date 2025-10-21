// Configuration EmailJS - MODIFIEZ CES VALEURS AVEC VOS VRAIES CLÉS
export const EMAILJS_CONFIG = {
  // Vos clés EmailJS
  SERVICE_ID: 'service_runreward', // ✅ Votre Service ID actuel
  TEMPLATE_ID: 'template_zwjjp6u', // ✅ Votre Template ID
  PUBLIC_KEY: '7xK6b3y98IjEkIMfL', // ✅ Votre Public Key
  
  // Votre adresse email (celle qui enverra les emails)
  FROM_EMAIL: 'capucine.runreward@gmail.com', // ✅ Votre email Gmail
  
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
