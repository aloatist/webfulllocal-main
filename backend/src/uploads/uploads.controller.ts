import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import type { File as MulterFile } from 'multer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../common/decorators/permissions.decorator';
import { UploadsService } from './uploads.service';
import { ListUploadsQueryDto } from './dto/list-uploads-query.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @Permissions('content.write')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: MulterFile | undefined,
    @Req() request: Request,
  ) {
    if (!file) {
      throw new BadRequestException('No file received');
    }

    const origin = this.getRequestOrigin(request);
    const record = await this.uploadsService.handleUpload(file, origin);
    return { file: record };
  }

  @Get()
  @Permissions('content.write')
  async listFiles(
    @Req() request: Request,
    @Query() query: ListUploadsQueryDto,
  ) {
    const origin = this.getRequestOrigin(request);
    const files = await this.uploadsService.listStoredFiles(
      query.visibility ?? 'all',
      origin,
    );
    return { files };
  }

  @Patch(':id')
  @Permissions('content.write')
  async updateUpload(
    @Param('id') id: string,
    @Body() dto: UpdateUploadDto,
    @Req() request: Request,
  ) {
    const origin = this.getRequestOrigin(request);
    const file = await this.uploadsService.updateUpload(id, dto, origin);
    return { file };
  }

  @Delete(':id')
  @Permissions('content.write')
  async deleteUpload(@Param('id') id: string) {
    await this.uploadsService.deleteUpload(id);
    return { success: true };
  }

  private getRequestOrigin(request: Request): string | undefined {
    const protocol = request.protocol;
    const host = request.get('host');

    if (!protocol || !host) {
      return undefined;
    }

    return `${protocol}://${host}`;
  }
}
