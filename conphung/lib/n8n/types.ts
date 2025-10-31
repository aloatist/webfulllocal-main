import { z } from 'zod';

// Webhook Event Types
export type WebhookEventType = 
  | 'homestay_booking'
  | 'tour_booking'
  | 'contact_form'
  | 'newsletter_signup'
  | 'payment_success'
  | 'payment_failed'
  | 'user_registration'
  | 'review_submitted'
  | 'inquiry'
  | 'custom';

// HTTP Methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Webhook Status
export type WebhookStatus = 'active' | 'inactive' | 'error' | 'testing';

// Webhook Schema
export const webhookSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  eventType: z.enum([
    'homestay_booking',
    'tour_booking',
    'contact_form',
    'newsletter_signup',
    'payment_success',
    'payment_failed',
    'user_registration',
    'review_submitted',
    'inquiry',
    'custom',
  ]),
  url: z.string().url('Must be a valid URL'),
  method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']).default('POST'),
  headers: z.record(z.string()).optional(),
  authentication: z.object({
    type: z.enum(['none', 'basic', 'bearer', 'api_key']).default('none'),
    username: z.string().optional(),
    password: z.string().optional(),
    token: z.string().optional(),
    apiKey: z.string().optional(),
    apiKeyHeader: z.string().optional(),
  }).optional(),
  isActive: z.boolean().default(true),
  description: z.string().optional(),
  timeout: z.number().min(1000).max(30000).default(10000), // milliseconds
  retryAttempts: z.number().min(0).max(5).default(3),
  retryDelay: z.number().min(1000).max(60000).default(5000), // milliseconds
  transformPayload: z.boolean().default(false),
  payloadTemplate: z.string().optional(), // JSON template
  conditions: z.object({
    enabled: z.boolean().default(false),
    rules: z.array(z.object({
      field: z.string(),
      operator: z.enum(['equals', 'not_equals', 'contains', 'greater_than', 'less_than']),
      value: z.any(),
    })).optional(),
  }).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  lastTriggered: z.string().optional(),
  triggerCount: z.number().default(0),
  successCount: z.number().default(0),
  errorCount: z.number().default(0),
});

export type Webhook = z.infer<typeof webhookSchema>;

// Webhook Log Schema
export const webhookLogSchema = z.object({
  id: z.string(),
  webhookId: z.string(),
  webhookName: z.string(),
  eventType: z.string(),
  status: z.enum(['success', 'error', 'timeout', 'retry']),
  statusCode: z.number().optional(),
  requestPayload: z.any(),
  responseData: z.any().optional(),
  errorMessage: z.string().optional(),
  duration: z.number(), // milliseconds
  timestamp: z.string(),
  retryAttempt: z.number().default(0),
});

export type WebhookLog = z.infer<typeof webhookLogSchema>;

// Test Webhook Request
export const testWebhookSchema = z.object({
  webhookId: z.string(),
  payload: z.any().optional(),
});

export type TestWebhookRequest = z.infer<typeof testWebhookSchema>;

// Event Type Labels
export const eventTypeLabels: Record<WebhookEventType, string> = {
  homestay_booking: '🏠 Đặt phòng Homestay',
  tour_booking: '🎫 Đặt tour',
  contact_form: '📧 Form liên hệ',
  newsletter_signup: '✉️ Đăng ký newsletter',
  payment_success: '💰 Thanh toán thành công',
  payment_failed: '❌ Thanh toán thất bại',
  user_registration: '👤 Đăng ký tài khoản',
  review_submitted: '⭐ Gửi đánh giá',
  inquiry: '❓ Câu hỏi/Yêu cầu',
  custom: '⚙️ Custom webhook',
};

