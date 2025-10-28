import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HomepageBannerEntity } from './homepage-banner.entity';
import { CreateHomepageBannerDto } from './dto/create-homepage-banner.dto';
import { UpdateHomepageBannerDto } from './dto/update-homepage-banner.dto';

@Injectable()
export class HomepageService {
  constructor(
    @InjectRepository(HomepageBannerEntity)
    private readonly repository: Repository<HomepageBannerEntity>,
  ) {}

  findAll(): Promise<HomepageBannerEntity[]> {
    return this.repository.find({
      order: { order: 'ASC' },
    });
  }

  async findOne(id: string): Promise<HomepageBannerEntity> {
    const banner = await this.repository.findOne({ where: { id } });
    if (!banner) {
      throw new NotFoundException(`Banner ${id} not found`);
    }
    return banner;
  }

  create(dto: CreateHomepageBannerDto): Promise<HomepageBannerEntity> {
    const banner = this.repository.create(dto);
    return this.repository.save(banner);
  }

  async update(
    id: string,
    dto: UpdateHomepageBannerDto,
  ): Promise<HomepageBannerEntity> {
    const banner = await this.findOne(id);
    Object.assign(banner, dto);
    return this.repository.save(banner);
  }

  async remove(id: string): Promise<void> {
    const banner = await this.findOne(id);
    await this.repository.remove(banner);
  }
}
