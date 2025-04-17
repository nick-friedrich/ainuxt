// AI Generation Reference: See /ai/README.md for guidelines and patterns.
export const validation = {
  // General
  required: "Dieses Feld ist erforderlich",
  invalid_email: "Ungültige E-Mail-Adresse",

  // Contact Form Specific
  contact: {
    name: {
      required: "Name ist erforderlich",
    },
    email: {
      invalid: "Ungültige E-Mail-Adresse",
    },
    message: {
      minLength: "Nachricht muss mindestens {min} Zeichen lang sein", // Use {min} for interpolation
    },
  },
  password: {
    required: "Passwort ist erforderlich",
    minLength: "Passwort muss mindestens {min} Zeichen lang sein",
  },
}; 