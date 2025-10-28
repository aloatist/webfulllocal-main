export enum PaymentGateway {
  VNPAY = 'VNPAY',
  MOMO = 'MOMO',
  ZALOPAY = 'ZALOPAY',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CASH = 'CASH',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export interface PaymentRequest {
  bookingId: string
  amount: number
  currency: string
  gateway: PaymentGateway
  returnUrl: string
  cancelUrl?: string
  description?: string
  customerInfo?: {
    name: string
    email: string
    phone: string
  }
}

export interface PaymentResponse {
  success: boolean
  paymentUrl?: string
  transactionId?: string
  message?: string
  error?: string
}

export interface PaymentCallback {
  gateway: PaymentGateway
  transactionId: string
  bookingId: string
  amount: number
  status: PaymentStatus
  responseCode: string
  message?: string
  rawData: Record<string, any>
}

export interface PaymentConfig {
  vnpay?: {
    tmnCode: string
    hashSecret: string
    url: string
    returnUrl: string
  }
  momo?: {
    partnerCode: string
    accessKey: string
    secretKey: string
    endpoint: string
    returnUrl: string
    notifyUrl: string
  }
  zalopay?: {
    appId: string
    key1: string
    key2: string
    endpoint: string
    callbackUrl: string
  }
}
