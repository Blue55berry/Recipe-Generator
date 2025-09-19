import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import recipeReducer from '../features/recipes/recipeSlice';
import collectionReducer from '../features/collections/collectionSlice';
import languageReducer from '../features/language/languageSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    recipes: recipeReducer,
    collections: collectionReducer,
    language: languageReducer,
  },
});
