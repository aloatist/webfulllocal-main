import { z } from 'zod';

// Env Variable Categories
export type EnvCategory = 
  | 'database'
  | 'auth'
  | 'oauth'
  | 'api'
  | 'payment'
  | 'webhook'
  | 'email'
  | 'storage'
  | 'other';

// Env Variable Schema
export const envVariableSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
  category: z.enum([
    'database',
    'auth',
    'oauth',
    'api',
    'payment',
    'webhook',
    'email',
    'storage',
    'other',
  ]),
  description: z.string().optional(),
  isSecret: z.boolean().default(false),
  isPublic: z.boolean().default(false), // NEXT_PUBLIC_ prefix
  isRequired: z.boolean().default(false),
  example: z.string().optional(),
  order: z.number().default(0),
});

export type EnvVariable = z.infer<typeof envVariableSchema>;

// Env Config Schema
export const envConfigSchema = z.object({
  variables: z.array(envVariableSchema),
  lastUpdated: z.string().optional(),
  updatedBy: z.string().optional(),
});

export type EnvConfig = z.infer<typeof envConfigSchema>;

// Category Labels
export const categoryLabels: Record<EnvCategory, string> = {
  database: '🗄️ Database',
  auth: '🔐 Authentication',
  oauth: '👤 OAuth (Google, Facebook)',
  api: '🌐 API & URLs',
  payment: '💳 Payment Gateway',
  webhook: '🔗 Webhooks',
  email: '📧 Email Service',
  storage: '📦 Storage (S3, CDN)',
  other: '⚙️ Other',
};

