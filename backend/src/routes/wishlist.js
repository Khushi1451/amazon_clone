const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authenticateToken = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.use(authenticateToken); // Protect all wishlist routes

router.get('/', async (req, res) => {
  try {
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId: req.user.id },
      include: {
        items: {
          include: { product: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    res.json(wishlist || { items: [] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

router.post('/', async (req, res) => {
  const { productId } = req.body;
  
  try {
    let wishlist = await prisma.wishlist.findUnique({ where: { userId: req.user.id } });
    if (!wishlist) {
      wishlist = await prisma.wishlist.create({ data: { userId: req.user.id } });
    }

    // Prevent duplicates
    const existing = await prisma.wishlistItem.findUnique({
      where: { wishlistId_productId: { wishlistId: wishlist.id, productId } }
    });

    if (existing) {
       return res.json(existing);
    }

    const item = await prisma.wishlistItem.create({
      data: {
        wishlistId: wishlist.id,
        productId
      }
    });

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add to wishlist' });
  }
});

router.delete('/:itemId', async (req, res) => {
  try {
    await prisma.wishlistItem.delete({
      where: { id: req.params.itemId }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
});

module.exports = router;
