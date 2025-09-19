import React from 'react';
import { Link } from 'react-router-dom';
import { FaClock, FaUtensils } from 'react-icons/fa';

const RecipeCard = ({ recipe }) => {
  return (
    <div className="card hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img 
          src={recipe.image_url || '/images/default-recipe.jpg'} 
          alt={recipe.title} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-0 right-0 bg-primary text-white px-2 py-1 m-2 rounded text-xs font-bold">
          {recipe.difficulty}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2 text-dark">{recipe.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{recipe.description}</p>
        <div className="flex justify-between items-center text-gray-500 text-sm">
          <div className="flex items-center">
            <FaClock className="mr-1" />
            <span>{recipe.prep_time + recipe.cook_time} mins</span>
          </div>
          <div className="flex items-center">
            <FaUtensils className="mr-1" />
            <span>{recipe.servings} servings</span>
          </div>
        </div>
        <div className="mt-4">
          <Link 
            to={`/recipe/${recipe._id}`} 
            className="btn-primary w-full block text-center"
          >
            View Recipe
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
