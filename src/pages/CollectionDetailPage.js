import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCollection } from '../features/collections/collectionSlice';
import RecipeCard from '../components/RecipeCard';
import Loader from '../components/Loader';
import { FaArrowLeft } from 'react-icons/fa';

const CollectionDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { collection, isLoading, isError, message } = useSelector(
    (state) => state.collections
  );

  useEffect(() => {
    dispatch(getCollection(id));
  }, [dispatch, id]);

  if (isLoading || !collection) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <p>Error: {message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link to="/collections" className="flex items-center text-gray-500 hover:text-primary">
          <FaArrowLeft className="mr-2" />
          Back to Collections
        </Link>
      </div>
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">{collection.name}</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">{collection.description}</p>
      </div>

      {collection.recipes && collection.recipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {collection.recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">This Collection is Empty</h2>
          <p className="text-gray-600 mb-6">Start adding recipes to see them here.</p>
          <Link to="/search" className="btn-primary">
            Find Recipes to Add
          </Link>
        </div>
      )}
    </div>
  );
};

export default CollectionDetailPage;
