const express = require('express');
const { body, validationResult } = require('express-validator');
const Collection = require('../models/Collection');
const Recipe = require('../models/Recipe');
const { protect } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/collections
// @desc    Get all collections for a user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const collections = await Collection.find({ user_id: req.user.id });
    res.json(collections);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/collections/:id
// @desc    Get collection by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }
    
    // Check if the collection belongs to the user
    if (collection.user_id.toString() !== req.user.id) {
      return res.status(401).json({ error: 'Not authorized' });
    }
    
    // Populate with recipe details
    const populatedCollection = await Collection.findById(req.params.id).populate('recipes');
    
    res.json(populatedCollection);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Collection not found' });
    }
    
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/collections
// @desc    Create a collection
// @access  Private
router.post(
  '/',
  [
    protect,
    body('name', 'Name is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newCollection = new Collection({
        user_id: req.user.id,
        name: req.body.name,
        description: req.body.description || '',
        recipes: []
      });

      const collection = await newCollection.save();

      res.json(collection);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// @route   PUT /api/collections/:id
// @desc    Update a collection
// @access  Private
router.put(
  '/:id',
  [
    protect,
    body('name', 'Name is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let collection = await Collection.findById(req.params.id);
      
      if (!collection) {
        return res.status(404).json({ error: 'Collection not found' });
      }
      
      // Check if the collection belongs to the user
      if (collection.user_id.toString() !== req.user.id) {
        return res.status(401).json({ error: 'Not authorized' });
      }
      
      collection.name = req.body.name;
      collection.description = req.body.description || collection.description;
      collection.updated_at = Date.now();
      
      await collection.save();
      
      res.json(collection);
    } catch (err) {
      console.error(err.message);
      
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ error: 'Collection not found' });
      }
      
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// @route   DELETE /api/collections/:id
// @desc    Delete a collection
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }
    
    // Check if the collection belongs to the user
    if (collection.user_id.toString() !== req.user.id) {
      return res.status(401).json({ error: 'Not authorized' });
    }
    
    await collection.remove();
    
    res.json({ id: req.params.id });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Collection not found' });
    }
    
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/collections/:id/recipes
// @desc    Add recipe to collection
// @access  Private
router.post(
  '/:id/recipes',
  [
    protect,
    body('recipeId', 'Recipe ID is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const collection = await Collection.findById(req.params.id);
      
      if (!collection) {
        return res.status(404).json({ error: 'Collection not found' });
      }
      
      // Check if the collection belongs to the user
      if (collection.user_id.toString() !== req.user.id) {
        return res.status(401).json({ error: 'Not authorized' });
      }
      
      const recipeId = req.body.recipeId;
      
      // Check if recipe exists
      const recipe = await Recipe.findById(recipeId);
      if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' });
      }
      
      // Check if recipe is already in collection
      if (collection.recipes.includes(recipeId)) {
        return res.status(400).json({ error: 'Recipe already in collection' });
      }
      
      collection.recipes.push(recipeId);
      collection.updated_at = Date.now();
      
      await collection.save();
      
      res.json(collection);
    } catch (err) {
      console.error(err.message);
      
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ error: 'Collection or recipe not found' });
      }
      
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// @route   DELETE /api/collections/:id/recipes/:recipeId
// @desc    Remove recipe from collection
// @access  Private
router.delete('/:id/recipes/:recipeId', protect, async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }
    
    // Check if the collection belongs to the user
    if (collection.user_id.toString() !== req.user.id) {
      return res.status(401).json({ error: 'Not authorized' });
    }
    
    // Remove recipe from collection
    collection.recipes = collection.recipes.filter(
      recipe => recipe.toString() !== req.params.recipeId
    );
    
    collection.updated_at = Date.now();
    
    await collection.save();
    
    res.json(collection);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Collection or recipe not found' });
    }
    
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