// Predefined env variables from .env.example
export const defaultEnvVariables: EnvVariable[] = [
  // Database
  {
    key: 'DATABASE_URL',
    value: '',
    category: 'database',
    description: 'PostgreSQL database connection string',
    isSecret: true,
    isPublic: false,
    isRequired: true,
    example: 'postgresql://user:password@localhost:5432/database',
    order: 1,
  },
  
  // Auth
  {
    key: 'NEXTAUTH_URL',
    value: '',
    category: 'auth',
    description: 'Base URL của ứng dụng cho NextAuth',
    isSecret: false,
    isPublic: false,
    isRequired: true,
    example: 'http://localhost:3000',
    order: 2,
  },
  {
    key: 'NEXTAUTH_SECRET',
    value: '',
    category: 'auth',
    description: 'Secret key để mã hóa JWT tokens',
    isSecret: true,
    isPublic: false,
    isRequired: true,
    example: 'generate-with: openssl rand -base64 32',
    order: 3,
  },
  
  // Google OAuth
  {
    key: 'GOOGLE_CLIENT_ID',
    value: '',
    category: 'oauth',
    description: 'Google OAuth Client ID',
    isSecret: false,
    isPublic: false,
    isRequired: false,
    example: 'your-client-id.apps.googleusercontent.com',
    order: 4,
  },
  {
    key: 'GOOGLE_CLIENT_SECRET',
    value: '',
    category: 'oauth',
    description: 'Google OAuth Client Secret',
    isSecret: true,
    isPublic: false,
    isRequired: false,
    example: 'your-google-client-secret',
    order: 5,
  },
  
  // Facebook OAuth
  {
    key: 'FACEBOOK_CLIENT_ID',
    value: '',
    category: 'oauth',
    description: 'Facebook App ID',
    isSecret: false,
    isPublic: false,
    isRequired: false,
    example: 'your-facebook-app-id',
    order: 6,
  },
  {
    key: 'FACEBOOK_CLIENT_SECRET',
    value: '',
    category: 'oauth',
    description: 'Facebook App Secret',
    isSecret: true,
    isPublic: false,
    isRequired: false,
    example: 'your-facebook-app-secret',
    order: 7,
  },
  
  // API URLs
  {
    key: 'NEXT_PUBLIC_API_URL',
    value: '',
    category: 'api',
    description: 'Public API URL (client-side)',
    isSecret: false,
    isPublic: true,
    isRequired: true,
    example: 'http://localhost:3000',
    order: 8,
  },
  {
    key: 'NEXT_PUBLIC_SITE_URL',
    value: '',
    category: 'api',
    description: 'Public site URL (client-side)',
    isSecret: false,
    isPublic: true,
    isRequired: true,
    example: 'http://localhost:3000',
    order: 9,
  },
  
  // VNPay Payment
  {
    key: 'VNPAY_TMN_CODE',
    value: '',
    category: 'payment',
    description: 'VNPay Terminal Code',
    isSecret: true,
    isPublic: false,
    isRequired: false,
    example: 'YOUR_TMN_CODE',
    order: 10,
  },
  {
    key: 'VNPAY_HASH_SECRET',
    value: '',
    category: 'payment',
    description: 'VNPay Hash Secret Key',
    isSecret: true,
    isPublic: false,
    isRequired: false,
    example: 'YOUR_HASH_SECRET',
    order: 11,
  },
  {
    key: 'VNPAY_URL',
    value: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
    category: 'payment',
    description: 'VNPay Payment URL',
    isSecret: false,
    isPublic: false,
    isRequired: false,
    example: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
    order: 12,
  },
  {
    key: 'VNPAY_RETURN_URL',
    value: '',
    category: 'payment',
    description: 'VNPay Return URL (callback)',
    isSecret: false,
    isPublic: false,
    isRequired: false,
    example: 'http://localhost:3000/api/payment/vnpay/callback',
    order: 13,
  },
  
  // Webhook
  {
    key: 'N8N_WEBHOOK_URL',
    value: '',
    category: 'webhook',
    description: 'Base webhook URL cho n8n event hub (ví dụ: /webhook/automation)',
    isSecret: true,
    isPublic: false,
    isRequired: false,
    example: 'https://n8n.example.com/webhook/automation',
    order: 14,
  },
  {
    key: 'N8N_WEBHOOK_SECRET',
    value: '',
    category: 'webhook',
    description: 'Bearer token/secret để xác thực khi gửi nhận webhook với n8n',
    isSecret: true,
    isPublic: false,
    isRequired: false,
    example: 'super-secret-token',
    order: 15,
  },
  {
    key: 'N8N_TOUR_BOOKING_WEBHOOK_URL',
    value: '',
    category: 'webhook',
    description: 'n8n webhook URL cho tour booking notifications',
    isSecret: true,
    isPublic: false,
    isRequired: false,
    example: 'https://n8n.example.com/webhook/tour-booking',
    order: 16,
  },
  {
    key: 'N8N_HOMESTAY_BOOKING_WEBHOOK_URL',
    value: '',
    category: 'webhook',
    description: 'n8n webhook URL cho homestay booking',
    isSecret: true,
    isPublic: false,
    isRequired: false,
    example: 'https://n8n.example.com/webhook/homestay-booking',
    order: 17,
  },
  {
    key: 'N8N_SOCIAL_PUBLISH_WEBHOOK_URL',
    value: '',
    category: 'webhook',
    description: 'n8n webhook URL cho social media scheduler/publisher',
    isSecret: true,
    isPublic: false,
    isRequired: false,
    example: 'https://n8n.example.com/webhook/social-publish',
    order: 18,
  },
  {
    key: 'N8N_STATUS_API_URL',
    value: '',
    category: 'webhook',
    description: 'Endpoint n8n REST API (dùng kiểm tra health, executions)',
    isSecret: true,
    isPublic: false,
    isRequired: false,
    example: 'https://n8n.example.com/rest',
    order: 19,
  },
];

// Validation rules
export const envValidationRules = {
  url: (value: string) => {
    try {
      new URL(value);
      return true;
    } catch {
      return 'Invalid URL format';
    }
  },
  
  required: (value: string) => {
    return value.trim() !== '' || 'This field is required';
  },
  
  database: (value: string) => {
    return value.startsWith('postgresql://') || 
           value.startsWith('mysql://') || 
           'Database URL must start with postgresql:// or mysql://';
  },
  
  minLength: (min: number) => (value: string) => {
    return value.length >= min || `Minimum length is ${min} characters`;
  },
};
