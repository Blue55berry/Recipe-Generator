import React, { useState } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';

const IngredientInput = ({ onIngredientsSubmit }) => {
  const [ingredientInput, setIngredientInput] = useState('');
  const [ingredients, setIngredients] = useState([]);

  const handleAddIngredient = () => {
    if (ingredientInput.trim() !== '' && !ingredients.includes(ingredientInput.trim().toLowerCase())) {
      setIngredients([...ingredients, ingredientInput.trim().toLowerCase()]);
      setIngredientInput('');
    }
  };

  const handleRemoveIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ingredients.length > 0) {
      onIngredientsSubmit(ingredients);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">What's in your kitchen?</h2>
      <p className="text-gray-600 mb-4">Enter ingredients you have, and we'll find recipes for you.</p>
      
      <div className="flex mb-4">
        <input
          type="text"
          className="input-field flex-grow"
          placeholder="Enter an ingredient (e.g., chicken, rice, tomatoes)"
          value={ingredientInput}
          onChange={(e) => setIngredientInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          type="button"
          className="ml-2 bg-secondary text-white p-2 rounded-md hover:bg-opacity-90"
          onClick={handleAddIngredient}
        >
          <FaPlus />
        </button>
      </div>

      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {ingredients.map((ingredient, index) => (
            <div 
              key={index} 
              className="bg-gray-100 px-3 py-1 rounded-full flex items-center text-sm"
            >
              <span>{ingredient}</span>
              <button 
                type="button" 
                className="ml-2 text-gray-500 hover:text-red-500"
                onClick={() => handleRemoveIngredient(index)}
              >
                <FaTimes size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="btn-primary w-full"
        onClick={handleSubmit}
        disabled={ingredients.length === 0}
      >
        Find Recipes
      </button>
    </div>
  );
};

export default IngredientInput;
