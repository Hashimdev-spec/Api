const express = require('express');
const jwt = require('jsonwebtoken');
const { db, auth } = require('../firebase');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const userRecord = await auth.createUser({ email, password });
    await db.collection('users').doc(userRecord.uid).set({ email, role });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email } = req.body;
  const userSnapshot = await db.collection('users').where('email', '==', email).get();

  if (userSnapshot.empty) return res.status(400).json({ message: 'User not found' });

  const user = userSnapshot.docs[0].data();
  const token = jwt.sign({ uid: userSnapshot.docs[0].id, role: user.role }, process.env.JWT_SECRET);
  res.json({ token });
});

router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out' });
});

module.exports = router;
