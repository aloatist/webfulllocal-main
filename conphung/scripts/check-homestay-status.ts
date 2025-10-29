import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Checking Homestay with slug "ueq"...\n');
  
  const homestay = await prisma.homestay.findFirst({
    where: {
      slug: 'ueq',
    },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      _count: {
        select: {
          HomestayReview: true,
        },
      },
    },
  });
  
  if (!homestay) {
    console.log('❌ Homestay not found!');
    return;
  }
  
  console.log('Homestay found:');
  console.log(`  ID: ${homestay.id}`);
  console.log(`  Title: ${homestay.title}`);
  console.log(`  Slug: ${homestay.slug}`);
  console.log(`  Status: ${homestay.status}`);
  console.log(`  Total reviews: ${homestay._count.HomestayReview}`);
  console.log('');
  
  if (homestay.status !== 'PUBLISHED') {
    console.log('⚠️  Homestay is NOT PUBLISHED - it will not show on public pages!');
    console.log('   Please update status to PUBLISHED in admin panel.');
  } else {
    console.log('✅ Homestay is PUBLISHED');
  }
  
  // Check reviews for this homestay
  const reviews = await prisma.homestayReview.findMany({
    where: {
      homestayId: homestay.id,
    },
    select: {
      id: true,
      status: true,
      overallRating: true,
      content: true,
      hostResponse: true,
    },
  });
  
  console.log(`\nReviews for this homestay: ${reviews.length}`);
  reviews.forEach((review, index) => {
    console.log(`  ${index + 1}. Status: ${review.status}, Rating: ${review.overallRating}`);
  });
  
  const approvedCount = reviews.filter(r => r.status === 'APPROVED').length;
  console.log(`\n✅ APPROVED reviews: ${approvedCount}`);
  console.log(`⏳ PENDING reviews: ${reviews.filter(r => r.status === 'PENDING').length}`);
  console.log(`❌ REJECTED reviews: ${reviews.filter(r => r.status === 'REJECTED').length}`);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
