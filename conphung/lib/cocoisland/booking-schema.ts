import { z } from 'zod';

export const bookingRequestSchema = z.object({
  roomId: z.string(),
  roomSlug: z.string(),
  checkIn: z.string().min(1, 'Vui lòng chọn ngày nhận phòng'),
  checkOut: z.string().min(1, 'Vui lòng chọn ngày trả phòng'),
  adults: z.number().min(1, 'Ít nhất 1 người lớn'),
  children: z.number().min(0).max(10),
  fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  phone: z.string().min(10, 'Số điện thoại không hợp lệ'),
  email: z.string().email('Email không hợp lệ'),
  specialRequests: z.string().optional(),
  channel: z.string().default('cocoisland.vn'),
});

export type BookingRequest = z.infer<typeof bookingRequestSchema>;
