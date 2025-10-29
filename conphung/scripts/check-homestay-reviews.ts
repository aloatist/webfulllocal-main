import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Checking HomestayReview data...\n');
  
  // Count by status
  const statusCounts = await prisma.$queryRaw`
    SELECT status, COUNT(*) as count
    FROM "HomestayReview"
    GROUP BY status
  `;
  
  console.log('Status distribution:');
  console.log(statusCounts);
  console.log('');
  
  // Get all reviews
  const allReviews = await prisma.homestayReview.findMany({
    select: {
      id: true,
      status: true,
      overallRating: true,
      content: true,
      hostResponse: true,
      createdAt: true,
      Homestay: {
        select: {
          title: true,
          slug: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  
  console.log(`Total reviews: ${allReviews.length}\n`);
  
  allReviews.forEach((review, index) => {
    console.log(`${index + 1}. ${review.Homestay.title} (${review.Homestay.slug})`);
    console.log(`   ID: ${review.id}`);
    console.log(`   Status: ${review.status}`);
    console.log(`   Rating: ${review.overallRating}`);
    console.log(`   Has content: ${review.content ? 'Yes' : 'No'}`);
    console.log(`   Has response: ${review.hostResponse ? 'Yes' : 'No'}`);
    console.log(`   Created: ${review.createdAt.toISOString()}`);
    console.log('');
  });
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
