import axios from 'axios';

const API_URL = 'http://localhost:5000/api/recipes/';
const MEALDB_API_URL = 'https://www.themealdb.com/api/json/v1/1/';

// Search recipes by ingredients
const searchRecipes = async (ingredients, filters, token) => {
  const config = token 
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};
  
  const response = await axios.post(
    API_URL + 'search', 
    { ingredients, filters },
    config
  );

  return response.data;
};

// Search recipes by name by calling our backend API
const searchByName = async (query) => {
  const response = await axios.post(API_URL + 'search/name', { query });
  return response.data;
};

// Helper function to extract ingredients from TheMealDB format
const extractIngredients = (meal) => {
  const ingredients = [];
  
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    
    if (ingredient && ingredient.trim() !== '') {
      // Parse measurement into amount and unit when possible
      let amount = 1;
      let unit = '';
      
      if (measure && measure.trim() !== '') {
        const measureParts = measure.trim().split(' ');
        if (measureParts.length > 0) {
          // Try to parse the first part as a number
          const parsedAmount = parseFloat(measureParts[0]);
          if (!isNaN(parsedAmount)) {
            amount = parsedAmount;
            unit = measureParts.slice(1).join(' ');
          } else {
            unit = measure;
          }
        }
      }
      
      ingredients.push({
        name: ingredient.trim(),
        amount: amount,
        unit: unit
      });
    }
  }
  
  return ingredients;
};

// Get single recipe details from TheMealDB
const getExternalRecipe = async (id) => {
  const response = await axios.get(`${MEALDB_API_URL}lookup.php?i=${id}`);
  
  if (response.data.meals && response.data.meals.length > 0) {
    const meal = response.data.meals[0];
    return {
      _id: meal.idMeal,
      title: meal.strMeal,
      description: meal.strInstructions.substring(0, 200) + '...',
      full_description: meal.strInstructions,
      image_url: meal.strMealThumb,
      external_id: meal.idMeal,
      external_source: 'themealdb',
      category: meal.strCategory,
      area: meal.strArea,
      tags: [meal.strCategory, meal.strArea],
      ingredients: extractIngredients(meal),
      instructions: meal.strInstructions.split('\r\n').filter(step => step.trim() !== ''),
      prep_time: 20, // Estimated
      cook_time: 30, // Estimated
      servings: 4, // Estimated
      difficulty: 'medium', // Estimated
      source_url: meal.strSource || '',
      youtube_url: meal.strYoutube || ''
    };
  }
  
  return null;
};

// Get single recipe (either local or from external API)
const getRecipe = async (id) => {
  // Check if this is an external recipe ID
  if (id.length > 24) {  // MongoDB IDs are 24 characters long
    return getExternalRecipe(id);
  }
  
  // Otherwise, get from our local database
  const response = await axios.get(API_URL + id);
  return response.data;
};

// Get recommended recipes
const getRecommendedRecipes = async (token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.get(API_URL + 'recommended', config);
    return response.data;
  } catch (error) {
    // Fallback to popular recipes from TheMealDB if our API fails
    const response = await axios.get(`${MEALDB_API_URL}popular.php`);
    
    if (response.data.meals) {
      return response.data.meals.slice(0, 8).map(meal => ({
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
    }
    
    return [];
  }
};

// Get random recipes from TheMealDB
const getRandomRecipes = async (count = 8) => {
  const recipes = [];
  
  // TheMealDB only provides one random meal at a time, so we need to make multiple requests
  for (let i = 0; i < count; i++) {
    try {
      const response = await axios.get(`${MEALDB_API_URL}random.php`);
      
      if (response.data.meals && response.data.meals.length > 0) {
        const meal = response.data.meals[0];
        
        // Check if we already have this recipe (avoid duplicates)
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
    } catch (error) {
      console.error('Error fetching random recipe:', error);
    }
  }
  
  return recipes;
};

// Get favorite recipes
const getFavoriteRecipes = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + 'favorites', config);
  return response.data;
};

// Save recipe to favorites
const saveToFavorites = async (recipeId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL + 'favorites', { recipeId }, config);
  return response.data;
};

// Add recipe to collection
const addToCollection = async (recipeId, collectionId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(
    `http://localhost:5000/api/collections/${collectionId}/recipes`, 
    { recipeId }, 
    config
  );
  
  return response.data;
};

// Get recipes by category
const getRecipesByCategory = async (category) => {
  const response = await axios.get(`${MEALDB_API_URL}filter.php?c=${category}`);
  
  if (response.data.meals) {
    return response.data.meals.map(meal => ({
      _id: meal.idMeal,
      title: meal.strMeal,
      image_url: meal.strMealThumb,
      external_id: meal.idMeal,
      external_source: 'themealdb'
    }));
  }
  
  return [];
};

// Get all categories from TheMealDB
const getCategories = async () => {
  const response = await axios.get(`${MEALDB_API_URL}categories.php`);
  
  if (response.data.categories) {
    return response.data.categories.map(category => ({
      id: category.idCategory,
      name: category.strCategory,
      image: category.strCategoryThumb,
      description: category.strCategoryDescription
    }));
  }
  
  return [];
};

const recipeService = {
  searchRecipes,
  searchByName,
  getRecipe,
  getRecommendedRecipes,
  getFavoriteRecipes,
  saveToFavorites,
  addToCollection,
  getRandomRecipes,
  getRecipesByCategory,
  getCategories
};

export default recipeService;
