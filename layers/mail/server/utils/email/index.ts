// server/utils/email/index.ts
// AI Generation Reference: See /ai/README.md for guidelines and patterns.

import type { EmailAdapter, SendEmailOptions } from './types';
import { ConsoleAdapter } from './ConsoleAdapter';
import { ResendAdapter } from './ResendAdapter';
import { useRuntimeConfig } from '#imports';

let emailAdapter: EmailAdapter;

function getEmailAdapter(): EmailAdapter {
  if (!emailAdapter) {
    const config = useRuntimeConfig();
    const resendApiKey = config.resendApiKey;
    // Need a default From email for Resend
    const fromEmail = config.public.mailFromEmail || 'default@example.com'; // Get from public runtime config or use a fallback
    const fromName = config.public.mailFromName || 'Example'; // Get from public runtime config or use a fallback

    if (resendApiKey && process.env.NODE_ENV === 'production') {
      console.log('Using Resend email adapter.');
      emailAdapter = new ResendAdapter(resendApiKey as string, fromEmail, fromName);
    } else {
      console.log('Using Console email adapter (Resend API key not found or not in production).');
      emailAdapter = new ConsoleAdapter();
    }
  }
  return emailAdapter;
}

/**
 * Sends an email using the configured adapter (Resend in production if configured, otherwise Console).
 * @param options - Options for sending the email (to, subject, html, text?).
 */
export async function sendEmail(options: SendEmailOptions): Promise<{ success: boolean; messageId?: string; error?: unknown }> {
  try {
    const adapter = getEmailAdapter();
    return adapter.send(options);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
} 