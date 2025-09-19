import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getRecipesByCategory } from '../features/recipes/recipeSlice';
import RecipeCard from '../components/RecipeCard';
import Loader from '../components/Loader';

const CategoryRecipesPage = () => {
  const { category } = useParams();
  const dispatch = useDispatch();
  const { recipes, isLoading, isError, message } = useSelector(
    (state) => state.recipes
  );

  useEffect(() => {
    dispatch(getRecipesByCategory(category));
  }, [dispatch, category]);

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <p>{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-center mb-2">{category} Recipes</h1>
      <p className="text-center text-gray-600 mb-10">Discover delicious {category.toLowerCase()} recipes from TheMealDB</p>
      
      {recipes.length > 0 ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p>No recipes found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default CategoryRecipesPage;
