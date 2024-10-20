const express = require('express');
const { db } = require('../firebase');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  const cartSnapshot = await db.collection('carts').doc(req.user.uid).get();
  const cart = cartSnapshot.exists ? cartSnapshot.data() : { items: [] };
  res.json(cart);
});

router.post('/add', authenticate, async (req, res) => {
  const { coffeeId, quantity } = req.body;
  const cartRef = db.collection('carts').doc(req.user.uid);
  const cart = (await cartRef.get()).data() || { items: [] };

  cart.items.push({ coffeeId, quantity });
  await cartRef.set(cart);
  res.json({ message: 'Item added to cart' });
});

module.exports = router;
