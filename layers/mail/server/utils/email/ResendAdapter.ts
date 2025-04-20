// server/utils/email/ResendAdapter.ts
// AI Generation Reference: See /ai/README.md for guidelines and patterns.

import { Resend } from 'resend';
import type { EmailAdapter, SendEmailOptions } from './types';

export class ResendAdapter implements EmailAdapter {
  private resend: Resend;
  private fromEmail: string;
  private fromName: string;

  constructor(apiKey: string, fromEmail: string, fromName: string) {
    if (!apiKey) {
      throw new Error('Resend API key is required for ResendAdapter.');
    }
    if (!fromEmail) {
      throw new Error('Default From email is required for ResendAdapter.');
    }
    if (!fromName) {
      throw new Error('Default From name is required for ResendAdapter.');
    }
    this.resend = new Resend(apiKey);
    this.fromEmail = fromEmail;
    this.fromName = fromName;
  }

  async send(options: SendEmailOptions): Promise<{ success: boolean; messageId?: string; error?: unknown }> {
    try {
      const response = await this.resend.emails.send({
        from: `${this.fromName} <${this.fromEmail}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });

      if (response.data) {
        console.log('Resend email sent successfully:', response.data.id);
        return { success: true, messageId: response.data.id };
      } else {
        // Handle potential error structure within the response
        console.error('Resend API error (response object):', response.error);
        return { success: false, error: response.error };
      }
    } catch (error) {
      // Catch errors thrown by the send method itself
      console.error('Resend API error (exception):', error);
      return { success: false, error: error };
    }
  }
} 