const express = require('express');
const cors = require('cors');
const prisma = require('./lib/db');
const authRoutes = require('./routes/auth');
const wishlistRoutes = require('./routes/wishlist');
const authenticateToken = require('./middleware/auth');
const app = express();
const PORT = process.env.PORT || 5000;



app.use(cors());
app.use(express.json());

// Public Routes
app.use('/api/auth', authRoutes);

// Products Routes
app.get('/api/products', async (req, res) => {
  const { search, category } = req.query;
  const whereCls = {};

  if (category && category !== 'All') {
    whereCls.category = category;
  }
  
  if (search) {
    whereCls.name = {
      contains: search,
      mode: 'insensitive' // case insensitive search in postgres
    };
  }

  try {
    const products = await prisma.product.findMany({
      where: whereCls,
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id }
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching product' });
  }
});

// Protected routes middleware applied to all routes below this line
app.use('/api/wishlist', wishlistRoutes);
app.use(authenticateToken); 

// Cart Routes
app.get('/api/cart', async (req, res) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: {
        items: {
          include: {
            product: true
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get cart' });
  }
});

app.post('/api/cart', async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  try {
    let cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
    if (!cart) {
        cart = await prisma.cart.create({ data: { userId: req.user.id } });
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: productId
        }
      }
    });

    let cartItem;
    if (existingItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: productId,
          quantity: quantity
        }
      });
    }
    res.json(cartItem);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

app.put('/api/cart/:itemId', async (req, res) => {
  const { quantity } = req.body;
  const { itemId } = req.params;
  try {
    const updated = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity }
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update item' });
  }
});

app.delete('/api/cart/:itemId', async (req, res) => {
  try {
    await prisma.cartItem.delete({
      where: { id: req.params.itemId }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// Order Routes
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        items: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get orders' });
  }
});

app.post('/api/orders', async (req, res) => {
  const { shippingAddress, totalAmount } = req.body;
  
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } } }
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const actualTotal = cart.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        totalAmount: actualTotal,
        shippingAddress: shippingAddress,
        items: {
          create: cart.items.map(item => ({
             productId: item.productId,
             quantity: item.quantity,
             price: item.product.price
          }))
        }
      }
    });

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.get('/api/orders/:id', async (req, res) => {
   try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
         items: {
           include: { product: true }
         }
      }
    });
    // Check ownership
    if (!order || order.userId !== req.user.id) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
   } catch(err) {
    res.status(500).json({ error: 'Failed to get order' });
   }
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});