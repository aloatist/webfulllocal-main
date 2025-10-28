import { ProductEntity } from './product.entity';

export const presentProduct = (product: ProductEntity) => {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku ?? null,
    type: product.type,
    status: product.status,
    summary: product.summary ?? null,
    description: product.description ?? null,
    pricing: {
      price: product.price ? Number(product.price) : null,
      compareAtPrice: product.compareAtPrice
        ? Number(product.compareAtPrice)
        : null,
      currency: product.currency,
    },
    stock: {
      quantity: product.stockQuantity,
      isFeatured: product.isFeatured,
    },
    shipping: {
      weightGrams: product.weightGrams ?? null,
      dimensions: product.dimensions ?? null,
    },
    attributes: product.attributes ?? null,
    heroImageId: product.heroImageId ?? null,
    galleryImageIds: product.galleryImageIds ?? [],
    seo: {
      title: product.seoTitle ?? null,
      description: product.seoDescription ?? null,
      keywords: product.seoKeywords ?? [],
      canonicalUrl: product.canonicalUrl ?? null,
    },
    availability: {
      from: product.availableFrom ?? null,
      to: product.availableTo ?? null,
    },
    metadata: product.metadata ?? null,
    tags:
      product.tags?.map((tag) => ({
        id: tag.id,
        label: tag.label,
        slug: tag.slug,
        type: tag.type,
      })) ?? [],
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
};
