import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import CommentList from '../components/CommentList';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Heart, Bookmark, Clock, User } from 'lucide-react';

const RecipeDetails = ({ onNavigate, recipeId }) => {
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const fetchRecipe = async () => {
    const response = await api.getRecipeById(recipeId);
    if (response.recipe) {
      setRecipe(response.recipe);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecipe();
  }, [recipeId]);

  const handleLike = async () => {
    if (!user) return;

    if (isLiked) {
      await api.unlikeRecipe(recipeId);
      setIsLiked(false);
    } else {
      await api.likeRecipe(recipeId);
      setIsLiked(true);
    }
    fetchRecipe();
  };

  const handleFavorite = async () => {
    if (!user) return;

    if (isFavorited) {
      await api.unfavoriteRecipe(recipeId);
      setIsFavorited(false);
    } else {
      await api.favoriteRecipe(recipeId);
      setIsFavorited(true);
    }
  };

  const handleAddComment = async (comment) => {
    await api.addComment(recipeId, comment);
    fetchRecipe();
  };

  const handleDeleteComment = async (commentId) => {
    await api.deleteComment(commentId);
    fetchRecipe();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar currentPage="home" onNavigate={onNavigate} />
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-600">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar currentPage="home" onNavigate={onNavigate} />
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-600">Recipe not found</p>
        </div>
      </div>
    );
  }

  const likesCount = recipe.recipe_likes?.[0]?.count || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPage="home" onNavigate={onNavigate} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {recipe.image_url && (
            <img
              src={recipe.image_url}
              alt={recipe.title}
              className="w-full h-96 object-cover"
            />
          )}

          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                  {recipe.title}
                </h1>
                <div className="flex items-center text-gray-600 space-x-4">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span>{recipe.users?.username || 'Anonymous'}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{new Date(recipe.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {user && (
                <div className="flex space-x-3">
                  <button
                    onClick={handleLike}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                      isLiked
                        ? 'bg-red-100 text-red-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-red-50'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                    <span>{likesCount}</span>
                  </button>

                  <button
                    onClick={handleFavorite}
                    className={`flex items-center px-4 py-2 rounded-md ${
                      isFavorited
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-yellow-50'
                    }`}
                  >
                    <Bookmark className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
                  </button>
                </div>
              )}
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Ingredients
              </h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <pre className="whitespace-pre-wrap font-sans text-gray-700">
                  {recipe.ingredients}
                </pre>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Instructions
              </h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <pre className="whitespace-pre-wrap font-sans text-gray-700">
                  {recipe.steps}
                </pre>
              </div>
            </div>

            <CommentList
              comments={recipe.recipe_comments || []}
              onAddComment={handleAddComment}
              onDeleteComment={handleDeleteComment}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;
