import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getRecipe, saveToFavorites, addToCollection, clearRecipe } from '../features/recipes/recipeSlice';
import { getUserCollections } from '../features/collections/collectionSlice';
import Loader from '../components/Loader';
import RecipeTimer from '../components/RecipeTimer';
import NutritionalInfo from '../components/NutritionalInfo';
import PrintableRecipe from '../components/PrintableRecipe';

import { 
  FaClock, FaUtensils, FaHeart, FaRegHeart, FaBookmark, 
  FaPrint, FaShare, FaYoutube, FaGlobe, FaCheckCircle,
  FaListOl, FaShoppingBasket
} from 'react-icons/fa';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useSelector((state) => state.language);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showCollections, setShowCollections] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [completedSteps, setCompletedSteps] = useState([]);
  const [timer, setTimer] = useState({ active: false, seconds: 0 });

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
    if (recipe) {
      const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];

      // Remove the recipe if it already exists to avoid duplicates and move it to the front
      const filtered = recentlyViewed.filter(item => item._id !== recipe._id);

      // Add the new recipe to the beginning of the list
      const newHistory = [{
        _id: recipe._id,
        title: recipe.title,
        image_url: recipe.image_url,
        description: recipe.description
      }, ...filtered];

      // Keep only the 5 most recent items
      const trimmedHistory = newHistory.slice(0, 5);

      localStorage.setItem('recentlyViewed', JSON.stringify(trimmedHistory));
    }
  }, [recipe]);

  useEffect(() => {
    if (user && recipe && user.favorite_recipes) {
      setIsFavorite(user.favorite_recipes.includes(recipe._id));
    }
  }, [user, recipe]);

  // Timer functionality
  useEffect(() => {
    let interval;
    if (timer.active) {
      interval = setInterval(() => {
        setTimer(prev => ({ ...prev, seconds: prev.seconds + 1 }));
      }, 1000);
    }
    
    return () => {
      clearInterval(interval);
    };
  }, [timer.active]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const toggleTimer = () => {
    setTimer(prev => ({ ...prev, active: !prev.active }));
  };

  const resetTimer = () => {
    setTimer({ active: false, seconds: 0 });
  };

  const toggleStepCompletion = (index) => {
    if (completedSteps.includes(index)) {
      setCompletedSteps(completedSteps.filter(step => step !== index));
    } else {
      setCompletedSteps([...completedSteps, index]);
    }
  };

  const toggleFavorite = () => {
    if (user) {
      dispatch(saveToFavorites(recipe._id));
      setIsFavorite(!isFavorite);
    } else {
      navigate('/login');
    }
  };

  const handleCollectionClick = () => {
    if (user) {
      setShowCollections(!showCollections);
    } else {
      navigate('/login');
    }
  };

  const handleAddToCollection = () => {
    if (selectedCollection) {
      dispatch(addToCollection({ recipeId: recipe._id, collectionId: selectedCollection }));
      setShowCollections(false);
      setSelectedCollection('');
    }
  };

  // Function to estimate time for each step
  const estimateStepTime = (instruction, index, totalSteps) => {
    const totalCookTime = recipe.cook_time || 30;
    const totalPrepTime = recipe.prep_time || 15;
    
    // Determine if this is a cooking or prep step
    const isCookingStep = 
      instruction.toLowerCase().includes('cook') || 
      instruction.toLowerCase().includes('bake') || 
      instruction.toLowerCase().includes('simmer') ||
      instruction.toLowerCase().includes('boil') ||
      instruction.toLowerCase().includes('fry') ||
      instruction.toLowerCase().includes('roast');
    
    // Cooking steps typically take longer than prep steps
    if (isCookingStep) {
      // Distribute cooking time among cooking steps
      return Math.round(totalCookTime / (totalSteps / 2)) || 5;
    } else {
      // Distribute prep time among prep steps
      return Math.round(totalPrepTime / (totalSteps / 2)) || 3;
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
            <button 
              onClick={toggleFavorite}
              className="flex items-center text-gray-600 hover:text-primary transition-transform hover:scale-110"
            >
              {isFavorite ? <FaHeart className="text-primary mr-1" /> : <FaRegHeart className="mr-1" />}
              <span>{isFavorite ? 'Saved' : 'Save'}</span>
            </button>
            
            <button 
              onClick={handleCollectionClick}
              className="flex items-center text-gray-600 hover:text-primary transition-transform hover:scale-110"
            >
              <FaBookmark className="mr-1" />
              <span>Collection</span>
            </button>
          </div>
          
          <div className="flex space-x-4">
            <button 
              onClick={() => window.print()}
              className="flex items-center text-gray-600 hover:text-primary transition-transform hover:scale-110"
            >
              <FaPrint className="mr-1" />
              <span>Print</span>
            </button>
            
            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
              }}
              className="flex items-center text-gray-600 hover:text-primary transition-transform hover:scale-110"
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
        
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 px-6 font-medium focus:outline-none ${
                activeTab === 'overview'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('stepByStep')}
              className={`py-3 px-6 font-medium focus:outline-none ${
                activeTab === 'stepByStep'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="flex items-center">
                <FaListOl className="mr-2" />
                Step by Step
              </span>
            </button>
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`py-3 px-6 font-medium focus:outline-none ${
                activeTab === 'ingredients'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="flex items-center">
                <FaShoppingBasket className="mr-2" />
                Ingredients
              </span>
            </button>
          </div>
        </div>
        
        {/* Recipe Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Description</h2>
                <p className="text-gray-700">
                  {language === 'ta' && recipe.description_ta ? recipe.description_ta : (isExternalRecipe && recipe.full_description ? recipe.full_description : recipe.description)}
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Ingredients */}
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
                  <ul className="space-y-2">
                    {(language === 'ta' && recipe.ingredients_ta && recipe.ingredients_ta.length > 0 ? recipe.ingredients_ta : recipe.ingredients).map((ingredient, index) => (
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
                    {(language === 'ta' && recipe.instructions_ta && recipe.instructions_ta.length > 0 ? recipe.instructions_ta : recipe.instructions).map((instruction, index) => (
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
              
              <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Nutrition</h2>
                <NutritionalInfo recipe={recipe} />
              </div>
              
              {/* Tags/Categories */}
              {recipe.tags && recipe.tags.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-2">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {recipe.tags.map((tag, index) => (
                      <Link 
                        key={index} 
                        to={`/category/${tag}`}
                        className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700 hover:bg-gray-200"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
          
          {activeTab === 'stepByStep' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Step by Step Instructions</h2>
                <div className="flex items-center gap-3">
                  <div className="text-lg font-mono">{formatTime(timer.seconds)}</div>
                  <button 
                    onClick={toggleTimer}
                    className={`px-3 py-1 rounded-md ${timer.active ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
                  >
                    {timer.active ? 'Pause' : 'Start'}
                  </button>
                  <button 
                    onClick={resetTimer}
                    className="px-3 py-1 bg-gray-200 rounded-md"
                  >
                    Reset
                  </button>
                </div>
              </div>
              
              <div className="space-y-8">
                {recipe.instructions.map((instruction, index) => {
                  const estimatedTime = estimateStepTime(instruction, index, recipe.instructions.length);
                  const isCompleted = completedSteps.includes(index);
                  
                  return (
                    <div 
                      key={index} 
                      className={`p-6 rounded-lg border ${isCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold flex items-center">
                          <span className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-lg mr-3">
                            {index + 1}
                          </span>
                          Step {index + 1}
                        </h3>
                        <div className="flex items-center gap-3">
                          <span className="text-gray-500 flex items-center">
                            <FaClock className="mr-1" />
                            ~{estimatedTime} min
                          </span>
                          <button 
                            onClick={() => toggleStepCompletion(index)}
                            className={`flex items-center ${isCompleted ? 'text-green-500' : 'text-gray-400'}`}
                          >
                            <FaCheckCircle className="text-xl" />
                          </button>
                        </div>
                      </div>
                      
                      <p className={`text-gray-700 ${isCompleted ? 'line-through text-gray-400' : ''}`}>
                        {instruction}
                      </p>
                      
                      {/* Ingredients needed for this step */}
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-600 mb-2">Ingredients for this step:</h4>
                        <div className="flex flex-wrap gap-2">
                          {recipe.ingredients
                            .filter(ingredient => instruction.toLowerCase().includes(ingredient.name.toLowerCase()))
                            .map((ingredient, idx) => (
                              <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-md">
                                {ingredient.amount} {ingredient.unit} {ingredient.name}
                              </span>
                            ))
                          }
                          {recipe.ingredients
                            .filter(ingredient => instruction.toLowerCase().includes(ingredient.name.toLowerCase())).length === 0 && (
                              <span className="text-gray-500 text-sm italic">No specific ingredients identified for this step</span>
                            )
                          }
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-8">
                <RecipeTimer />
              </div>
            </div>
          )}
          
          {activeTab === 'ingredients' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Shopping List</h2>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
                <h3 className="text-lg font-semibold mb-4">All Ingredients</h3>
                
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {recipe.ingredients.map((ingredient, index) => (
                    <div 
                      key={index} 
                      className="flex items-center p-3 bg-white rounded-lg border border-gray-200"
                    >
                      <input 
                        type="checkbox" 
                        id={`ingredient-${index}`}
                        className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label 
                        htmlFor={`ingredient-${index}`}
                        className="ml-3 text-gray-700 flex-grow"
                      >
                        <span className="font-medium">{ingredient.name}</span>
                        <span className="block text-sm text-gray-500">
                          {ingredient.amount} {ingredient.unit}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => window.print()}
                  className="btn-primary flex items-center"
                >
                  <FaPrint className="mr-2" />
                  Print Shopping List
                </button>
                
                <button
                  onClick={() => {
                    const list = recipe.ingredients
                      .map(i => `${i.amount} ${i.unit} ${i.name}`)
                      .join('\n');
                    navigator.clipboard.writeText(`Shopping list for ${recipe.title}:\n${list}`);
                    alert('Shopping list copied to clipboard!');
                  }}
                  className="btn-secondary flex items-center"
                >
                  <FaShare className="mr-2" />
                  Copy to Clipboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {recipe && <PrintableRecipe recipe={recipe} />}
    </div>
  );
};

export default RecipeDetailPage;
