import { useState } from 'react';
import Navbar from '../components/Navbar';
import RecipeForm from '../components/RecipeForm';
import { api } from '../utils/api';
import { ChefHat, Sparkles, BookOpen, Utensils } from 'lucide-react';

const AddRecipe = ({ onNavigate }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError('');

    const response = await api.createRecipe(formData);

    if (response.recipe) {
      onNavigate('my-recipes');
    } else {
      setError(response.error || 'Failed to create recipe');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <Navbar currentPage="add-recipe" onNavigate={onNavigate} />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 py-12 mb-8 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-5 left-1/4 text-5xl animate-bounce" style={{ animationDuration: '4s' }}>🥘</div>
          <div className="absolute top-10 right-1/4 text-4xl animate-bounce" style={{ animationDuration: '5s', animationDelay: '1s' }}>🍳</div>
          <div className="absolute bottom-5 left-1/3 text-4xl animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '0.5s' }}>🥗</div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              Share Your Culinary Creation
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Add New Recipe
            </h1>
            <p className="text-orange-100 text-lg">
              Share your delicious recipe with the community
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Tips Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-orange-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="bg-gradient-to-br from-orange-400 to-red-500 p-2 rounded-lg">
                <ChefHat className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm mb-1">Be Detailed</h3>
                <p className="text-xs text-gray-600">Include all ingredients and steps</p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-orange-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="bg-gradient-to-br from-blue-400 to-purple-500 p-2 rounded-lg">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm mb-1">Clear Instructions</h3>
                <p className="text-xs text-gray-600">Make it easy to follow</p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-orange-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="bg-gradient-to-br from-green-400 to-teal-500 p-2 rounded-lg">
                <Utensils className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm mb-1">Add Photos</h3>
                <p className="text-xs text-gray-600">Images make it appealing</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 flex items-start gap-3 shadow-sm">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-semibold mb-1">Error Creating Recipe</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
            <h2 className="text-xl font-bold text-white">Recipe Details</h2>
            <p className="text-orange-100 text-sm">Fill in the information below</p>
          </div>

          {/* Form Content */}
          <div className="p-6">
            <RecipeForm
              onSubmit={handleSubmit}
              onCancel={() => onNavigate('home')}
              loading={loading}
            />
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            💡 <span className="font-semibold">Pro Tip:</span> The more detailed your recipe, the more engagement you'll get!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddRecipe;