import React from 'react';

const PrintableRecipe = ({ recipe }) => {
  // This component is only visible when printing
  return (
    <div className="hidden print:block p-8">
      <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
      
      {recipe.area && (
        <p className="text-lg mb-4">{recipe.area} Cuisine</p>
      )}
      
      <div className="flex gap-4 text-sm mb-6">
        <div>Prep time: {recipe.prep_time} min</div>
        <div>Cook time: {recipe.cook_time} min</div>
        <div>Servings: {recipe.servings}</div>
        <div>Difficulty: {recipe.difficulty}</div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-3 border-b pb-1">Ingredients</h2>
        <ul className="list-disc pl-6">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index} className="mb-1">
              {ingredient.amount} {ingredient.unit} {ingredient.name}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-3 border-b pb-1">Instructions</h2>
        <ol className="list-decimal pl-6">
          {recipe.instructions.map((instruction, index) => (
            <li key={index} className="mb-3">
              {instruction}
            </li>
          ))}
        </ol>
      </div>
      
      {recipe.tags && recipe.tags.length > 0 && (
        <div className="text-sm text-gray-600">
          <span className="font-medium">Tags: </span>
          {recipe.tags.join(', ')}
        </div>
      )}
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Recipe from Smart Recipe Generator</p>
        {recipe.source_url && (
          <p>Original source: {recipe.source_url}</p>
        )}
      </div>
    </div>
  );
};

export default PrintableRecipe;
