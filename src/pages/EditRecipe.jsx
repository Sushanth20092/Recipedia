import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import RecipeForm from '../components/RecipeForm';
import { api } from '../utils/api';

const EditRecipe = ({ onNavigate, recipeId }) => {
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      const response = await api.getRecipeById(recipeId);
      if (response.recipe) {
        setRecipe(response.recipe);
      } else {
        setError('Recipe not found');
      }
      setLoading(false);
    };

    fetchRecipe();
  }, [recipeId]);

  const handleSubmit = async (formData) => {
    setError('');
    const response = await api.updateRecipe(recipeId, formData);

    if (response.recipe) {
      onNavigate('my-recipes');
    } else {
      setError(response.error || 'Failed to update recipe');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar currentPage="my-recipes" onNavigate={onNavigate} />
        <div className="max-w-3xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-600">Loading recipe...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPage="my-recipes" onNavigate={onNavigate} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit Recipe</h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}

        {recipe && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <RecipeForm
              initialData={recipe}
              onSubmit={handleSubmit}
              onCancel={() => onNavigate('my-recipes')}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EditRecipe;
