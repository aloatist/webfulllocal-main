import { ConfigService } from '@nestjs/config';
import { isAbsolute, join, normalize } from 'path';

export function resolveUploadsDir(config: ConfigService): string {
  const configured = config.get<string>('UPLOADS_DIR')?.trim();
  const target = configured && configured.length > 0 ? configured : 'uploads';
  const absolutePath = isAbsolute(target) ? target : join(process.cwd(), target);
  return normalize(absolutePath);
}

export function resolveServeRoot(config: ConfigService): string {
  const configured = config.get<string>('UPLOADS_SERVE_ROOT')?.trim();
  const root = configured && configured.length > 0 ? configured : '/uploads';
  return root.startsWith('/') ? root : `/${root}`;
}
