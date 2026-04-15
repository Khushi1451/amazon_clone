const prisma = require('./lib/db');

const products = [
  {
    name: 'Echo Dot (5th Gen) | Smart speaker with Alexa',
    description: 'Our best-sounding Echo Dot yet - Enjoy an improved audio experience compared to any previous Echo Dot with Alexa for clearer vocals, deeper bass and vibrant sound in any room.',
    price: 39.99,
    stock: 150,
    category: 'Electronics',
    images: '["https://images.unsplash.com/photo-1543512214-318c7553f230?w=500&q=80"]',
    rating: 4.7,
    reviewCount: 3450
  },
  {
    name: 'Sony WH-1000XM4 Wireless Noise Canceling Headphones',
    description: 'Industry-leading noise canceling with Dual Noise Sensor technology. Next-level music with Edge-AI, co-developed with Sony Music Studios Tokyo.',
    price: 348.00,
    stock: 50,
    category: 'Electronics',
    images: '["https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80"]',
    rating: 4.8,
    reviewCount: 1205
  },
  {
    name: 'Atomic Habits: An Easy & Proven Way to Build Good Habits',
    description: 'No matter your goals, Atomic Habits offers a proven framework for improving--every day. James Clear, one of the worlds leading experts on habit formation.',
    price: 11.98,
    stock: 300,
    category: 'Books',
    images: '["https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&q=80"]',
    rating: 4.9,
    reviewCount: 89000
  },
  {
    name: 'Keurig K-Classic Coffee Maker',
    description: 'Brews multiple K-Cup pod sizes (6, 8, 10 ounce). Use the 6 ounce brew size to achieve the strongest brew.',
    price: 109.99,
    stock: 80,
    category: 'Home & Kitchen',
    images: '["https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80"]',
    rating: 4.5,
    reviewCount: 5200
  },
  {
    name: 'Apple iPad (9th Generation)',
    description: 'Gorgeous 10.2-inch Retina display with True Tone. A13 Bionic chip with Neural Engine. 8MP Wide back camera, 12MP Ultra Wide front camera.',
    price: 279.00,
    stock: 120,
    category: 'Electronics',
    images: '["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80"]',
    rating: 4.8,
    reviewCount: 4120
  },
  {
    name: 'Brita Standard Water Filter Replacement',
    description: 'Get great tasting water with these Brita standard water filter replacements. Switch to Brita and you can save money.',
    price: 14.99,
    stock: 500,
    category: 'Home & Kitchen',
    images: '["https://images.unsplash.com/photo-1523362628745-0c100150b504?w=500&q=80"]',
    rating: 4.6,
    reviewCount: 3100
  },
  {
    name: 'Fitbit Charge 5 Advanced Fitness & Health Tracker',
    description: 'Optimize your workout routine with a Daily Readiness Score. Daily Readines requires a Fitbit Premium membership.',
    price: 129.95,
    stock: 90,
    category: 'Sports & Outdoors',
    images: '["https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=500&q=80"]',
    rating: 4.4,
    reviewCount: 1800
  },
  {
    name: 'Catan Board Game',
    description: 'The enormously popular game of trading, building and settlement in Catan! 3-4 players. 60 minutes playtime.',
    price: 43.97,
    stock: 200,
    category: 'Toys & Games',
    images: '["https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=500&q=80"]',
    rating: 4.8,
    reviewCount: 5600
  }
];

async function main() {
  console.log(`Start seeding ...`);

  // Create a default user
  const user = await prisma.user.upsert({
    where: { email: 'default@amazonclone.com' },
    update: {},
    create: {
      name: 'Default User',
      email: 'default@amazonclone.com',
      password: 'password123',
    },
  });

  // Create a default cart for the user
  const cart = await prisma.cart.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
    },
  });

  console.log(`Created default user and cart: ${user.id}`);

  // Clear existing products to prevent duplicates on multiple runs
  await prisma.product.deleteMany({});

  for (const p of products) {
    const product = await prisma.product.create({
      data: p,
    });
    console.log(`Created product with id: ${product.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
