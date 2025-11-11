import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Sparkles, TrendingUp, Clock } from 'lucide-react';

const Home = ({ onNavigate }) => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedRecipes, setLikedRecipes] = useState(new Set());
  const [favoritedRecipes, setFavoritedRecipes] = useState(new Set());

  const fetchRecipes = async (searchTerm = '') => {
    setLoading(true);
    const response = await api.getAllRecipes(searchTerm);
    if (response.recipes) {
      setRecipes(response.recipes);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  // Initialize liked and favorited sets for the current user
  useEffect(() => {
    let mounted = true;

    const initUserInteractions = async () => {
      if (!user) {
        // clear when not logged in
        if (mounted) {
          setLikedRecipes(new Set());
          setFavoritedRecipes(new Set());
        }
        return;
      }

      try {
        const favRes = await api.getFavorites();
        if (mounted && favRes.recipes) {
          setFavoritedRecipes(new Set(favRes.recipes.map((r) => r.id)));
        }

        const likesRes = await api.getLikes();
        if (mounted && likesRes.recipeIds) {
          setLikedRecipes(new Set(likesRes.recipeIds));
        }
      } catch (err) {
        // ignore for now
        console.error('Failed to initialize likes/favorites', err);
      }
    };

    initUserInteractions();

    return () => {
      mounted = false;
    };
  }, [user]);

  const handleLike = async (recipeId) => {
    if (!user) return;

    // optimistic update: toggle liked set and update recipe's like count locally
    const isCurrentlyLiked = likedRecipes.has(recipeId);

    // capture original count so we can rollback if needed
    const originalCount = recipes.find((r) => r.id === recipeId)?.recipe_likes?.[0]?.count || 0;

    // update recipes state optimistically
    setRecipes((prev) =>
      prev.map((r) => {
        if (r.id !== recipeId) return r;
        const newCount = isCurrentlyLiked ? Math.max(0, originalCount - 1) : originalCount + 1;
        return {
          ...r,
          recipe_likes: [{ count: newCount }],
        };
      })
    );

    if (isCurrentlyLiked) {
      setLikedRecipes((prev) => {
        const newSet = new Set(prev);
        newSet.delete(recipeId);
        return newSet;
      });

      const res = await api.unlikeRecipe(recipeId);
      if (res.error) {
        // rollback liked set and count
        setLikedRecipes((prev) => new Set(prev).add(recipeId));
        setRecipes((prev) =>
          prev.map((r) => (r.id === recipeId ? { ...r, recipe_likes: [{ count: originalCount }] } : r))
        );
      }
    } else {
      setLikedRecipes((prev) => new Set(prev).add(recipeId));

      const res = await api.likeRecipe(recipeId);
      if (res.error) {
        // rollback liked set and count
        setLikedRecipes((prev) => {
          const newSet = new Set(prev);
          newSet.delete(recipeId);
          return newSet;
        });
        setRecipes((prev) =>
          prev.map((r) => (r.id === recipeId ? { ...r, recipe_likes: [{ count: originalCount }] } : r))
        );
      }
    }
  };

  const handleFavorite = async (recipeId) => {
    if (!user) return;

    // optimistic update
    if (favoritedRecipes.has(recipeId)) {
      setFavoritedRecipes((prev) => {
        const newSet = new Set(prev);
        newSet.delete(recipeId);
        return newSet;
      });

      const res = await api.unfavoriteRecipe(recipeId);
      if (res.error) {
        // rollback
        setFavoritedRecipes((prev) => new Set(prev).add(recipeId));
      }
    } else {
      setFavoritedRecipes((prev) => new Set(prev).add(recipeId));

      const res = await api.favoriteRecipe(recipeId);
      if (res.error) {
        // rollback
        setFavoritedRecipes((prev) => {
          const newSet = new Set(prev);
          newSet.delete(recipeId);
          return newSet;
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <Navbar currentPage="home" onNavigate={onNavigate} />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 py-16 mb-12">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-1/4 text-6xl animate-bounce" style={{ animationDuration: '4s' }}>🍕</div>
          <div className="absolute top-20 right-1/4 text-5xl animate-bounce" style={{ animationDuration: '5s', animationDelay: '1s' }}>🍝</div>
          <div className="absolute bottom-10 left-1/3 text-5xl animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '0.5s' }}>🥗</div>
          <div className="absolute bottom-20 right-1/3 text-6xl animate-bounce" style={{ animationDuration: '5.5s', animationDelay: '1.5s' }}>🍰</div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              Welcome back, {user?.username}!
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
              Discover Amazing Recipes
            </h1>
            <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
              Explore thousands of delicious recipes from our culinary community
            </p>
            <SearchBar onSearch={fetchRecipes} />
          </div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="url(#gradient)" fillOpacity="0.2"/>
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="1440" y2="0">
                <stop offset="0%" stopColor="#f97316"/>
                <stop offset="100%" stopColor="#ef4444"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Stats/Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-orange-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-orange-400 to-red-500 p-3 rounded-xl">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{recipes.length}</p>
                <p className="text-sm text-gray-600">Total Recipes</p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-orange-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-400 to-purple-500 p-3 rounded-xl">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{favoritedRecipes.size}</p>
                <p className="text-sm text-gray-600">Your Favorites</p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-orange-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-green-400 to-teal-500 p-3 rounded-xl">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">Fresh</p>
                <p className="text-sm text-gray-600">Updated Daily</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recipes Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">All Recipes</h2>
          <p className="text-gray-600">Browse through our collection of delicious recipes</p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block relative">
              <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-2xl animate-pulse">
                🍳
              </div>
            </div>
            <p className="text-gray-600 mt-4 text-lg">Loading delicious recipes...</p>
          </div>
        ) : recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onViewDetails={(id) => onNavigate('recipe-details', { recipeId: id })}
                onLike={handleLike}
                onFavorite={handleFavorite}
                isLiked={likedRecipes.has(recipe.id)}
                isFavorited={favoritedRecipes.has(recipe.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No recipes found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or explore all recipes</p>
            <button
              onClick={() => fetchRecipes()}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 shadow-lg"
            >
              Show All Recipes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;