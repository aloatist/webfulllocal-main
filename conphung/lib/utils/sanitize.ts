/**
 * Security utilities for sanitizing user input
 * Prevents XSS (Cross-Site Scripting) attacks
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML content - removes all HTML tags and scripts
 * Use this for user-generated content like comments, reviews, etc.
 * 
 * @param input - User input that may contain HTML
 * @returns Sanitized plain text (HTML tags removed)
 */
export function sanitizeText(input: string | null | undefined): string {
  if (!input) return '';
  
  // Remove HTML tags and decode HTML entities
  const sanitized = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // Remove all HTML tags
    ALLOWED_ATTR: [], // Remove all attributes
    KEEP_CONTENT: true, // Keep text content but remove tags
  });
  
  // Trim whitespace
  return sanitized.trim();
}

/**
 * Sanitize HTML but allow some safe tags (for rich text content)
 * Use this only for trusted admin content, NOT for user-generated content
 * 
 * @param input - HTML content
 * @returns Sanitized HTML with only safe tags
 */
export function sanitizeHTML(input: string | null | undefined): string {
  if (!input) return '';
  
  // Allow only safe HTML tags (for admin content only)
  const sanitized = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
  });
  
  return sanitized.trim();
}

/**
 * Escape HTML special characters
 * Use this for displaying user input in HTML context
 * 
 * @param input - Text to escape
 * @returns Escaped HTML string
 */
export function escapeHTML(input: string | null | undefined): string {
  if (!input) return '';
  
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  
  return input.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Validate and sanitize review/comment content
 * - Strips HTML tags
 * - Limits length
 * - Trims whitespace
 * 
 * @param content - Review/comment content
 * @param maxLength - Maximum allowed length (default: 5000)
 * @returns Sanitized content
 */
export function sanitizeReviewContent(
  content: string | null | undefined,
  maxLength: number = 5000
): string {
  if (!content) return '';
  
  // First sanitize to remove HTML
  const sanitized = sanitizeText(content);
  
  // Limit length
  if (sanitized.length > maxLength) {
    return sanitized.slice(0, maxLength);
  }
  
  return sanitized;
}

/**
 * Validate and sanitize user name
 * - Strips HTML tags
 * - Limits length
 * - Allows only alphanumeric, spaces, and common characters
 * 
 * @param name - User name
 * @param maxLength - Maximum allowed length (default: 100)
 * @returns Sanitized name
 */
export function sanitizeUserName(
  name: string | null | undefined,
  maxLength: number = 100
): string {
  if (!name) return 'Người dùng';
  
  // Sanitize HTML
  const sanitized = sanitizeText(name);
  
  // Remove special characters but allow Vietnamese characters, spaces, and common punctuation
  // Allow: letters, numbers, spaces, Vietnamese characters, and common punctuation
  const cleaned = sanitized.replace(/[^a-zA-Z0-9\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđĐ.,!?\-]/g, '');
  
  // Limit length
  if (cleaned.length > maxLength) {
    return cleaned.slice(0, maxLength);
  }
  
  return cleaned.trim() || 'Người dùng';
}

