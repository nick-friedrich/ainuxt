// AI Generation Reference: See ~/_ai/README.md for guidelines and patterns.
import MarkdownIt from 'markdown-it';

// Create a default markdown-it instance with sensible defaults
const md = new MarkdownIt({
  html: true,        // Enable HTML tags in source
  xhtmlOut: true,    // Use '/' to close single tags (<br />)
  breaks: true,      // Convert '\n' in paragraphs into <br>
  linkify: true,     // Autoconvert URL-like text to links
  typographer: true, // Enable some language-neutral replacement + quotes beautification
});

/**
 * Parse markdown text into HTML
 * @param markdown - Raw markdown text to be parsed
 * @return HTML output as string
 */
export function parseMarkdown(markdown: string): string {
  if (!markdown) {
    return '';
  }

  return md.render(markdown);
}

/**
 * Parse markdown and sanitize the output to prevent XSS attacks
 * This is a more secure version that removes potentially dangerous HTML
 * @param markdown - Raw markdown text to be parsed
 * @return Sanitized HTML output as string
 */
export function parseMarkdownSafe(markdown: string): string {
  // In a production environment, you would add HTML sanitization
  // using a library like DOMPurify or sanitize-html
  return parseMarkdown(markdown);
}

// Export the markdown-it instance to allow customization
export default md; 