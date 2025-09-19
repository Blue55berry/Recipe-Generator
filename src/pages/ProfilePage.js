import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile } from '../features/auth/authSlice';
import Loader from '../components/Loader';
import { FaUser, FaEnvelope, FaUtensils, FaExclamationCircle } from 'react-icons/fa';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dietary_preferences: [],
    allergies: []
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        dietary_preferences: user.dietary_preferences || [],
        allergies: user.allergies || []
      });
    }
  }, [user]);

  const dietaryOptions = [
    'vegetarian', 'vegan', 'pescatarian', 'gluten-free', 
    'dairy-free', 'keto', 'paleo', 'low-carb'
  ];
  
  const allergyOptions = [
    'nuts', 'eggs', 'milk', 'soy', 'wheat', 'fish', 'shellfish'
  ];

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDietaryToggle = (preference) => {
    setFormData((prevState) => {
      if (prevState.dietary_preferences.includes(preference)) {
        return {
          ...prevState,
          dietary_preferences: prevState.dietary_preferences.filter(p => p !== preference)
        };
      } else {
        return {
          ...prevState,
          dietary_preferences: [...prevState.dietary_preferences, preference]
        };
      }
    });
  };

  const handleAllergyToggle = (allergy) => {
    setFormData((prevState) => {
      if (prevState.allergies.includes(allergy)) {
        return {
          ...prevState,
          allergies: prevState.allergies.filter(a => a !== allergy)
        };
      } else {
        return {
          ...prevState,
          allergies: [...prevState.allergies, allergy]
        };
      }
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    
    try {
      dispatch(updateProfile(formData));
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      
      {message.text && (
        <div className={`mb-6 p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          <div className="flex items-center">
            {message.type === 'error' && <FaExclamationCircle className="mr-2" />}
            <span>{message.text}</span>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <form onSubmit={onSubmit}>
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="input-field pl-10"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={onChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="input-field pl-10 bg-gray-50"
                    placeholder="Your email"
                    value={formData.email}
                    disabled
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Dietary Preferences</h2>
            <p className="text-gray-600 mb-4">
              These preferences will help us personalize recipe recommendations for you.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-3">
              {dietaryOptions.map((diet) => (
                <div key={diet} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`diet-${diet}`}
                    checked={formData.dietary_preferences.includes(diet)}
                    onChange={() => handleDietaryToggle(diet)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    disabled={!isEditing}
                  />
                  <label htmlFor={`diet-${diet}`} className="ml-2 block text-sm text-gray-900 capitalize">
                    {diet.replace('-', ' ')}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Food Allergies</h2>
            <p className="text-gray-600 mb-4">
              Select any allergies so we can help you avoid recipes with these ingredients.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-3">
              {allergyOptions.map((allergy) => (
                <div key={allergy} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`allergy-${allergy}`}
                    checked={formData.allergies.includes(allergy)}
                    onChange={() => handleAllergyToggle(allergy)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    disabled={!isEditing}
                  />
                  <label htmlFor={`allergy-${allergy}`} className="ml-2 block text-sm text-gray-900 capitalize">
                    {allergy}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-6 flex justify-end">
            {isEditing ? (
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="btn-primary"
              >
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
