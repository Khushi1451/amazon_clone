const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateImages() {
  await prisma.product.updateMany({
    where: { name: { contains: 'iPad' } },
    data: { images: '["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80"]' }
  });
  
  await prisma.product.updateMany({
    where: { name: { contains: 'Brita' } },
    data: { images: '["https://images.unsplash.com/photo-1523362628745-0c100150b504?w=500&q=80"]' }
  });
  
  await prisma.product.updateMany({
    where: { name: { contains: 'Catan' } },
    data: { images: '["https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=500&q=80"]' }
  });
  
  console.log('Images successfully updated in the database!');
}

updateImages()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
