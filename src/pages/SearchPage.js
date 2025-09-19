import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchRecipes, reset, getCategories, searchRecipesByName, getRecipesByCategory } from '../features/recipes/recipeSlice';
import IngredientInput from '../components/Ingredientinput';
import RecipeNameSearch from '../components/RecipeNameSearch';
import CategoriesBrowser from '../components/CategoriesBrowser';
import RecipeCard from '../components/RecipeCard';
import Loader from '../components/Loader';
import { FaFilter, FaSort, FaTimes, FaListAlt } from 'react-icons/fa';

const SearchPage = () => {
  const [ingredients, setIngredients] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('ingredients'); // 'ingredients' or 'name' or 'categories'
  const [filters, setFilters] = useState({
    difficulty: '',
    maxTime: '',
    diet: [],
    category: ''
  });

  const dispatch = useDispatch();
  const { recipes, categories, isLoading, isError, message } = useSelector(
    (state) => state.recipes
  );

  useEffect(() => {
    dispatch(getCategories());
    
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  const handleIngredientsSubmit = (ingredients) => {
    dispatch(searchRecipes({ ingredients, filters }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleDietToggle = (diet) => {
    if (filters.diet.includes(diet)) {
      setFilters({
        ...filters,
        diet: filters.diet.filter(d => d !== diet)
      });
    } else {
      setFilters({
        ...filters,
        diet: [...filters.diet, diet]
      });
    }
  };

  const applyFilters = () => {
    if (activeTab === 'ingredients') {
      if (ingredients.length > 0) {
        dispatch(searchRecipes({ ingredients, filters }));
      }
    } else if (activeTab === 'name') {
      // If there's an active name search, re-search with the new filters
      const searchInput = document.querySelector('input[placeholder*="recipe name"]');
      if (searchInput && searchInput.value) {
        dispatch(searchRecipesByName({ query: searchInput.value, filters }));
      }
    } else if (activeTab === 'categories' && filters.category) {
      dispatch(getRecipesByCategory({ category: filters.category, filters }));
    }
    setShowFilters(false);
  };

  const resetFilters = () => {
    setFilters({
      difficulty: '',
      maxTime: '',
      diet: [],
      category: ''
    });
  };

  const handleCategoryClick = (categoryName) => {
    setFilters({...filters, category: categoryName});
    dispatch(getRecipesByCategory({ category: categoryName, filters }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-center mb-6">Find Recipes</h1>
      
      {/* Search Tabs */}
      <div className="mb-8">
        <div className="flex border-b border-gray-200">
          <button
            className={`py-2 px-4 font-medium text-sm focus:outline-none ${
              activeTab === 'ingredients'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('ingredients')}
          >
            Search by Ingredients
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm focus:outline-none ${
              activeTab === 'name'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('name')}
          >
            Search by Recipe Name
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm focus:outline-none ${
              activeTab === 'categories'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('categories')}
          >
            Browse Categories
          </button>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Sidebar */}
        <div className="md:col-span-1">
          {activeTab === 'ingredients' && (
            <IngredientInput 
              ingredients={ingredients}
              setIngredients={setIngredients}
              onIngredientsSubmit={handleIngredientsSubmit} 
            />
          )}
          
          {activeTab === 'name' && (
            <RecipeNameSearch filters={filters} />
          )}
          
          {activeTab === 'categories' && (
            <CategoriesBrowser />
          )}
          
          <div className="mt-8">
            <button 
              className="flex items-center justify-between w-full bg-white p-4 rounded-lg shadow-md text-left font-semibold"
              onClick={() => setShowFilters(!showFilters)}
            >
              <span className="flex items-center">
                <FaFilter className="mr-2 text-primary" />
                Filter Results
              </span>
              <span>{showFilters ? <FaTimes /> : '+'}</span>
            </button>
            
            {showFilters && (
              <div className="mt-4 bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold mb-4">Filters</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty Level
                  </label>
                  <select
                    name="difficulty"
                    value={filters.difficulty}
                    onChange={handleFilterChange}
                    className="input-field"
                  >
                    <option value="">Any Difficulty</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Time (minutes)
                  </label>
                  <input
                    type="number"
                    name="maxTime"
                    value={filters.maxTime}
                    onChange={handleFilterChange}
                    placeholder="Any time"
                    min="0"
                    className="input-field"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dietary Preferences
                  </label>
                  <div className="space-y-2">
                    {['vegetarian', 'vegan', 'gluten-free', 'dairy-free'].map((diet) => (
                      <div key={diet} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`diet-${diet}`}
                          checked={filters.diet.includes(diet)}
                          onChange={() => handleDietToggle(diet)}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <label htmlFor={`diet-${diet}`} className="ml-2 block text-sm text-gray-900 capitalize">
                          {diet}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={applyFilters}
                    className="btn-primary flex-1"
                  >
                    Apply Filters
                  </button>
                  <button 
                    onClick={resetFilters}
                    className="btn-secondary flex-1"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Recipe Results */}
        <div className="md:col-span-2">
          {isLoading ? (
            <Loader />
          ) : isError ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <p>{message}</p>
            </div>
          ) : recipes.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  Found {recipes.length} Recipes
                </h2>
                <div className="flex items-center">
                  <FaSort className="mr-2 text-gray-500" />
                  <select className="input-field py-1">
                    <option value="relevance">Relevance</option>
                    <option value="time">Cooking Time</option>
                    <option value="difficulty">Difficulty</option>
                  </select>
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {recipes.map((recipe) => (
                  <RecipeCard key={recipe._id} recipe={recipe} />
                ))}
              </div>
            </>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <h2 className="text-xl font-semibold mb-2">No Recipes Found</h2>
              <p className="text-gray-600 mb-4">
                Try different search terms, ingredients, or adjust your filters to find delicious recipes.
              </p>
              <img 
                src="/empty-plate.svg" 
                alt="No recipes" 
                className="max-w-xs mx-auto opacity-60"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
