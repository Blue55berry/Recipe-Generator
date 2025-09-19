import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { searchRecipesByName } from '../features/recipes/recipeSlice';
import { FaSearch } from 'react-icons/fa';

const RecipeNameSearch = ({ filters }) => {
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      dispatch(searchRecipesByName({ query, filters }));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Search Recipes by Name</h2>
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          className="input-field flex-grow"
          placeholder="Enter recipe name (e.g., Pasta, Chicken, Lasagna)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="ml-2 bg-primary text-white p-2 rounded-md hover:bg-opacity-90 flex items-center justify-center"
          disabled={!query.trim()}
        >
          <FaSearch />
        </button>
      </form>
    </div>
  );
};

export default RecipeNameSearch;
