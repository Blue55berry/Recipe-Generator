import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getRecipe, saveToFavorites, addToCollection, clearRecipe } from '../features/recipes/recipeSlice';
import { getUserCollections } from '../features/collections/collectionSlice';
import Loader from '../components/Loader';
import { FaClock, FaUtensils, FaHeart, FaRegHeart, FaBookmark, FaPrint, FaShare, FaYoutube, FaGlobe } from 'react-icons/fa';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showCollections, setShowCollections] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState('');

  const dispatch = useDispatch();
  const { recipe, isLoading, isError } = useSelector((state) => state.recipes);
  const { user } = useSelector((state) => state.auth);
  const { collections } = useSelector((state) => state.collections);

  useEffect(() => {
    dispatch(getRecipe(id));
    if (user) {
      dispatch(getUserCollections());
    }

    return () => {
      dispatch(clearRecipe());
    };
  }, [dispatch, id, user]);

  useEffect(() => {
    if (user && recipe && user.favorite_recipes) {
      setIsFavorite(user.favorite_recipes.includes(recipe._id));
    }
  }, [user, recipe]);

  const toggleFavorite = () => {
    if (user) {
      dispatch(saveToFavorites(recipe._id));
      setIsFavorite(!isFavorite);
    } else {
      // Redirect to login or show modal
      alert('Please login to save favorites');
    }
  };

  const handleAddToCollection = () => {
    if (selectedCollection) {
      dispatch(addToCollection({ recipeId: recipe._id, collectionId: selectedCollection }));
      setShowCollections(false);
      setSelectedCollection('');
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <p>Error loading recipe. Please try again.</p>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return null;
  }

  const isExternalRecipe = recipe.external_source === 'themealdb';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Recipe Header */}
        <div className="relative">
          <img 
            src={recipe.image_url || '/placeholder-recipe.jpg'} 
            alt={recipe.title} 
            className="w-full h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="p-6 text-white">
              <h1 className="text-3xl font-bold">{recipe.title}</h1>
              {isExternalRecipe && recipe.area && (
                <div className="text-lg mb-2">{recipe.area} Cuisine</div>
              )}
              <div className="flex flex-wrap items-center mt-2 gap-4">
                <div className="flex items-center">
                  <FaClock className="mr-1" />
                  <span>{recipe.prep_time + recipe.cook_time} min</span>
                </div>
                <div className="flex items-center">
                  <FaUtensils className="mr-1" />
                  <span className="capitalize">{recipe.difficulty}</span>
                </div>
                <div>
                  <span>{recipe.servings} servings</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
                {/* Recipe Actions */}
        <div className="flex justify-between border-b border-gray-200 p-4">
          <div className="flex space-x-4">
            {user && (
              <>
                <button 
                  onClick={toggleFavorite}
                  className="flex items-center text-gray-600 hover:text-primary"
                >
                  {isFavorite ? <FaHeart className="text-primary mr-1" /> : <FaRegHeart className="mr-1" />}
                  <span>{isFavorite ? 'Saved' : 'Save'}</span>
                </button>
                
                <button 
                  onClick={() => setShowCollections(!showCollections)}
                  className="flex items-center text-gray-600 hover:text-primary"
                >
                  <FaBookmark className="mr-1" />
                  <span>Collection</span>
                </button>
              </>
            )}
          </div>
          
          <div className="flex space-x-4">
            <button 
              onClick={() => window.print()}
              className="flex items-center text-gray-600 hover:text-primary"
            >
              <FaPrint className="mr-1" />
              <span>Print</span>
            </button>
            
            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
              }}
              className="flex items-center text-gray-600 hover:text-primary"
            >
              <FaShare className="mr-1" />
              <span>Share</span>
            </button>
          </div>
        </div>
        
        {/* Collections Dropdown */}
        {showCollections && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center">
              <select
                className="input-field mr-2 flex-grow"
                value={selectedCollection}
                onChange={(e) => setSelectedCollection(e.target.value)}
              >
                <option value="">Select a collection</option>
                {collections.map((collection) => (
                  <option key={collection._id} value={collection._id}>
                    {collection.name}
                  </option>
                ))}
              </select>
              <button 
                onClick={handleAddToCollection}
                className="btn-primary"
                disabled={!selectedCollection}
              >
                Add
              </button>
            </div>
          </div>
        )}
        
        {/* External Source Links */}
        {isExternalRecipe && (recipe.youtube_url || recipe.source_url) && (
          <div className="p-4 border-b border-gray-200 flex flex-wrap gap-4">
            {recipe.youtube_url && (
              <a 
                href={recipe.youtube_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-red-600 hover:text-red-700"
              >
                <FaYoutube className="mr-1 text-xl" />
                <span>Watch Recipe Video</span>
              </a>
            )}
            
            {recipe.source_url && (
              <a 
                href={recipe.source_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 hover:text-blue-700"
              >
                <FaGlobe className="mr-1" />
                <span>Original Recipe Source</span>
              </a>
            )}
          </div>
        )}
        
        {/* Recipe Content */}
        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Description</h2>
            <p className="text-gray-700">
              {isExternalRecipe && recipe.full_description ? recipe.full_description : recipe.description}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Ingredients */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start">
                    <span className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-sm mr-2 mt-0.5">
                      {index + 1}
                    </span>
                    <span>
                      {ingredient.amount} {ingredient.unit} {ingredient.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Instructions */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
              <ol className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start">
                    <span className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-sm mr-2 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          
          {/* Nutrition Info */}
          {recipe.nutrition_info && Object.keys(recipe.nutrition_info).length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">Nutrition Information</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {Object.entries(recipe.nutrition_info).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="text-lg font-semibold">{value}</div>
                      <div className="text-sm text-gray-500 capitalize">{key.replace('_', ' ')}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Tags/Categories */}
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-2">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag, index) => (
                  <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPage;
