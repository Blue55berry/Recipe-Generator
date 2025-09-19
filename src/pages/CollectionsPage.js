import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserCollections, createCollection, deleteCollection } from '../features/collections/collectionSlice';
import CollectionCard from '../components/CollectionCard';
import Loader from '../components/Loader';
import { FaPlus, FaTimes } from 'react-icons/fa';

const CollectionsPage = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCollection, setNewCollection] = useState({
    name: '',
    description: ''
  });

  const dispatch = useDispatch();
  const { collections, isLoading } = useSelector((state) => state.collections);

  useEffect(() => {
    dispatch(getUserCollections());
  }, [dispatch]);

  const handleCreateCollection = (e) => {
    e.preventDefault();
    if (newCollection.name.trim() !== '') {
      dispatch(createCollection(newCollection));
      setNewCollection({ name: '', description: '' });
      setShowCreateForm(false);
    }
  };

  const handleDeleteCollection = (id) => {
    if (window.confirm('Are you sure you want to delete this collection?')) {
      dispatch(deleteCollection(id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Recipe Collections</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="btn-primary flex items-center"
        >
          {showCreateForm ? <FaTimes className="mr-2" /> : <FaPlus className="mr-2" />}
          {showCreateForm ? 'Cancel' : 'New Collection'}
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-md mb-8 p-6">
          <h2 className="text-xl font-semibold mb-4">Create New Collection</h2>
          <form onSubmit={handleCreateCollection}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Collection Name
              </label>
              <input
                type="text"
                id="name"
                className="input-field"
                placeholder="E.g., Weeknight Dinners, Favorite Desserts"
                value={newCollection.name}
                onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                id="description"
                rows="3"
                className="input-field"
                placeholder="Add a description for your collection"
                value={newCollection.description}
                onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
              ></textarea>
            </div>
            <div className="flex justify-end">
              <button type="submit" className="btn-primary">
                Create Collection
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <Loader />
      ) : collections && collections.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <CollectionCard key={collection._id} collection={collection} />
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold mb-2">No Collections Yet</h2>
          <p className="text-gray-600 mb-6">
            Create a collection to organize your favorite recipes for easy access.
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary"
          >
            Create Your First Collection
          </button>
        </div>
      )}
    </div>
  );
};

export default CollectionsPage;
