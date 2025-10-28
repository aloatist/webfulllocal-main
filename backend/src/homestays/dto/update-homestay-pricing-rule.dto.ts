import { PartialType } from '@nestjs/mapped-types';
import { CreateHomestayPricingRuleDto } from './create-homestay-pricing-rule.dto';

export class UpdateHomestayPricingRuleDto extends PartialType(
  CreateHomestayPricingRuleDto,
) {}

