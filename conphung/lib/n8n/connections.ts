import { z } from 'zod';

// Connection Provider Types
export type ConnectionProvider = 
  | 'n8n'
  | 'zapier'
  | 'make'
  | 'webhook'
  | 'api'
  | 'oauth'
  | 'custom';

// Connection Type
export type ConnectionType = 
  | 'webhook'
  | 'api'
  | 'oauth'
  | 'database'
  | 'file'
  | 'custom';

// Connection Schema
export const connectionSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  provider: z.enum([
    'n8n',
    'zapier',
    'make',
    'webhook',
    'api',
    'oauth',
    'custom',
  ]),
  type: z.enum([
    'webhook',
    'api',
    'oauth',
    'database',
    'file',
    'custom',
  ]),
  endpoint: z.string().url().optional(),
  credentials: z.record(z.any()).optional(),
  config: z.record(z.any()).optional(),
  description: z.string().optional(),
});

export type IntegrationConnection = z.infer<typeof connectionSchema>;

// Connection Status
export type ConnectionStatus = 'active' | 'inactive' | 'error' | 'testing';

// OAuth Flow Helpers
export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  authUrl: string;
  tokenUrl: string;
  scope: string[];
  redirectUri: string;
}

// Connection Test Result
export interface ConnectionTestResult {
  success: boolean;
  message: string;
  details?: any;
  duration?: number;
}

// Provider Configurations
export const providerConfigs: Record<string, any> = {
  n8n: {
    name: 'n8n',
    icon: '⚙️',
    description: 'n8n workflow automation platform',
    authTypes: ['api_key', 'oauth'],
  },
  zapier: {
    name: 'Zapier',
    icon: '🔗',
    description: 'Zapier automation platform',
    authTypes: ['oauth', 'api_key'],
  },
  make: {
    name: 'Make (Integromat)',
    icon: '🔧',
    description: 'Make.com automation platform',
    authTypes: ['oauth', 'api_key'],
  },
  webhook: {
    name: 'Generic Webhook',
    icon: '🌐',
    description: 'Generic webhook endpoint',
    authTypes: ['none', 'bearer', 'basic', 'api_key'],
  },
  api: {
    name: 'REST API',
    icon: '📡',
    description: 'REST API connection',
    authTypes: ['bearer', 'basic', 'api_key', 'oauth'],
  },
  oauth: {
    name: 'OAuth Provider',
    icon: '🔐',
    description: 'OAuth 2.0 authentication',
    authTypes: ['oauth'],
  },
};

