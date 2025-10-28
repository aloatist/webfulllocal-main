-- CreateEnum
CREATE TYPE "IntegrationStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ERROR');

-- CreateEnum
CREATE TYPE "SyncDirection" AS ENUM ('INBOUND', 'OUTBOUND');

-- CreateEnum
CREATE TYPE "SyncStatus" AS ENUM ('SUCCESS', 'FAILED', 'RETRYING');

-- CreateTable
CREATE TABLE "IntegrationChannel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "status" "IntegrationStatus" NOT NULL DEFAULT 'ACTIVE',
    "endpoint" TEXT,
    "config" JSONB,
    "lastSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IntegrationChannel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChannelSyncLog" (
    "id" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "direction" "SyncDirection" NOT NULL DEFAULT 'OUTBOUND',
    "operation" TEXT NOT NULL,
    "status" "SyncStatus" NOT NULL DEFAULT 'SUCCESS',
    "message" TEXT,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChannelSyncLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IntegrationChannel_provider_name_key" ON "IntegrationChannel"("provider", "name");

-- CreateIndex
CREATE INDEX "ChannelSyncLog_channelId_createdAt_idx" ON "ChannelSyncLog"("channelId", "createdAt");

-- CreateIndex
CREATE INDEX "ChannelSyncLog_status_idx" ON "ChannelSyncLog"("status");

-- AddForeignKey
ALTER TABLE "ChannelSyncLog" ADD CONSTRAINT "ChannelSyncLog_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "IntegrationChannel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
