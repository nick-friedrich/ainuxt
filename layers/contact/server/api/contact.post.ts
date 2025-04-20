// server/api/contact.post.ts
// AI Generation Reference: See /ai/README.md for guidelines and patterns.

import { defineEventHandler, readValidatedBody, createError } from 'h3';
import { sendEmail } from '@layers/mail/mail';
import { contactFormSchema } from '../utils/contact.schema';

export default defineEventHandler(async (event) => {
  try {
    const body = await readValidatedBody(event, contactFormSchema.safeParse);

    if (!body.success) {
      // Throw a 400 Bad Request error with validation details
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid form data',
        data: body.error.flatten(), // Send Zod error details
      });
    }

    const { name, email, message } = body.data;

    // Prepare email content (customize as needed)
    const subject = `Contact Form Submission from ${name}`;
    const htmlContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `;
    const textContent = `
      New Contact Form Submission
      Name: ${name}
      Email: ${email}
      Message: ${message}
    `;

    // Send email using the service
    const result = await sendEmail({
      to: 'your-support-email@example.com', // *** IMPORTANT: Replace with your actual destination email ***
      subject,
      html: htmlContent,
      text: textContent,
    });

    if (!result.success) {
      console.error('Failed to send contact email via adapter:', result.error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Internal Server Error: Could not send message',
      });
    }

    return { status: 'success', messageId: result.messageId };

  } catch (error: any) {
    // Handle potential errors from readValidatedBody or createError thrown above
    console.error('Error in /api/contact:', error);

    // If it's not already an H3Error with a status code, wrap it
    if (!error.statusCode) {
      throw createError({
        statusCode: 500,
        statusMessage: 'An unexpected error occurred',
      });
    }
    // Re-throw H3Errors (like validation or the email sending error)
    throw error;
  }
}); 