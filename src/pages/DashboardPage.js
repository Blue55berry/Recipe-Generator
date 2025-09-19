import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getRecommendedRecipes, getFavoriteRecipes } from '../features/recipes/recipeSlice';
import RecipeCard from '../components/RecipeCard';
import Loader from '../components/Loader';
import { FaSearch, FaBookmark, FaHistory, FaUserCog } from 'react-icons/fa';

const DashboardPage = () => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const dispatch = useDispatch();
  const location = useLocation();
  const [welcomeMessage, setWelcomeMessage] = useState(location.state?.message || '');
  const { user } = useSelector((state) => state.auth);
  const { recommendedRecipes, favoriteRecipes, isLoading } = useSelector(
    (state) => state.recipes
  );

  useEffect(() => {
    dispatch(getRecommendedRecipes());
    dispatch(getFavoriteRecipes());
    const viewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    setRecentlyViewed(viewed);
  }, [dispatch]);

  if (isLoading || !user) {
    return <Loader />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {welcomeMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-8 rounded-md shadow-md relative" role="alert">
          <p className="font-bold">{welcomeMessage}</p>
          <button 
            onClick={() => setWelcomeMessage('')} 
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
      )}

      <div className="mb-10">
        <h1 className="text-3xl font-bold">Welcome, {user.name}!</h1>
        <p className="text-gray-600 mt-2">
          Find recipes, save your favorites, and keep track of your cooking journey.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <Link 
          to="/search" 
          className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center hover:shadow-lg transition-shadow"
        >
          <FaSearch className="text-3xl text-primary mb-3" />
          <h3 className="font-semibold mb-1">Find Recipes</h3>
          <p className="text-sm text-gray-600">Search by ingredients</p>
        </Link>
        
        <Link 
          to="/collections" 
          className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center hover:shadow-lg transition-shadow"
        >
          <FaBookmark className="text-3xl text-primary mb-3" />
          <h3 className="font-semibold mb-1">My Collections</h3>
          <p className="text-sm text-gray-600">Organize saved recipes</p>
        </Link>
        
        <a 
          href="#recently-viewed" 
          className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center hover:shadow-lg transition-shadow"
        >
          <FaHistory className="text-3xl text-primary mb-3" />
          <h3 className="font-semibold mb-1">Recent Activity</h3>
          <p className="text-sm text-gray-600">View recently viewed recipes</p>
        </a>
        
        <Link 
          to="/profile" 
          className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center hover:shadow-lg transition-shadow"
        >
          <FaUserCog className="text-3xl text-primary mb-3" />
          <h3 className="font-semibold mb-1">Profile Settings</h3>
          <p className="text-sm text-gray-600">Update preferences</p>
        </Link>
      </div>

      {/* Recommended Recipes */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Recommended For You</h2>
          <Link to="/search" className="text-primary hover:underline">
            View All
          </Link>
        </div>
        
        {recommendedRecipes && recommendedRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedRecipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p>No recommendations available yet. Start searching for recipes to get personalized suggestions!</p>
            <Link to="/search" className="btn-primary inline-block mt-4">
              Find Recipes
            </Link>
          </div>
        )}
      </div>

      {/* Favorite Recipes */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Favorites</h2>
          <Link to="/collections" className="text-primary hover:underline">
            View All Collections
          </Link>
        </div>
        
        {favoriteRecipes && favoriteRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favoriteRecipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p>You haven't saved any favorites yet. Save recipes you love for quick access!</p>
            <Link to="/search" className="btn-primary inline-block mt-4">
              Discover Recipes
            </Link>
          </div>
        )}
      </div>

      {/* Recently Viewed */}
      <div id="recently-viewed">
        <h2 className="text-2xl font-bold mb-6">Recently Viewed</h2>
        {recentlyViewed && recentlyViewed.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentlyViewed.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p>You haven't viewed any recipes recently. Your history will appear here.</p>
            <Link to="/search" className="btn-primary inline-block mt-4">
              Find Recipes
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
