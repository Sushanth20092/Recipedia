import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import RecipeCard from '../components/RecipeCard';
import { api } from '../utils/api';
import { Edit, Trash2, ChefHat, Plus, BookOpen } from 'lucide-react';

const MyRecipes = ({ onNavigate }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ show: false, recipeId: null, recipeName: '' });

  const fetchMyRecipes = async () => {
    setLoading(true);
    const response = await api.getMyRecipes();
    if (response.recipes) {
      setRecipes(response.recipes);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMyRecipes();
  }, []);

  const handleDelete = async (recipeId) => {
    await api.deleteRecipe(recipeId);
    setDeleteModal({ show: false, recipeId: null, recipeName: '' });
    fetchMyRecipes();
  };

  const openDeleteModal = (recipe) => {
    setDeleteModal({ show: true, recipeId: recipe.id, recipeName: recipe.title });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <Navbar currentPage="my-recipes" onNavigate={onNavigate} />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 py-12 mb-8 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-5 left-1/4 text-5xl animate-bounce" style={{ animationDuration: '4s' }}>👨‍🍳</div>
          <div className="absolute top-10 right-1/4 text-4xl animate-bounce" style={{ animationDuration: '5s', animationDelay: '1s' }}>📖</div>
          <div className="absolute bottom-5 left-1/3 text-4xl animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '0.5s' }}>🍽️</div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium mb-4">
                <ChefHat className="h-4 w-4" />
                Your Recipe Collection
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                My Recipes
              </h1>
              <p className="text-orange-100 text-lg">
                {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'} in your cookbook
              </p>
            </div>
            
            <button
              onClick={() => onNavigate('add-recipe')}
              className="mt-6 md:mt-0 inline-flex items-center gap-2 px-6 py-3 bg-white text-orange-600 rounded-xl font-semibold hover:bg-orange-50 transition-all transform hover:scale-105 shadow-lg"
            >
              <Plus className="h-5 w-5" />
              Add New Recipe
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block relative">
              <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-2xl animate-pulse">
                👨‍🍳
              </div>
            </div>
            <p className="text-gray-600 mt-4 text-lg">Loading your recipes...</p>
          </div>
        ) : recipes.length > 0 ? (
          <>
            {/* Stats Card */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-orange-100 shadow-sm mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-orange-400 to-red-500 p-3 rounded-xl">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{recipes.length}</p>
                    <p className="text-sm text-gray-600">Total Recipes</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-blue-400 to-purple-500 p-3 rounded-xl">
                    <ChefHat className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">Chef</p>
                    <p className="text-sm text-gray-600">Your Status</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-green-400 to-teal-500 p-3 rounded-xl">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {recipes.reduce((sum, r) => sum + (r.recipe_likes?.[0]?.count || 0), 0)}
                    </p>
                    <p className="text-sm text-gray-600">Total Likes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recipes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <div key={recipe.id} className="relative group">
                  <RecipeCard
                    recipe={recipe}
                    onViewDetails={(id) => onNavigate('recipe-details', { recipeId: id })}
                    onLike={() => {}}
                    onFavorite={() => {}}
                    isLiked={false}
                    isFavorited={false}
                  />
                  
                  {/* Action Buttons */}
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => onNavigate('edit-recipe', { recipeId: recipe.id })}
                      className="p-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 shadow-lg transform hover:scale-110 transition-all"
                      title="Edit Recipe"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(recipe)}
                      className="p-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 shadow-lg transform hover:scale-110 transition-all"
                      title="Delete Recipe"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="inline-block mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-5xl shadow-lg">
                👨‍🍳
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">No Recipes Yet</h2>
            <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
              Start your culinary journey by creating your first recipe and sharing it with the community!
            </p>
            <button
              onClick={() => onNavigate('add-recipe')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 shadow-lg"
            >
              <Plus className="h-5 w-5" />
              Create Your First Recipe
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Delete Recipe?</h3>
              <p className="text-gray-600">
                Are you sure you want to delete <span className="font-semibold text-gray-800">"{deleteModal.recipeName}"</span>? This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ show: false, recipeId: null, recipeName: '' })}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteModal.recipeId)}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRecipes;