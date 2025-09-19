const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  ingredients: [
    {
      name: {
        type: String,
        required: true
      },
      amount: {
        type: Number,
        required: true
      },
      unit: {
        type: String,
        required: true
      }
    }
  ],
  instructions: {
    type: [String],
    required: [true, 'Please add cooking instructions']
  },
  prep_time: {
    type: Number,
    required: [true, 'Please add preparation time']
  },
  cook_time: {
    type: Number,
    required: [true, 'Please add cooking time']
  },
  servings: {
    type: Number,
    required: [true, 'Please add number of servings']
  },
  image_url: {
    type: String,
    default: 'no-photo.jpg'
  },
  tags: {
    type: [String],
    default: []
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  nutrition_info: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Recipe', RecipeSchema);
