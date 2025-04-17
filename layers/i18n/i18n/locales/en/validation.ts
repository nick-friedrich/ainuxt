// AI Generation Reference: See /ai/README.md for guidelines and patterns.
export const validation = {
  // General
  required: "This field is required",
  invalid_email: "Invalid email address",

  // Contact Form Specific (can be nested if preferred)
  contact: {
    name: {
      required: "Name is required",
    },
    email: {
      invalid: "Invalid email address",
    },
    message: {
      minLength: "Message must be at least {min} characters long", // Use {min} for interpolation
    },
  },
  password: {
    required: "Password is required",
    minLength: "Password must be at least {min} characters",
  },
}; 