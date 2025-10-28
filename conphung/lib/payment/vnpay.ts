/**
 * VNPay Payment Gateway Integration
 * Documentation: https://sandbox.vnpayment.vn/apis/docs/huong-dan-tich-hop/
 */

import crypto from 'crypto';
import querystring from 'querystring';

export interface VNPayConfig {
  tmnCode: string; // Terminal ID
  hashSecret: string; // Secret key
  url: string; // VNPay gateway URL
  returnUrl: string; // Return URL after payment
  apiUrl?: string; // API URL for query/refund
}

export interface VNPayPaymentParams {
  amount: number; // Amount in VND
  orderInfo: string; // Order description
  orderType: string; // Order type (e.g., 'billpayment', 'topup')
  orderId: string; // Unique order ID
  ipAddr: string; // Customer IP address
  locale?: 'vn' | 'en'; // Language
  bankCode?: string; // Bank code (optional)
  createDate?: string; // Format: yyyyMMddHHmmss
}

export interface VNPayQueryParams {
  orderId: string;
  transDate: string; // Format: yyyyMMddHHmmss
  ipAddr: string;
}

export interface VNPayRefundParams {
  orderId: string;
  amount: number;
  transDate: string;
  createBy: string;
  ipAddr: string;
}

export class VNPayService {
  private config: VNPayConfig;

  constructor(config: VNPayConfig) {
    this.config = config;
  }

  /**
   * Create payment URL
   */
  createPaymentUrl(params: VNPayPaymentParams): string {
    const createDate = params.createDate || this.formatDate(new Date());
    const locale = params.locale || 'vn';

    // Build request data
    const vnpParams: Record<string, string> = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: this.config.tmnCode,
      vnp_Locale: locale,
      vnp_CurrCode: 'VND',
      vnp_TxnRef: params.orderId,
      vnp_OrderInfo: params.orderInfo,
      vnp_OrderType: params.orderType,
      vnp_Amount: (params.amount * 100).toString(), // VNPay requires amount * 100
      vnp_ReturnUrl: this.config.returnUrl,
      vnp_IpAddr: params.ipAddr,
      vnp_CreateDate: createDate,
    };

    // Add bank code if provided
    if (params.bankCode) {
      vnpParams.vnp_BankCode = params.bankCode;
    }

    // Sort params by key
    const sortedParams = this.sortObject(vnpParams);

    // Create signature
    const signData = querystring.stringify(sortedParams);
    const hmac = crypto.createHmac('sha512', this.config.hashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    
    sortedParams.vnp_SecureHash = signed;

    // Build payment URL
    return `${this.config.url}?${querystring.stringify(sortedParams)}`;
  }

  /**
   * Verify payment callback
   */
  verifyReturnUrl(params: Record<string, string>): {
    isValid: boolean;
    message: string;
    data?: Record<string, string>;
  } {
    const secureHash = params.vnp_SecureHash;
    delete params.vnp_SecureHash;
    delete params.vnp_SecureHashType;

    // Sort params
    const sortedParams = this.sortObject(params);
    const signData = querystring.stringify(sortedParams);
    
    // Create signature
    const hmac = crypto.createHmac('sha512', this.config.hashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    // Verify signature
    if (secureHash !== signed) {
      return {
        isValid: false,
        message: 'Invalid signature',
      };
    }

    // Check response code
    const responseCode = params.vnp_ResponseCode;
    const isSuccess = responseCode === '00';

    return {
      isValid: true,
      message: isSuccess ? 'Payment successful' : this.getResponseMessage(responseCode),
      data: params,
    };
  }

  /**
   * Query transaction status
   */
  async queryTransaction(params: VNPayQueryParams): Promise<any> {
    if (!this.config.apiUrl) {
      throw new Error('API URL is not configured');
    }

    const createDate = this.formatDate(new Date());

    const vnpParams: Record<string, string> = {
      vnp_Version: '2.1.0',
      vnp_Command: 'querydr',
      vnp_TmnCode: this.config.tmnCode,
      vnp_TxnRef: params.orderId,
      vnp_OrderInfo: `Query transaction ${params.orderId}`,
      vnp_TransactionDate: params.transDate,
      vnp_CreateDate: createDate,
      vnp_IpAddr: params.ipAddr,
    };

    // Sort and sign
    const sortedParams = this.sortObject(vnpParams);
    const signData = querystring.stringify(sortedParams);
    const hmac = crypto.createHmac('sha512', this.config.hashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    
    sortedParams.vnp_SecureHash = signed;

    // Make API request
    const response = await fetch(this.config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: querystring.stringify(sortedParams),
    });

    return response.json();
  }

  /**
   * Refund transaction
   */
  async refundTransaction(params: VNPayRefundParams): Promise<any> {
    if (!this.config.apiUrl) {
      throw new Error('API URL is not configured');
    }

    const createDate = this.formatDate(new Date());
    const transactionNo = `${params.orderId}_${Date.now()}`;

    const vnpParams: Record<string, string> = {
      vnp_Version: '2.1.0',
      vnp_Command: 'refund',
      vnp_TmnCode: this.config.tmnCode,
      vnp_TransactionType: '02', // Full refund
      vnp_TxnRef: params.orderId,
      vnp_Amount: (params.amount * 100).toString(),
      vnp_OrderInfo: `Refund for ${params.orderId}`,
      vnp_TransactionNo: transactionNo,
      vnp_TransactionDate: params.transDate,
      vnp_CreateDate: createDate,
      vnp_CreateBy: params.createBy,
      vnp_IpAddr: params.ipAddr,
    };

    // Sort and sign
    const sortedParams = this.sortObject(vnpParams);
    const signData = querystring.stringify(sortedParams);
    const hmac = crypto.createHmac('sha512', this.config.hashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    
    sortedParams.vnp_SecureHash = signed;

    // Make API request
    const response = await fetch(this.config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: querystring.stringify(sortedParams),
    });

    return response.json();
  }

  /**
   * Helper: Sort object by key
   */
  private sortObject(obj: Record<string, string>): Record<string, string> {
    const sorted: Record<string, string> = {};
    const keys = Object.keys(obj).sort();
    
    keys.forEach((key) => {
      sorted[key] = obj[key];
    });
    
    return sorted;
  }

  /**
   * Helper: Format date to VNPay format (yyyyMMddHHmmss)
   */
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }

