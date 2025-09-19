import React from 'react';
import { FaAppleAlt, FaBreadSlice, FaEgg, FaOilCan } from 'react-icons/fa';

const NutritionalInfo = ({ recipe }) => {
  // For TheMealDB recipes, we may not have nutritional info
  // So we'll estimate based on ingredients
  const estimateNutrition = () => {
    // This is a very rough estimation
    const ingredients = recipe.ingredients || [];
    
    // Base values
    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;
    
    // Roughly estimate based on ingredients
    ingredients.forEach(ingredient => {
      const name = ingredient.name.toLowerCase();
      
      // Proteins
      if (name.includes('chicken') || name.includes('beef') || name.includes('fish') || 
          name.includes('pork') || name.includes('tofu') || name.includes('egg')) {
        protein += 10;
        calories += 150;
        fat += 5;
      }
      
      // Carbs
      if (name.includes('rice') || name.includes('pasta') || name.includes('bread') || 
          name.includes('flour') || name.includes('potato') || name.includes('sugar')) {
        carbs += 15;
        calories += 100;
      }
      
      // Fats
      if (name.includes('oil') || name.includes('butter') || name.includes('cream') ||
          name.includes('cheese') || name.includes('avocado')) {
        fat += 8;
        calories += 90;
      }
      
      // Vegetables (low calorie)
      if (name.includes('vegetable') || name.includes('tomato') || name.includes('lettuce') ||
          name.includes('spinach') || name.includes('broccoli') || name.includes('carrot')) {
        calories += 25;
        carbs += 5;
        protein += 1;
      }
      
      // Fruits
      if (name.includes('fruit') || name.includes('apple') || name.includes('banana') ||
          name.includes('orange') || name.includes('berry')) {
        calories += 60;
        carbs += 15;
      }
    });
    
    // Adjust for servings
    const servings = recipe.servings || 4;
    
    return {
      calories: Math.round(calories / servings),
      protein: Math.round(protein / servings),
      carbs: Math.round(carbs / servings),
      fat: Math.round(fat / servings)
    };
  };
  
  const nutrition = recipe.nutrition_info && Object.keys(recipe.nutrition_info).length > 0
    ? recipe.nutrition_info
    : estimateNutrition();

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Estimated Nutritional Information (per serving)</h3>
      
      <div className="grid grid-cols-4 gap-4 text-center">
        <div className="flex flex-col items-center">
          <div className="text-3xl text-orange-500 mb-2">
            <FaAppleAlt />
          </div>
          <div className="text-2xl font-bold">{nutrition.calories}</div>
          <div className="text-sm text-gray-500">Calories</div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="text-3xl text-red-500 mb-2">
            <FaEgg />
          </div>
          <div className="text-2xl font-bold">{nutrition.protein}g</div>
          <div className="text-sm text-gray-500">Protein</div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="text-3xl text-yellow-500 mb-2">
            <FaBreadSlice />
          </div>
          <div className="text-2xl font-bold">{nutrition.carbs}g</div>
          <div className="text-sm text-gray-500">Carbs</div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="text-3xl text-blue-500 mb-2">
            <FaOilCan />
          </div>
          <div className="text-2xl font-bold">{nutrition.fat}g</div>
          <div className="text-sm text-gray-500">Fat</div>
        </div>
      </div>
      
      <div className="text-xs text-gray-500 mt-4 text-center">
        Note: Nutritional values are estimates and may vary based on exact ingredients and portions.
      </div>
    </div>
  );
};

export default NutritionalInfo;
