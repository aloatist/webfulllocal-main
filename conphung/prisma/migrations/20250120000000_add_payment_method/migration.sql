-- CreateTable
CREATE TABLE "PaymentMethod" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "bankName" TEXT,
    "accountNumber" TEXT,
    "accountHolder" TEXT,
    "branch" TEXT,
    "qrCode" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "instructions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PaymentMethod_type_isActive_idx" ON "PaymentMethod"("type", "isActive");

-- Insert default payment method
INSERT INTO "PaymentMethod" (
    "id",
    "name",
    "type",
    "bankName",
    "accountNumber",
    "accountHolder",
    "branch",
    "isActive",
    "displayOrder",
    "description",
    "instructions",
    "createdAt",
    "updatedAt"
) VALUES (
    'pm_bidv_' || floor(random() * 1000000000)::text,
    'Chuyển khoản BIDV',
    'bank_transfer',
    'BIDV',
    '7210783403',
    'CÔNG TY TNHH DU LỊCH DỊCH VỤ THƯƠNG MẠI CỒN PHỤNG',
    'BIDV chi nhánh Bến Tre',
    true,
    0,
    'Thanh toán qua chuyển khoản ngân hàng BIDV',
    'Vui lòng chuyển khoản đúng số tiền và ghi rõ mã đơn hàng (Booking ID) trong nội dung chuyển khoản. Sau khi chuyển khoản, vui lòng liên hệ hotline 0918.267.715 hoặc gửi ảnh chụp biên lai chuyển khoản đến email conphungtourist87@gmail.com để được xác nhận nhanh chóng.',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

