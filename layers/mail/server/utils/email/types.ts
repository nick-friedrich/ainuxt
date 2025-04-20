// server/utils/email/types.ts
// AI Generation Reference: See /ai/README.md for guidelines and patterns.

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string; // Optional plain text version
}

export interface EmailAdapter {
  send(options: SendEmailOptions): Promise<{ success: boolean; messageId?: string; error?: unknown }>;
} 