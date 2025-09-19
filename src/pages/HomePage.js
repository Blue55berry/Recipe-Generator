import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaUtensils, FaBookmark, FaUserCircle } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { getRandomRecipes } from '../features/recipes/recipeSlice';
import RecipeCard from '../components/RecipeCard';
import Loader from '../components/Loader';

const HomePage = () => {
  const { user } = useSelector((state) => state.auth);
  const { randomRecipes, isLoading } = useSelector((state) => state.recipes);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getRandomRecipes(4));
  }, [dispatch]);

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Turn Your Ingredients Into Delicious Meals
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Just tell us what ingredients you have, and we'll show you what you can make.
            No more wasted food or complicated shopping lists.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/search" className="btn-primary bg-white text-primary text-lg px-8 py-3">
              Find Recipes Now
            </Link>
            {!user && (
              <Link to="/register" className="btn-secondary text-lg px-8 py-3">
                Create Account
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-primary text-5xl mb-4 flex justify-center">
                <FaSearch />
              </div>
              <h3 className="text-xl font-semibold mb-2">Enter Ingredients</h3>
              <p className="text-gray-600">
                Tell us what you have in your kitchen, and we'll find recipes that match.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-primary text-5xl mb-4 flex justify-center">
                <FaUtensils />
              </div>
              <h3 className="text-xl font-semibold mb-2">Discover Recipes</h3>
              <p className="text-gray-600">
                Browse through personalized recipe suggestions based on your ingredients.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-primary text-5xl mb-4 flex justify-center">
                <FaBookmark />
              </div>
              <h3 className="text-xl font-semibold mb-2">Save Favorites</h3>
              <p className="text-gray-600">
                Create collections of your favorite recipes for easy access later.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Recipes Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-6">Featured Recipes</h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Explore these delicious recipes from around the world, powered by TheMealDB.
          </p>
          
          {isLoading ? (
            <Loader />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {randomRecipes.map(recipe => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-8">
            <Link to="/search" className="btn-primary">
              Discover More Recipes
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Cooking?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of home cooks who are making delicious meals with what they already have.
          </p>
          <Link to="/search" className="btn-primary text-lg px-8 py-3">
            Find Your First Recipe
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
