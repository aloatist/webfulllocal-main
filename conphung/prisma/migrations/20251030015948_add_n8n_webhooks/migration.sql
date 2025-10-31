-- CreateTable
CREATE TABLE "N8nWebhook" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "method" TEXT NOT NULL DEFAULT 'POST',
    "headers" JSONB,
    "authentication" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "timeout" INTEGER NOT NULL DEFAULT 10000,
    "retryAttempts" INTEGER NOT NULL DEFAULT 3,
    "retryDelay" INTEGER NOT NULL DEFAULT 5000,
    "transformPayload" BOOLEAN NOT NULL DEFAULT false,
    "payloadTemplate" TEXT,
    "conditions" JSONB,
    "triggerCount" INTEGER NOT NULL DEFAULT 0,
    "successCount" INTEGER NOT NULL DEFAULT 0,
    "errorCount" INTEGER NOT NULL DEFAULT 0,
    "lastTriggered" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "N8nWebhook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "N8nWebhookLog" (
    "id" TEXT NOT NULL,
    "webhookId" TEXT NOT NULL,
    "webhookName" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "statusCode" INTEGER,
    "requestPayload" JSONB NOT NULL,
    "responseData" JSONB,
    "errorMessage" TEXT,
    "duration" INTEGER NOT NULL,
    "retryAttempt" INTEGER NOT NULL DEFAULT 0,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "N8nWebhookLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "N8nWebhook_eventType_idx" ON "N8nWebhook"("eventType");

-- CreateIndex
CREATE INDEX "N8nWebhook_isActive_idx" ON "N8nWebhook"("isActive");

-- CreateIndex
CREATE INDEX "N8nWebhookLog_webhookId_idx" ON "N8nWebhookLog"("webhookId");

-- CreateIndex
CREATE INDEX "N8nWebhookLog_status_idx" ON "N8nWebhookLog"("status");

-- CreateIndex
CREATE INDEX "N8nWebhookLog_timestamp_idx" ON "N8nWebhookLog"("timestamp");

-- AddForeignKey
ALTER TABLE "N8nWebhookLog" ADD CONSTRAINT "N8nWebhookLog_webhookId_fkey" FOREIGN KEY ("webhookId") REFERENCES "N8nWebhook"("id") ON DELETE CASCADE ON UPDATE CASCADE;
