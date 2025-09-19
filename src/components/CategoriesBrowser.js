import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loader from './Loader';

const CategoriesBrowser = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://www.themealdb.com/api/json/v1/1/categories.php');
        
        if (response.data && response.data.categories) {
          setCategories(response.data.categories);
        }
      } catch (err) {
        setError('Failed to load categories. Please try again later.');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Browse by Category</h2>
      
      <div className="grid grid-cols-2 gap-3">
        {categories.map((category) => (
          <Link
            key={category.idCategory}
            to={`/category/${category.strCategory}`}
            className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <img 
              src={category.strCategoryThumb} 
              alt={category.strCategory}
              className="w-12 h-12 object-cover rounded-full mr-3"
            />
            <span className="font-medium text-gray-700">{category.strCategory}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesBrowser;
