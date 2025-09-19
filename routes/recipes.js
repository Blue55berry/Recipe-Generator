// Add this to your existing /api/recipes/:id endpoint:

// @route   GET /api/recipes/:id
// @desc    Get recipe by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    // Check if this is an external ID (not a MongoDB ObjectId)
    if (req.params.id.length > 24) {
      // Fetch from external API
      const axios = require('axios');
      const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${req.params.id}`);
      
      if (response.data.meals && response.data.meals.length > 0) {
        const meal = response.data.meals[0];
        
        // Transform to our format
        const recipe = {
          _id: meal.idMeal,
          title: meal.strMeal,
          description: meal.strInstructions.substring(0, 200) + '...',
          image_url: meal.strMealThumb,
          external_id: meal.idMeal,
          external_source: 'themealdb',
          category: meal.strCategory,
          area: meal.strArea,
          tags: [meal.strCategory, meal.strArea],
          ingredients: [],
          instructions: meal.strInstructions.split('\r\n').filter(step => step.trim() !== ''),
          prep_time: 20, // Estimated
          cook_time: 30, // Estimated
          servings: 4, // Estimated
          difficulty: 'medium' // Estimated
        };
        
        // Extract ingredients
        for (let i = 1; i <= 20; i++) {
          const ingredient = meal[`strIngredient${i}`];
          const measure = meal[`strMeasure${i}`];
          
          if (ingredient && ingredient.trim() !== '') {
            recipe.ingredients.push({
              name: ingredient.trim(),
              amount: 1,
              unit: measure ? measure.trim() : ''
            });
          }
        }
        
        return res.json(recipe);
      }
      
      return res.status(404).json({ error: 'Recipe not found' });
    }
    
    // Regular MongoDB lookup
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    
    res.json(recipe);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    
    res.status(500).json({ error: 'Server error' });
  }
});

// Add these new endpoints:

// @route   POST /api/recipes/search/name
// @desc    Search recipes by name using TheMealDB
// @access  Public
router.post('/search/name', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const axios = require('axios');
    const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    
    if (!response.data.meals) {
      return res.json([]);
    }
    
    const recipes = response.data.meals.map(meal => ({
      _id: meal.idMeal,
      title: meal.strMeal,
      description: meal.strInstructions.substring(0, 100) + '...',
      image_url: meal.strMealThumb,
      external_id: meal.idMeal,
      external_source: 'themealdb',
      tags: [meal.strCategory],
      prep_time: 20, // Estimated
      cook_time: 30, // Estimated
      difficulty: 'medium' // Estimated
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
    const axios = require('axios');
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
    const axios = require('axios');
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
    const axios = require('axios');
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
            description: meal.strInstructions.substring(0, 100) + '...',
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
