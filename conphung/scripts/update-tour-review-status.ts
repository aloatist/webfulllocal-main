import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Updating existing TourReview records...');
  
  // Update approved reviews
  const approvedResult = await prisma.tourReview.updateMany({
    where: {
      isPublished: true,
      status: 'PENDING', // Only update if still PENDING
    },
    data: {
      status: 'APPROVED',
    },
  });
  
  console.log(`✓ Updated ${approvedResult.count} approved reviews`);
  
  // Check current status distribution
  const statusCounts = await prisma.$queryRaw`
    SELECT status, COUNT(*) as count
    FROM "TourReview"
    GROUP BY status
  `;
  
  console.log('\nCurrent status distribution:');
  console.log(statusCounts);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
