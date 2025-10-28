import { ReviewEntity } from './review.entity';

export const presentReview = (review: ReviewEntity) => ({
  id: review.id,
  target: {
    type: review.targetType,
    id: review.targetId,
    name: review.targetName,
  },
  author: {
    name: review.authorName,
    email: review.authorEmail ?? null,
    country: review.authorCountry ?? null,
  },
  rating: review.rating,
  title: review.title ?? null,
  body: review.body ?? null,
  visitDate: review.visitDate ?? null,
  status: review.status,
  moderation: {
    moderatedBy: review.moderatedBy ?? null,
    moderatedAt: review.moderatedAt ?? null,
    moderationNotes: review.moderationNotes ?? null,
  },
  tags: review.tags ?? [],
  metadata: review.metadata ?? null,
  createdAt: review.createdAt,
  updatedAt: review.updatedAt,
});
