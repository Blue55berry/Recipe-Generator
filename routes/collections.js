const express = require('express');
const { body, validationResult } = require('express-validator');
const Collection = require('../models/Collection');
const Recipe = require('../models/Recipe');
const { protect } = require('../middleware/auth');
const router = express.Router();
const axios = require('axios');

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
      
      if (collection.user_id.toString() !== req.user.id) {
        return res.status(401).json({ error: 'Not authorized' });
      }
      
      let recipeId = req.body.recipeId;
      const isMongoId = /^[0-9a-fA-F]{24}$/.test(recipeId);

      // If it's not a Mongo ID, it's an external recipe that needs to be imported.
      if (!isMongoId) {
        // Check if this external recipe has already been imported.
        let existingRecipe = await Recipe.findOne({ external_id: recipeId });

        if (!existingRecipe) {
          // If not, fetch from TheMealDB.
          const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`);

          if (!response.data.meals || response.data.meals.length === 0) {
            return res.status(404).json({ error: 'External recipe not found' });
          }

          const meal = response.data.meals[0];
          const ingredients = [];
          for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];
            if (ingredient && ingredient.trim() !== '') {
              ingredients.push({
                name: ingredient.trim(),
                amount: 1, // Placeholder amount
                unit: measure ? measure.trim() : ''
              });
            }
          }

          // Create a new local recipe document.
          const newRecipe = new Recipe({
            title: meal.strMeal,
            description: meal.strInstructions,
            ingredients: ingredients,
            instructions: meal.strInstructions.split(/\r\n|\n/).filter(step => step.trim() !== ''),
            prep_time: 20, // Estimated
            cook_time: 30, // Estimated
            servings: 4,   // Estimated
            image_url: meal.strMealThumb,
            tags: meal.strTags ? meal.strTags.split(',') : [],
            difficulty: 'medium', // Estimated
            nutrition_info: {},
            external_id: meal.idMeal,
            external_source: 'themealdb',
            user_id: req.user.id, // Associate with the user who imported it
          });

          existingRecipe = await newRecipe.save();
        }
        
        // Use the local ID of the (possibly newly imported) recipe.
        recipeId = existingRecipe._id;
      }
      
      // Check if recipe is already in the collection.
      if (collection.recipes.find(r => r.toString() === recipeId.toString())) {
        return res.status(400).json({ error: 'Recipe already in collection' });
      }
      
      collection.recipes.push(recipeId);
      collection.updated_at = Date.now();
      
      await collection.save();
      
      const populatedCollection = await Collection.findById(collection._id).populate('recipes');

      res.json(populatedCollection);
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
