import axios from 'axios';

const API_URL = 'http://localhost:5000/api/collections/';

// Get user collections
const getUserCollections = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL, config);
  return response.data;
};

// Get collection by ID
const getCollection = async (collectionId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + collectionId, config);
  return response.data;
};

// Create new collection
const createCollection = async (collectionData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, collectionData, config);
  return response.data;
};

// Delete collection
const deleteCollection = async (collectionId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(API_URL + collectionId, config);
  return response.data;
};

const collectionService = {
  getUserCollections,
  getCollection,
  createCollection,
  deleteCollection,
};

export default collectionService;
