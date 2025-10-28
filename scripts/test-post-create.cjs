const { PrismaClient } = require('../conphung/node_modules/@prisma/client');

const prisma = new PrismaClient();

(async () => {
  try {
    const users = await prisma.user.findMany({ select: { id: true, email: true } });
    if (!users.length) {
      throw new Error('No users exist in the database; create an admin first.');
    }

    const firstUserId = users[0].id;

    const categories = await prisma.category.findMany({ select: { id: true } });
    const tags = await prisma.tag.findMany({ select: { id: true } });

    const slug = `test-slug-${Date.now()}`;

    const post = await prisma.post.create({
      data: {
        title: 'Test Post from script',
        slug,
        content: JSON.stringify({ blocks: [] }),
        excerpt: 'Script created post',
        authorId: firstUserId,
        categories: categories.length ? { connect: [{ id: categories[0].id }] } : undefined,
        tags: tags.length ? { connect: [{ id: tags[0].id }] } : undefined,
      },
    });

    console.log('Created post', post.id, 'slug', slug);

    await prisma.post.delete({ where: { id: post.id } });
    console.log('Deleted test post');
  } catch (error) {
    console.error('Script error', error);
  } finally {
    await prisma.$disconnect();
  }
})();
