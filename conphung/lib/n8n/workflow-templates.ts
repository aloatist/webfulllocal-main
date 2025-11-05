import { z } from 'zod';

// Workflow Template Schema
export const workflowTemplateSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  category: z.enum([
    'booking',
    'notification',
    'marketing',
    'payment',
    'review',
    'sync',
    'automation',
    'other',
  ]),
  workflowJson: z.any(), // n8n workflow JSON structure
  thumbnail: z.string().url().optional(),
  tags: z.array(z.string()).default([]),
  isPublic: z.boolean().default(false),
  version: z.string().default('1.0.0'),
});

export type WorkflowTemplate = z.infer<typeof workflowTemplateSchema>;

// Template Categories
export const templateCategories = {
  booking: '🎫 Booking Management',
  notification: '📧 Notifications',
  marketing: '📢 Marketing',
  payment: '💰 Payment Processing',
  review: '⭐ Reviews & Ratings',
  sync: '🔄 Data Sync',
  automation: '⚙️ Automation',
  other: '📦 Other',
};

// Default Workflow Templates
export const defaultTemplates: Partial<WorkflowTemplate>[] = [
  {
    name: 'Tour Booking Notification',
    category: 'booking',
    description: 'Send email and SMS notifications when a new tour booking is created',
    tags: ['booking', 'email', 'sms', 'tour'],
    isPublic: true,
  },
  {
    name: 'Homestay Booking Confirmation',
    category: 'booking',
    description: 'Confirm homestay bookings with detailed information',
    tags: ['booking', 'homestay', 'confirmation'],
    isPublic: true,
  },
  {
    name: 'Review Reminder',
    category: 'review',
    description: 'Automatically send review requests after completed bookings',
    tags: ['review', 'automation', 'email'],
    isPublic: true,
  },
  {
    name: 'Payment Success Handler',
    category: 'payment',
    description: 'Process successful payments and update booking status',
    tags: ['payment', 'booking', 'automation'],
    isPublic: true,
  },
  {
    name: 'Social Media Auto-Post',
    category: 'marketing',
    description: 'Automatically post new content to social media platforms',
    tags: ['social-media', 'marketing', 'automation'],
    isPublic: true,
  },
];

