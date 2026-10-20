// lib/sanitize.ts
/**
 * Production HTML Sanitization Utility for Headless WordPress Content
 * Protects against XSS vectors, malicious script tags, onerror/onload attributes,
 * and malicious URI schemes (javascript:, data:text/html) while preserving
 * semantic WordPress layout markup and styling.
 */

const DANGEROUS_TAGS_REGEX = /<(script|iframe|object|embed|style|meta|link|base|applet)[\s\S]*?>[\s\S]*?<\/\1>|<(script|iframe|object|embed|style|meta|link|base|applet)[\s\S]*?>/gi;
const INLINE_EVENT_HANDLERS_REGEX = /\s+on[a-z]+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi;
const JAVASCRIPT_PROTOCOL_REGEX = /(href|src)\s*=\s*['"]\s*javascript:[^'"]*['"]/gi;
const DATA_HTML_PROTOCOL_REGEX = /(href|src)\s*=\s*['"]\s*data:text\/html[^'"]*['"]/gi;

/**
 * Sanitizes raw HTML string from WordPress post content or excerpt.
 * Transforms external <a> tags with security attributes rel="noopener noreferrer".
 */
export function sanitizeWordPressHtml(html: string): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  let sanitized = html
    // 1. Strip outright dangerous tags
    .replace(DANGEROUS_TAGS_REGEX, '')
    // 2. Remove any inline JavaScript event handlers (onclick, onerror, onload, etc.)
    .replace(INLINE_EVENT_HANDLERS_REGEX, '')
    // 3. Strip javascript: and dangerous data: schemes
    .replace(JAVASCRIPT_PROTOCOL_REGEX, 'href="#"')
    .replace(DATA_HTML_PROTOCOL_REGEX, 'href="#"');

  // 4. Secure external hyperlinks to open securely
  sanitized = sanitized.replace(
    /<a\s+(?![^>]*\brel=)([^>]*href=["']https?:\/\/[^"']+["'][^>]*)>/gi,
    '<a $1 target="_blank" rel="noopener noreferrer">'
  );

  return sanitized;
}

/**
 * Strips all HTML tags to produce pure plain text (e.g. for meta descriptions or audio summaries).
 */
export function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}
