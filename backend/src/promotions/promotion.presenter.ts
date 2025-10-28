import { PromotionEntity } from './promotion.entity';

const toNumber = (value?: string | null) =>
  value !== undefined && value !== null ? Number(value) : null;

export const presentPromotion = (promotion: PromotionEntity) => ({
  id: promotion.id,
  code: promotion.code,
  title: promotion.title,
  type: promotion.type,
  description: promotion.description ?? null,
  discount: {
    value: Number(promotion.discountValue),
    currency: promotion.discountCurrency,
    maxDiscount: toNumber(promotion.maxDiscount),
    minSpend: toNumber(promotion.minSpend),
  },
  validity: {
    startDate: promotion.startDate ?? null,
    endDate: promotion.endDate ?? null,
    stayDateStart: promotion.stayDateStart ?? null,
    stayDateEnd: promotion.stayDateEnd ?? null,
  },
  usage: {
    limit: promotion.usageLimit ?? null,
    perCustomerLimit: promotion.perCustomerLimit ?? null,
    usedCount: promotion.usedCount,
  },
  isActive: promotion.isActive,
  targetAudiences: promotion.targetAudiences ?? [],
  appliesTo: promotion.appliesTo ?? null,
  termsAndConditions: promotion.termsAndConditions ?? null,
  metadata: promotion.metadata ?? null,
  createdAt: promotion.createdAt,
  updatedAt: promotion.updatedAt,
});