// Default Webhooks Configuration
export const defaultWebhooks: Webhook[] = [
  {
    name: 'Homestay Booking Notification',
    eventType: 'homestay_booking',
    url: '',
    method: 'POST',
    description: 'Gửi thông báo khi có đặt phòng homestay mới',
    isActive: false,
    timeout: 10000,
    retryAttempts: 3,
    retryDelay: 5000,
    transformPayload: false,
    triggerCount: 0,
    successCount: 0,
    errorCount: 0,
  },
  {
    name: 'Tour Booking Notification',
    eventType: 'tour_booking',
    url: '',
    method: 'POST',
    description: 'Gửi thông báo khi có đặt tour mới',
    isActive: false,
    timeout: 10000,
    retryAttempts: 3,
    retryDelay: 5000,
    transformPayload: false,
    triggerCount: 0,
    successCount: 0,
    errorCount: 0,
  },
  {
    name: 'Contact Form Submission',
    eventType: 'contact_form',
    url: '',
    method: 'POST',
    description: 'Xử lý form liên hệ từ website',
    isActive: false,
    timeout: 10000,
    retryAttempts: 2,
    retryDelay: 3000,
    transformPayload: false,
    triggerCount: 0,
    successCount: 0,
    errorCount: 0,
  },
  {
    name: 'Payment Success Handler',
    eventType: 'payment_success',
    url: '',
    method: 'POST',
    description: 'Xử lý khi thanh toán thành công',
    isActive: false,
    timeout: 15000,
    retryAttempts: 5,
    retryDelay: 5000,
    transformPayload: false,
    triggerCount: 0,
    successCount: 0,
    errorCount: 0,
  },
];

// Webhook Statistics
export interface WebhookStatistics {
  totalWebhooks: number;
  activeWebhooks: number;
  totalTriggers: number;
  successRate: number;
  averageResponseTime: number;
  last24Hours: {
    triggers: number;
    success: number;
    errors: number;
  };
}

// Payload Templates
export const payloadTemplates = {
  homestayBooking: `{
  "event": "homestay_booking",
  "timestamp": "{{timestamp}}",
  "booking": {
    "id": "{{booking.id}}",
    "guestName": "{{booking.guestName}}",
    "guestEmail": "{{booking.guestEmail}}",
    "guestPhone": "{{booking.guestPhone}}",
    "checkIn": "{{booking.checkIn}}",
    "checkOut": "{{booking.checkOut}}",
    "roomType": "{{booking.roomType}}",
    "totalAmount": "{{booking.totalAmount}}",
    "status": "{{booking.status}}"
  }
}`,
  tourBooking: `{
  "event": "tour_booking",
  "timestamp": "{{timestamp}}",
  "booking": {
    "id": "{{booking.id}}",
    "tourName": "{{booking.tourName}}",
    "customerName": "{{booking.customerName}}",
    "customerEmail": "{{booking.customerEmail}}",
    "date": "{{booking.date}}",
    "adults": {{booking.adults}},
    "children": {{booking.children}},
    "totalPrice": "{{booking.totalPrice}}"
  }
}`,
  contactForm: `{
  "event": "contact_form",
  "timestamp": "{{timestamp}}",
  "form": {
    "name": "{{form.name}}",
    "email": "{{form.email}}",
    "phone": "{{form.phone}}",
    "subject": "{{form.subject}}",
    "message": "{{form.message}}"
  }
}`,
  paymentSuccess: `{
  "event": "payment_success",
  "timestamp": "{{timestamp}}",
  "payment": {
    "orderId": "{{payment.orderId}}",
    "amount": "{{payment.amount}}",
    "currency": "{{payment.currency}}",
    "method": "{{payment.method}}",
    "transactionId": "{{payment.transactionId}}",
    "customerEmail": "{{payment.customerEmail}}"
  }
}`,
};

// Helper function to validate webhook URL
export function isValidWebhookUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

// Helper function to get status color
export function getStatusColor(status: WebhookStatus): string {
  const colors = {
    active: 'green',
    inactive: 'gray',
    error: 'red',
    testing: 'yellow',
  };
  return colors[status];
}
