import React from 'react';
import { Link } from 'react-router-dom';
import { FaList } from 'react-icons/fa';

const CollectionCard = ({ collection }) => {
  return (
    <div className="card transition-transform hover:scale-105" data-aos="fade-up">
      <div className="p-5">
        <h3 className="text-lg font-semibold flex items-center">
          <FaList className="mr-2 text-primary" />
          {collection.name}
        </h3>
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
          {collection.description || 'No description'}
        </p>
        
        <div className="mt-3 text-sm text-gray-500">
          {collection.recipes.length} {collection.recipes.length === 1 ? 'recipe' : 'recipes'}
        </div>
        
        <div className="mt-4">
          <Link 
            to={`/collections/${collection._id}`} 
            className="btn-secondary inline-block w-full text-center"
          >
            View Collection
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;
