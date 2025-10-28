import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HomestayEntity } from './homestay.entity';
import { UpdateHomestayMediaDto } from './dto/update-homestay-media.dto';

@Injectable()
export class HomestayMediaService {
  constructor(
    @InjectRepository(HomestayEntity)
    private readonly homestayRepository: Repository<HomestayEntity>,
  ) {}

  async updateMedia(
    homestayId: string,
    dto: UpdateHomestayMediaDto,
  ): Promise<HomestayEntity> {
    const homestay = await this.homestayRepository.findOne({
      where: { id: homestayId },
    });

    if (!homestay) {
      throw new NotFoundException(`Homestay ${homestayId} not found`);
    }

    if (dto.heroImageUrl !== undefined) {
      homestay.heroImageUrl = dto.heroImageUrl ?? null;
    }

    if (dto.galleryImageUrls !== undefined) {
      homestay.galleryImageUrls = dto.galleryImageUrls;
    }

    await this.homestayRepository.save(homestay);

    const reloaded = await this.homestayRepository.findOne({
      where: { id: homestayId },
      relations: [
        'destination',
        'tags',
        'rooms',
        'availability',
        'pricingRules',
        'reviews',
        'host',
      ],
    });

    if (!reloaded) {
      throw new NotFoundException(`Homestay ${homestayId} not found`);
    }

    return reloaded;
  }
}
