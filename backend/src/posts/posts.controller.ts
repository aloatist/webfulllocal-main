import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../common/decorators/permissions.decorator';
import { PostsService } from './posts.service';
import { PostQueryDto } from './dto/post-query.dto';
import { presentPost } from './post.presenter';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @Permissions('post.read')
  async findAll(@Query() query: PostQueryDto) {
    const { data, total } = await this.postsService.findAll(query);
    return {
      data: data.map(presentPost),
      meta: { total },
    };
  }

  @Get(':id')
  @Permissions('post.read')
  async findOne(@Param('id') id: string) {
    const post = await this.postsService.findById(id);
    return presentPost(post);
  }

  @Post()
  @Permissions('post.write')
  async create(@Body() dto: CreatePostDto) {
    const post = await this.postsService.create(dto);
    return presentPost(post);
  }

  @Patch(':id')
  @Permissions('post.write')
  async update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    const post = await this.postsService.update(id, dto);
    return presentPost(post);
  }

  @Delete(':id')
  @Permissions('post.write')
  async remove(@Param('id') id: string) {
    await this.postsService.remove(id);
    return { success: true };
  }
}
