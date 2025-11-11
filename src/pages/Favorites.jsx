import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import RecipeCard from '../components/RecipeCard';
import { api } from '../utils/api';
import { Heart, Bookmark, Sparkles, Star, TrendingUp } from 'lucide-react';

const Favorites = ({ onNavigate }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    setLoading(true);
    const response = await api.getFavorites();
    if (response.recipes) {
      setRecipes(response.recipes);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleUnfavorite = async (recipeId) => {
    await api.unfavoriteRecipe(recipeId);
    fetchFavorites();
  };

  const totalLikes = recipes.reduce((sum, r) => sum + (r.recipe_likes?.[0]?.count || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      <Navbar currentPage="favorites" onNavigate={onNavigate} />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 py-12 mb-8 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-5 left-1/4 text-5xl animate-bounce" style={{ animationDuration: '4s' }}>⭐</div>
          <div className="absolute top-10 right-1/4 text-4xl animate-bounce" style={{ animationDuration: '5s', animationDelay: '1s' }}>💛</div>
          <div className="absolute bottom-5 left-1/3 text-4xl animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '0.5s' }}>🌟</div>
          <div className="absolute bottom-8 right-1/3 text-3xl animate-bounce" style={{ animationDuration: '5.5s', animationDelay: '1.5s' }}>✨</div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium mb-4">
              <Heart className="h-4 w-4 fill-current" />
              Your Saved Collection
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Favorite Recipes
            </h1>
            <p className="text-yellow-100 text-lg">
              {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'} you love ❤️
            </p>
          </div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="url(#gradient)" fillOpacity="0.2"/>
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="1440" y2="0">
                <stop offset="0%" stopColor="#eab308"/>
                <stop offset="50%" stopColor="#f97316"/>
                <stop offset="100%" stopColor="#ef4444"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block relative">
              <div className="w-16 h-16 border-4 border-yellow-200 border-t-yellow-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-2xl animate-pulse">
                ⭐
              </div>
            </div>
            <p className="text-gray-600 mt-4 text-lg">Loading your favorites...</p>
          </div>
        ) : recipes.length > 0 ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-yellow-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-3 rounded-xl">
                    <Bookmark className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{recipes.length}</p>
                    <p className="text-sm text-gray-600">Saved Recipes</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-yellow-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-pink-400 to-red-500 p-3 rounded-xl">
                    <Heart className="h-6 w-6 text-white fill-current" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{totalLikes}</p>
                    <p className="text-sm text-gray-600">Total Likes</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-yellow-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-purple-400 to-indigo-500 p-3 rounded-xl">
                    <Star className="h-6 w-6 text-white fill-current" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">Premium</p>
                    <p className="text-sm text-gray-600">Collection</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Banner */}
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-200 rounded-2xl p-4 mb-8 flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-orange-600 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Pro Tip:</span> Click the bookmark icon again to remove recipes from your favorites
              </p>
            </div>

            {/* Recipes Grid */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Collection</h2>
              <p className="text-gray-600">Recipes you've bookmarked for later</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <div key={recipe.id} className="relative group">
                  <RecipeCard
                    recipe={recipe}
                    onViewDetails={(id) => onNavigate('recipe-details', { recipeId: id })}
                    onLike={() => {}}
                    onFavorite={handleUnfavorite}
                    isLiked={false}
                    isFavorited={true}
                  />
                  {/* Favorite Badge */}
                  <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-md">
                    <Star className="h-3 w-3 fill-current" />
                    Favorite
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="inline-block mb-6 relative">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-5xl shadow-lg animate-bounce">
                ⭐
              </div>
              <div className="absolute -top-2 -right-2 text-3xl animate-pulse">
                💛
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">No Favorites Yet</h2>
            <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
              Start building your collection by bookmarking recipes you love!
            </p>
            <button
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-yellow-600 hover:via-orange-600 hover:to-red-600 transition-all transform hover:scale-105 shadow-lg"
            >
              <TrendingUp className="h-5 w-5" />
              Explore Recipes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;