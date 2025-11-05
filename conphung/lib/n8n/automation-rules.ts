import { z } from 'zod';

// Condition Operator Types
export type ConditionOperator = 
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'greater_than'
  | 'less_than'
  | 'greater_than_or_equal'
  | 'less_than_or_equal'
  | 'in'
  | 'not_in'
  | 'exists'
  | 'not_exists'
  | 'regex';

// Condition Schema
export const conditionSchema = z.object({
  field: z.string(),
  operator: z.enum([
    'equals',
    'not_equals',
    'contains',
    'not_contains',
    'greater_than',
    'less_than',
    'greater_than_or_equal',
    'less_than_or_equal',
    'in',
    'not_in',
    'exists',
    'not_exists',
    'regex',
  ]),
  value: z.any(),
});

export type Condition = z.infer<typeof conditionSchema>;

// Action Types
export type ActionType = 
  | 'send_webhook'
  | 'send_email'
  | 'send_sms'
  | 'update_database'
  | 'create_notification'
  | 'log_event'
  | 'wait'
  | 'custom';

// Action Schema
export const actionSchema = z.object({
  type: z.enum([
    'send_webhook',
    'send_email',
    'send_sms',
    'update_database',
    'create_notification',
    'log_event',
    'wait',
    'custom',
  ]),
  config: z.record(z.any()),
  delay: z.number().optional(), // milliseconds
  retry: z.object({
    attempts: z.number().default(3),
    delay: z.number().default(5000),
  }).optional(),
});

export type Action = z.infer<typeof actionSchema>;

// Automation Rule Schema
export const automationRuleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
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
  conditions: z.array(conditionSchema),
  actions: z.array(actionSchema),
  isActive: z.boolean().default(true),
  priority: z.number().default(0),
});

export type AutomationRule = z.infer<typeof automationRuleSchema>;

// Condition Evaluation Helper
export function evaluateCondition(data: any, condition: Condition): boolean {
  const { field, operator, value } = condition;
  
  // Get field value (support nested fields like "booking.status")
  const fieldValue = field.split('.').reduce((obj, key) => obj?.[key], data);

  switch (operator) {
    case 'equals':
      return fieldValue === value;
    case 'not_equals':
      return fieldValue !== value;
    case 'contains':
      return String(fieldValue).includes(String(value));
    case 'not_contains':
      return !String(fieldValue).includes(String(value));
    case 'greater_than':
      return Number(fieldValue) > Number(value);
    case 'less_than':
      return Number(fieldValue) < Number(value);
    case 'greater_than_or_equal':
      return Number(fieldValue) >= Number(value);
    case 'less_than_or_equal':
      return Number(fieldValue) <= Number(value);
    case 'in':
      return Array.isArray(value) && value.includes(fieldValue);
    case 'not_in':
      return Array.isArray(value) && !value.includes(fieldValue);
    case 'exists':
      return fieldValue !== undefined && fieldValue !== null;
    case 'not_exists':
      return fieldValue === undefined || fieldValue === null;
    case 'regex':
      return new RegExp(value).test(String(fieldValue));
    default:
      return false;
  }
}

// Evaluate all conditions (AND logic)
export function evaluateConditions(data: any, conditions: Condition[]): boolean {
  if (conditions.length === 0) return true;
  return conditions.every(condition => evaluateCondition(data, condition));
}

// Action Execution Helpers
export async function executeAction(action: Action, context: any): Promise<any> {
  const { type, config, delay } = action;

  // Apply delay if specified
  if (delay && delay > 0) {
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  switch (type) {
    case 'send_webhook':
      return await fetch(config.url, {
        method: config.method || 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...config.headers,
        },
        body: JSON.stringify({
          ...config.payload,
          context,
        }),
      });

    case 'send_email':
      // Implement email sending logic
      console.log('Sending email:', config);
      return { success: true };

    case 'send_sms':
      // Implement SMS sending logic
      console.log('Sending SMS:', config);
      return { success: true };

    case 'update_database':
      // Implement database update logic
      console.log('Updating database:', config);
      return { success: true };

    case 'create_notification':
      // Implement notification creation
      console.log('Creating notification:', config);
      return { success: true };

    case 'log_event':
      console.log('Logging event:', { config, context });
      return { success: true };

    case 'wait':
      await new Promise(resolve => setTimeout(resolve, config.duration || 0));
      return { success: true };

    case 'custom':
      // Custom action - could be evaluated as code or webhook
      return { success: true };

    default:
      throw new Error(`Unknown action type: ${type}`);
  }
}

