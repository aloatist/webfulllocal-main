import { Module, UnsupportedMediaTypeException } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';
import { resolveUploadsDir } from './uploads.config';
import { UploadEntity } from './upload.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([UploadEntity]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const uploadDir = resolveUploadsDir(config);
        await fs.mkdir(uploadDir, { recursive: true });

        const maxSizeConfig = config.get<string>('UPLOAD_MAX_SIZE');
        const maxSize = maxSizeConfig
          ? Number.parseInt(maxSizeConfig, 10)
          : 5 * 1024 * 1024;

        const fileSizeLimit = Number.isFinite(maxSize) && maxSize > 0 ? maxSize : 5 * 1024 * 1024;

        return {
          storage: diskStorage({
            destination: uploadDir,
            filename: (_req, file, callback) => {
              const suffix = `${Date.now()}-${randomUUID()}`;
              const extension = extname(file.originalname ?? '').toLowerCase();
              callback(null, `${suffix}${extension}`);
            },
          }),
          limits: {
            fileSize: fileSizeLimit,
          },
          fileFilter: (_req, file, callback) => {
            if (!file.mimetype?.startsWith('image/')) {
              return callback(
                new UnsupportedMediaTypeException('Only image uploads are allowed'),
                false,
              );
            }
            callback(null, true);
          },
        };
      },
    }),
  ],
  controllers: [UploadsController],
  providers: [UploadsService],
  exports: [UploadsService],
})
export class UploadsModule {}
