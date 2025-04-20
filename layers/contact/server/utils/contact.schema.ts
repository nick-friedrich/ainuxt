// server/utils/schemas/contact.schema.ts
// AI Generation Reference: See /ai/README.md for guidelines and patterns.

import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(1, { message: 'validation.contact.name.required' }),
  email: z.string().email({ message: 'validation.contact.email.invalid' }),
  message: z
    .string()
    .min(10, { message: 'validation.contact.message.minLength' }),
});

// Define TypeScript type from the schema
export type ContactFormData = z.infer<typeof contactFormSchema>; 