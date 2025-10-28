import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { PostEntity } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostQueryDto } from './dto/post-query.dto';
import { TagEntity } from '../tags/tag.entity';
import { UserEntity } from '../users/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly repository: Repository<PostEntity>,
    @InjectRepository(TagEntity)
    private readonly tagsRepository: Repository<TagEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async findAll(
    query: PostQueryDto,
  ): Promise<{ data: PostEntity[]; total: number }> {
    const { page = 1, limit = 20, search, status, tagId, authorId } = query;

    const where: Record<string, any>[] = [];

    if (search) {
      where.push({ title: ILike(`%${search}%`) });
      where.push({ slug: ILike(`%${search}%`) });
      where.push({ excerpt: ILike(`%${search}%`) });
    }

    const filters: Record<string, any> = {
      ...(status ? { status } : {}),
      ...(authorId ? { author: { id: authorId } } : {}),
    };

    const relations = {
      author: true,
      tags: true,
    } as const;

    const [data, total] = await this.repository.findAndCount({
      where: where.length
        ? where.map((condition) => ({
            ...condition,
            ...filters,
            ...(tagId ? { tags: { id: tagId } } : {}),
          }))
        : {
            ...filters,
            ...(tagId ? { tags: { id: tagId } } : {}),
          },
      relations,
      order: {
        publishedAt: 'DESC',
        createdAt: 'DESC',
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    return { data, total };
  }

  async findById(id: string): Promise<PostEntity> {
    const post = await this.repository.findOne({
      where: { id },
      relations: { author: true, tags: true },
    });
    if (!post) {
      throw new NotFoundException(`Post ${id} not found`);
    }
    return post;
  }

  async create(dto: CreatePostDto): Promise<PostEntity> {
    const slugExists = await this.repository.exist({
      where: { slug: dto.slug },
    });
    if (slugExists) {
      throw new BadRequestException('Slug already exists');
    }

    const tagIds = dto.tagIds ?? [];

    const tags = tagIds.length
      ? await this.tagsRepository.find({ where: { id: In(tagIds) } })
      : [];

    const authorId = dto.authorId;

    const author = authorId
      ? await this.usersRepository.findOne({ where: { id: authorId } })
      : null;
    if (authorId && !author) {
      throw new NotFoundException(`Author ${authorId} not found`);
    }

    const publishedAt = dto.publishedAt;
    const {
      tagIds: _tagIds,
      authorId: _authorId,
      publishedAt: _publishedAt,
      ...rest
    } = dto;

    const post = this.repository.create({
      ...rest,
      publishedAt: publishedAt ? new Date(publishedAt) : null,
      author: author ?? undefined,
      tags,
    });

    return this.repository.save(post);
  }

  async update(id: string, dto: UpdatePostDto): Promise<PostEntity> {
    const post = await this.findById(id);

    if (dto.slug && dto.slug !== post.slug) {
      const slugExists = await this.repository.exist({
        where: { slug: dto.slug },
      });
      if (slugExists) {
        throw new BadRequestException('Slug already exists');
      }
    }

    if (dto.tagIds !== undefined) {
      post.tags = dto.tagIds.length
        ? await this.tagsRepository.find({ where: { id: In(dto.tagIds) } })
        : [];
    }

    if (dto.authorId !== undefined) {
      if (dto.authorId === null) {
        post.author = null;
      } else {
        const author = await this.usersRepository.findOne({
          where: { id: dto.authorId },
        });
        if (!author) {
          throw new NotFoundException(`Author ${dto.authorId} not found`);
        }
        post.author = author;
      }
    }

    if (dto.publishedAt !== undefined) {
      post.publishedAt = dto.publishedAt ? new Date(dto.publishedAt) : null;
    }

    const {
      tagIds: __tagIds,
      authorId: __authorId,
      publishedAt: __publishedAt,
      ...rest
    } = dto;

    Object.assign(post, rest);

    return this.repository.save(post);
  }

  async remove(id: string): Promise<void> {
    const post = await this.findById(id);
    await this.repository.remove(post);
  }
}
