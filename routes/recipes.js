const express = require('express');
const router = express.Router();
const axios = require('axios');
const Recipe = require('../models/Recipe');
const { protect } = require('../middleware/auth');
const User = require('../models/User');


// @route   GET /api/recipes/favorites
// @desc    Get user's favorite recipes
// @access  Private
router.get('/favorites', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorite_recipes');
    
    // Disable caching for this endpoint
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    res.json(user.favorite_recipes);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

// @route   POST /api/recipes/favorites
// @desc    Add or remove a recipe from favorites
// @access  Private
router.post('/favorites', protect, async (req, res) => {
  try {
    const { recipeId } = req.body;
    const user = await User.findById(req.user.id);

    const index = user.favorite_recipes.indexOf(recipeId);

    if (index === -1) {
      // Add to favorites
      user.favorite_recipes.push(recipeId);
    } else {
      // Remove from favorites
      user.favorite_recipes.splice(index, 1);
    }

    await user.save();
    res.json(user.favorite_recipes);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

// @route   GET /api/recipes/recommended
// @desc    Get recommended (random) recipes
// @access  Public
router.get('/recommended', async (req, res) => {
  try {
    const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/random.php`);
    if (response.data.meals) {
      res.json(response.data.meals);
    } else {
      res.json([]);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

// @route   GET /api/recipes/:id
// @desc    Get recipe by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // A valid MongoDB ObjectId is a 24-character hexadecimal string.
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);

    if (isMongoId) {
      // Regular MongoDB lookup for valid ObjectIds
      const recipe = await Recipe.findById(id);

      if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found in local database' });
      }

      return res.json(recipe);
    } else {
      // Assume it's an external ID and fetch from TheMealDB API
      const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);

      if (response.data.meals && response.data.meals.length > 0) {
        const meal = response.data.meals[0];

        // Transform TheMealDB response to our recipe format
        const recipe = {
          _id: meal.idMeal,
          title: meal.strMeal || 'Untitled Recipe',
          description: meal.strInstructions || 'No description available.',
          description_ta: '', // Initialize Tamil description
          full_description: meal.strInstructions || 'No instructions available.',
          image_url: meal.strMealThumb,
          external_id: meal.idMeal,
          external_source: 'themealdb',
          category: meal.strCategory || 'Uncategorized',
          area: meal.strArea || 'Unknown',
          tags: meal.strTags ? meal.strTags.split(',') : [],
          ingredients: [],
          instructions: (meal.strInstructions || '').split(/\r\n|\n/).filter(step => step && step.trim() !== ''),
          prep_time: 15, // Estimated
          cook_time: 20, // Estimated
          servings: 4,   // Estimated
          difficulty: 'medium', // Estimated
          youtube_url: meal.strYoutube || '',
          source_url: meal.strSource || '',
        };

        // Extract ingredients and measures
        for (let i = 1; i <= 20; i++) {
          const ingredient = meal[`strIngredient${i}`];
          const measure = meal[`strMeasure${i}`];

          if (ingredient && ingredient.trim() !== '') {
            recipe.ingredients.push({
              name: ingredient.trim(),
              amount: 1, // Placeholder amount, as it's often mixed with the unit
              unit: measure ? measure.trim() : ''
            });
          }
        }

        return res.json(recipe);
      }

      return res.status(404).json({ error: 'Recipe not found on external API' });
    }
  } catch (err) {
    console.error(err.message);

    // Handle cases where an invalid format is still passed for ObjectId
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/recipes/search/name
// @desc    Search recipes by name using TheMealDB
// @access  Public
router.post('/search/name', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    
    if (!response.data.meals) {
      return res.json([]);
    }
    
    const recipes = response.data.meals.map(meal => ({
      _id: meal.idMeal,
      title: meal.strMeal,
      description: meal.strInstructions ? meal.strInstructions.substring(0, 100) + '...' : 'No description available.',
      image_url: meal.strMealThumb,
      difficulty: 'medium', // Estimated
      prep_time: 15, // Estimated
      cook_time: 25, // Estimated
      servings: 4, // Estimated
      external_id: meal.idMeal,
      external_source: 'themealdb',
      tags: meal.strCategory ? [meal.strCategory] : [],
    }));
    
    res.json(recipes);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/recipes/category/:category
// @desc    Get recipes by category from TheMealDB
// @access  Public
router.get('/category/:category', async (req, res) => {
  try {
    const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${req.params.category}`);
    
    if (!response.data.meals) {
      return res.json([]);
    }
    
    const recipes = response.data.meals.map(meal => ({
      _id: meal.idMeal,
      title: meal.strMeal,
      image_url: meal.strMealThumb,
      external_id: meal.idMeal,
      external_source: 'themealdb'
    }));
    
    res.json(recipes);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/recipes/categories
// @desc    Get all recipe categories from TheMealDB
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const response = await axios.get('https://www.themealdb.com/api/json/v1/1/categories.php');
    
    if (!response.data.categories) {
      return res.json([]);
    }
    
    const categories = response.data.categories.map(category => ({
      id: category.idCategory,
      name: category.strCategory,
      image: category.strCategoryThumb,
      description: category.strCategoryDescription
    }));
    
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/recipes/random/:count
// @desc    Get random recipes from TheMealDB
// @access  Public
router.get('/random/:count', async (req, res) => {
  try {
    const count = parseInt(req.params.count) || 1;
    const recipes = [];
    
    // TheMealDB only provides one random meal at a time
    for (let i = 0; i < count; i++) {
      const response = await axios.get('https://www.themealdb.com/api/json/v1/1/random.php');
      
      if (response.data.meals && response.data.meals.length > 0) {
        const meal = response.data.meals[0];
        
        // Check if we already have this recipe
        if (!recipes.some(r => r._id === meal.idMeal)) {
          recipes.push({
            _id: meal.idMeal,
            title: meal.strMeal,
            description: meal.strInstructions.substring(0, 100) + '...', // Corrected description length
            image_url: meal.strMealThumb,
            external_id: meal.idMeal,
            external_source: 'themealdb',
            tags: [meal.strCategory],
            prep_time: 20, // Estimated
            cook_time: 30, // Estimated
            difficulty: 'medium' // Estimated
          });
        }
      }
    }
    
    res.json(recipes);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

// @route   POST /api/recipes/search
// @desc    Search recipes by ingredients from TheMealDB
// @access  Public
router.post('/search', async (req, res) => {
  try {
    const { ingredients } = req.body;

    if (!ingredients || ingredients.length === 0) {
      return res.status(400).json({ error: 'Please provide ingredients to search for.' });
    }

    // Fetch recipes for each ingredient from TheMealDB
    const recipeLists = await Promise.all(
      ingredients.map(ingredient =>
        axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient.trim()}`)
      )
    );

    // Extract the meal data from each response
    const meals = recipeLists.map(response => response.data.meals || []);

    if (meals.some(list => list.length === 0)) {
      // If any ingredient search returned no results, the intersection will be empty.
      return res.json([]);
    }

    // Find the intersection of the recipe lists
    const intersectingRecipes = meals.reduce((acc, currentList) => {
      const currentIds = new Set(currentList.map(meal => meal.idMeal));
      return acc.filter(meal => currentIds.has(meal.idMeal));
    });

    // The result from the filter endpoint is just a list of meals with name, image, and id.
    // We need to map this to a format our RecipeCard component expects.
    const formattedRecipes = intersectingRecipes.map(meal => ({
      _id: meal.idMeal,
      title: meal.strMeal,
      image_url: meal.strMealThumb,
      description: 'Click to see full recipe details.', // Not available from this endpoint
      difficulty: 'medium', // Estimated
      prep_time: 15, // Estimated
      cook_time: 25, // Estimated
      servings: 4, // Estimated
      external_id: meal.idMeal,
      external_source: 'themealdb',
    }));

    res.json(formattedRecipes);

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error during ingredient search' });
  }
});