import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import recipeService from './recipesService';

const initialState = {
  recipes: [],
  recommendedRecipes: [],
  favoriteRecipes: [],
  randomRecipes: [],
  categories: [],
  recipe: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Search recipes by ingredients
export const searchRecipes = createAsyncThunk(
  'recipes/search',
  async ({ ingredients, filters }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      return await recipeService.searchRecipes(ingredients, filters, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Search recipes by name
export const searchRecipesByName = createAsyncThunk(
  'recipes/searchByName',
  async (query, thunkAPI) => {
    try {
      return await recipeService.searchByName(query);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get single recipe
export const getRecipe = createAsyncThunk(
  'recipes/getRecipe',
  async (id, thunkAPI) => {
    try {
      return await recipeService.getRecipe(id);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get recommended recipes
export const getRecommendedRecipes = createAsyncThunk(
  'recipes/getRecommended',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      return await recipeService.getRecommendedRecipes(token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get random recipes
export const getRandomRecipes = createAsyncThunk(
  'recipes/getRandom',
  async (count, thunkAPI) => {
    try {
      return await recipeService.getRandomRecipes(count);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get favorite recipes
export const getFavoriteRecipes = createAsyncThunk(
  'recipes/getFavorites',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      return await recipeService.getFavoriteRecipes(token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Save recipe to favorites
export const saveToFavorites = createAsyncThunk(
  'recipes/saveToFavorites',
  async (recipeId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      return await recipeService.saveToFavorites(recipeId, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Add recipe to collection
export const addToCollection = createAsyncThunk(
  'recipes/addToCollection',
  async ({ recipeId, collectionId }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      return await recipeService.addToCollection(recipeId, collectionId, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get recipes by category
export const getRecipesByCategory = createAsyncThunk(
  'recipes/getByCategory',
  async (category, thunkAPI) => {
    try {
      return await recipeService.getRecipesByCategory(category);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get all categories
export const getCategories = createAsyncThunk(
  'recipes/getCategories',
  async (_, thunkAPI) => {
    try {
      return await recipeService.getCategories();
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const recipeSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearRecipe: (state) => {
      state.recipe = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchRecipes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchRecipes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.recipes = action.payload;
      })
      .addCase(searchRecipes.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(searchRecipesByName.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchRecipesByName.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.recipes = action.payload;
      })
      .addCase(searchRecipesByName.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getRecipe.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRecipe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.recipe = action.payload;
      })
      .addCase(getRecipe.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getRecommendedRecipes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRecommendedRecipes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.recommendedRecipes = action.payload;
      })
      .addCase(getRecommendedRecipes.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getRandomRecipes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRandomRecipes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.randomRecipes = action.payload;
      })
      .addCase(getRandomRecipes.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getFavoriteRecipes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFavoriteRecipes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.favoriteRecipes = action.payload;
      })
      .addCase(getFavoriteRecipes.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(saveToFavorites.fulfilled, (state, action) => {
        state.isSuccess = true;
      })
      .addCase(addToCollection.fulfilled, (state) => {
        state.isSuccess = true;
      })
      .addCase(getRecipesByCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRecipesByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.recipes = action.payload;
      })
      .addCase(getRecipesByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.categories = action.payload;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearRecipe } = recipeSlice.actions;
export default recipeSlice.reducer;
