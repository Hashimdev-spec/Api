const express = require('express');
const { db } = require('../firebase');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const router = express.Router();

// Retrieve all coffees
router.get('/', async (req, res) => {
  const snapshot = await db.collection('coffee').get();
  const coffees = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json(coffees);
});

// Add a new coffee (Admin only)
router.post('/', authenticate, authorizeAdmin, async (req, res) => {
  const coffee = req.body;
  await db.collection('coffee').add(coffee);
  res.status(201).json({ message: 'Coffee added successfully' });
});

// Update coffee details (Admin only)
router.put('/:id', authenticate, authorizeAdmin, async (req, res) => {
  const { id } = req.params;  // Retrieve the ID from params
  const updates = req.body;    // Get the updated data from the request body

  console.log(`Updating coffee with ID: ${id}`);  // Log the ID
  console.log('Update Payload:', updates);        // Log the body

  try {
    const coffeeRef = db.collection('coffee').doc(id);  // Reference document by ID
    const coffee = await coffeeRef.get();                // Fetch the document

    if (!coffee.exists) {
      console.error(`Coffee with ID ${id} not found.`);
      return res.status(404).json({ message: 'Coffee not found' });
    }

    await coffeeRef.update(updates);  // Update the document
    res.json({ message: 'Coffee updated successfully' });

  } catch (error) {
    console.error('Error updating coffee:', error);
    res.status(500).json({ error: 'Failed to update coffee' });
  }
});

module.exports = router;