  /**
   * Helper: Get response message
   */
  private getResponseMessage(code: string): string {
    const messages: Record<string, string> = {
      '00': 'Giao dịch thành công',
      '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
      '09': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
      '10': 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
      '11': 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
      '12': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.',
      '13': 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP).',
      '24': 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
      '51': 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
      '65': 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
      '75': 'Ngân hàng thanh toán đang bảo trì.',
      '79': 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định.',
      '99': 'Các lỗi khác',
    };

    return messages[code] || 'Lỗi không xác định';
  }
}

/**
 * Initialize VNPay service with environment variables
 */
export function createVNPayService(): VNPayService {
  const config: VNPayConfig = {
    tmnCode: process.env.VNPAY_TMN_CODE || '',
    hashSecret: process.env.VNPAY_HASH_SECRET || '',
    url: process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
    returnUrl: process.env.VNPAY_RETURN_URL || 'http://localhost:3000/payment/vnpay/callback',
    apiUrl: process.env.VNPAY_API_URL || 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction',
  };

  return new VNPayService(config);
}

/**
 * Bank codes for VNPay
 */
export const VNPayBankCodes = {
  VNPAYQR: 'VNPAYQR', // QR Code
  VNBANK: 'VNBANK', // Ngân hàng nội địa
  INTCARD: 'INTCARD', // Thẻ quốc tế
  VIETCOMBANK: 'ICB',
  VIETINBANK: 'CTG',
  BIDV: 'BIDV',
  AGRIBANK: 'VBA',
  SACOMBANK: 'STB',
  TECHCOMBANK: 'TCB',
  ACB: 'ACB',
  MB: 'MB',
  VPBANK: 'VPB',
  TPBank: 'TPB',
  HDBANK: 'HDB',
  DONGABANK: 'DAB',
  EXIMBANK: 'EIB',
  NAMABANK: 'NAB',
  OCEANBANK: 'OCB',
  MSBANK: 'MSB',
  ABBANK: 'ABB',
  SEABANK: 'SEAB',
  VIETCAPITALBANK: 'VCCB',
  SHBBANK: 'SHB',
  LIENVIETPOSTBANK: 'LPB',
  KIENLONGBANK: 'KLB',
  BAOVIETBANK: 'BVB',
  PGBANK: 'PGB',
  GPBANK: 'GPB',
  VIETABANK: 'VAB',
  PVCOMBANK: 'PVCB',
  WOORIBANK: 'WOO',
  PUBLICBANK: 'PBK',
  NONGHYUP: 'NHB',
  INDOVINABANK: 'IVB',
  COOPBANK: 'COOPBANK',
  SAIGONBANK: 'SGB',
  BACABANK: 'BAB',
  VIETBANK: 'VB',
  CBBANK: 'CBB',
};
