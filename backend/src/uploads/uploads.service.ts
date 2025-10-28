import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import type { File as MulterFile } from 'multer';
import { promises as fs } from 'fs';
import type { Stats } from 'fs';
import { join } from 'path';
import { lookup as lookupMimeType } from 'mime-types';
import { Repository } from 'typeorm';
import { resolveServeRoot, resolveUploadsDir } from './uploads.config';
import { UploadEntity } from './upload.entity';

export interface UploadResponse {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  url: string;
  publicUrl: string;
  localUrl: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

type VisibilityFilter = 'all' | 'public' | 'private';

@Injectable()
export class UploadsService {
  private readonly uploadsDir: string;
  private readonly serveRoot: string;
  private readonly publicBaseUrl?: string;
  private readonly localBaseUrl: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(UploadEntity)
    private readonly uploadsRepository: Repository<UploadEntity>,
  ) {
    this.uploadsDir = resolveUploadsDir(this.configService);
    this.serveRoot = resolveServeRoot(this.configService);
    this.publicBaseUrl = this.configService.get<string>('UPLOAD_PUBLIC_BASE_URL')?.trim();
    this.localBaseUrl =
      this.configService.get<string>('UPLOAD_LOCAL_BASE_URL')?.trim() ??
      'http://localhost:4000';
  }

  async handleUpload(file: MulterFile, origin?: string): Promise<UploadResponse> {
    const serveRoot = this.normalizeServeRoot(this.serveRoot);
    const relativePath = `${serveRoot}/${file.filename}`;

    const upload = this.uploadsRepository.create({
      filename: file.filename,
      originalName: file.originalname?.trim() || file.filename,
      mimeType:
        file.mimetype ||
        lookupMimeType(file.originalname || file.filename) ||
        'application/octet-stream',
      size: file.size,
      path: relativePath,
    });

    const saved = await this.uploadsRepository.save(upload);
    return this.presentUpload(saved, origin);
  }

  async listStoredFiles(
    visibility: VisibilityFilter,
    origin?: string,
  ): Promise<UploadResponse[]> {
    await this.syncFilesWithDatabase();

    const query = this.uploadsRepository.createQueryBuilder('upload');

    if (visibility === 'public') {
      query.where('upload.isPrivate = :isPrivate', { isPrivate: false });
    } else if (visibility === 'private') {
      query.where('upload.isPrivate = :isPrivate', { isPrivate: true });
    }

    query.orderBy('upload.updatedAt', 'DESC');

    const uploads = await query.getMany();

    const presented = await Promise.all(
      uploads.map(async (upload) => {
        if (!(await this.fileExists(upload.filename))) {
          return null;
        }
        return this.presentUpload(upload, origin);
      }),
    );

    return presented.filter(
      (upload): upload is UploadResponse => upload !== null,
    );
  }

  private async syncFilesWithDatabase(): Promise<void> {
    const filenames = await fs.readdir(this.uploadsDir);
    if (filenames.length === 0) {
      return;
    }

    const existing = await this.uploadsRepository.find({ select: ['filename'] });
    const existingSet = new Set(existing.map((item) => item.filename));

    const serveRoot = this.normalizeServeRoot(this.serveRoot);
    const toPersist: UploadEntity[] = [];

    for (const filename of filenames) {
      if (existingSet.has(filename)) {
        continue;
      }

      const absolutePath = this.resolveAbsolutePath(filename);
      let stats: Stats;
      try {
        stats = await fs.stat(absolutePath);
      } catch (error: unknown) {
        if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
          continue;
        }
        throw error;
      }

      if (!stats.isFile()) {
        continue;
      }

      const relativePath = `${serveRoot}/${filename}`;

      toPersist.push(
        this.uploadsRepository.create({
          filename,
          originalName: filename,
          mimeType: lookupMimeType(filename) ?? 'application/octet-stream',
          size: stats.size,
          path: relativePath,
          isPrivate: false,
        }),
      );
    }

    if (toPersist.length > 0) {
      await this.uploadsRepository.save(toPersist);
    }
  }

  async updateUpload(
    id: string,
    data: Partial<Pick<UploadEntity, 'originalName' | 'isPrivate'>>,
    origin?: string,
  ): Promise<UploadResponse> {
    const upload = await this.uploadsRepository.findOne({ where: { id } });
    if (!upload) {
      throw new NotFoundException('Upload not found');
    }

    if (data.originalName !== undefined) {
      const trimmed = data.originalName.trim();
      if (trimmed.length > 0) {
        upload.originalName = trimmed;
      }
    }

    if (data.isPrivate !== undefined) {
      upload.isPrivate = data.isPrivate;
    }

    const saved = await this.uploadsRepository.save(upload);
    return this.presentUpload(saved, origin);
  }

  async deleteUpload(id: string): Promise<void> {
    const upload = await this.uploadsRepository.findOne({ where: { id } });
    if (!upload) {
      throw new NotFoundException('Upload not found');
    }

    await this.uploadsRepository.remove(upload);
    await this.removeFileIfExists(upload.filename);
  }

  private async fileExists(filename: string): Promise<boolean> {
    try {
      const absolutePath = this.resolveAbsolutePath(filename);
      const stats = await fs.stat(absolutePath);
      return stats.isFile();
    } catch (error: unknown) {
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        return false;
      }
      throw error;
    }
  }

  private async removeFileIfExists(filename: string): Promise<void> {
    try {
      await fs.unlink(this.resolveAbsolutePath(filename));
    } catch (error: unknown) {
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        return;
      }
      throw error;
    }
  }

  private resolveAbsolutePath(filename: string): string {
    return join(this.uploadsDir, filename);
  }

  private presentUpload(upload: UploadEntity, origin?: string): UploadResponse {
    const relativePath = upload.path.startsWith('/')
      ? upload.path
      : `/${upload.path}`;

    const originUrl = origin ? `${origin}${relativePath}` : undefined;
    const publicUrl =
      this.buildUrl(this.publicBaseUrl, relativePath) ?? originUrl ?? relativePath;
    const localUrl =
      this.buildUrl(this.localBaseUrl, relativePath) ?? relativePath;

    return {
      id: upload.id,
      filename: upload.filename,
      originalName: upload.originalName,
      mimeType: upload.mimeType,
      size: Number(upload.size),
      path: relativePath,
      url: originUrl ?? publicUrl,
      publicUrl,
      localUrl,
      isPrivate: upload.isPrivate,
      createdAt: upload.createdAt.toISOString(),
      updatedAt: upload.updatedAt.toISOString(),
    };
  }

  private buildUrl(base: string | null | undefined, path: string): string | undefined {
    if (!base) {
      return undefined;
    }
    const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${normalizedBase}${normalizedPath}`;
  }

  private normalizeServeRoot(root: string): string {
    return root.endsWith('/') ? root.slice(0, -1) : root;
  }
}
