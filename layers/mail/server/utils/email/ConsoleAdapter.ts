// server/utils/email/ConsoleAdapter.ts
// AI Generation Reference: See /ai/README.md for guidelines and patterns.

import type { EmailAdapter, SendEmailOptions } from './types';

export class ConsoleAdapter implements EmailAdapter {
  async send(options: SendEmailOptions): Promise<{ success: boolean; messageId?: string; error?: unknown }> {
    console.log('--- SENDING EMAIL (Console Adapter) ---');
    console.log(`To: ${Array.isArray(options.to) ? options.to.join(', ') : options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log('--- HTML --- ');
    console.log(options.html);
    if (options.text) {
      console.log('--- Text --- ');
      console.log(options.text);
    }
    console.log('---------------------------------------');
    // Simulate success
    return Promise.resolve({ success: true, messageId: `console-${Date.now()}` });
  }
} 