import { Heart, MessageCircle, Bookmark, ChefHat, Clock, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RecipeCard = ({ recipe, onViewDetails, onLike, onFavorite, isLiked, isFavorited }) => {
  const { user } = useAuth();
  const likesCount = recipe.recipe_likes?.[0]?.count || 0;
  const commentsCount = recipe.recipe_comments?.[0]?.count || 0;

  const isOwnRecipe = recipe.users?.id === user?.id;

  return (
    <div className={`group bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border ${
      isOwnRecipe ? 'ring-2 ring-orange-400 border-orange-200 bg-gradient-to-br from-orange-50 to-white' : 'border-gray-100 shadow-md'
    }`}>
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <div
          className="h-52 bg-gradient-to-br from-gray-100 to-gray-200 bg-cover bg-center cursor-pointer transition-transform duration-500 group-hover:scale-110"
          style={{
            backgroundImage: recipe.image_url
              ? `url(${recipe.image_url})`
              : 'linear-gradient(135deg, #fef3c7 0%, #fcd34d 100%)',
          }}
          onClick={() => onViewDetails(recipe.id)}
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Own Recipe Badge */}
        {isOwnRecipe && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
            <ChefHat className="h-3.5 w-3.5" />
            Your Recipe
          </div>
        )}

        {/* Quick View Button */}
        <button
          onClick={() => onViewDetails(recipe.id)}
          className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-xl text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hover:bg-white shadow-lg"
        >
          View Recipe
        </button>
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Title */}
        <h3
          className="text-xl font-bold text-gray-800 mb-2 cursor-pointer hover:text-orange-600 transition-colors line-clamp-2"
          onClick={() => onViewDetails(recipe.id)}
        >
          {recipe.title}
        </h3>

        {/* Author */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {recipe.users?.username?.charAt(0).toUpperCase() || '?'}
          </div>
          <p className="text-sm text-gray-600 font-medium">
            {recipe.users?.id === user?.id ? (
              <span className="text-orange-600">You</span>
            ) : (
              recipe.users?.username || 'Anonymous'
            )}
          </p>
        </div>

        {/* Ingredients Preview */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {recipe.ingredients.substring(0, 100)}...
        </p>

        {/* Actions Section */}
        {user && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4">
              {/* Like Button */}
              <button
                onClick={() => onLike(recipe.id)}
                className={`flex items-center gap-1.5 transition-all transform hover:scale-110 ${
                  isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                }`}
              >
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''} transition-all`} />
                <span className="text-sm font-semibold">{likesCount}</span>
              </button>

              {/* Comments Button */}
              <button
                onClick={() => onViewDetails(recipe.id)}
                className="flex items-center gap-1.5 text-gray-500 hover:text-blue-500 transition-all transform hover:scale-110"
              >
                <MessageCircle className="h-5 w-5" />
                <span className="text-sm font-semibold">{commentsCount}</span>
              </button>
            </div>

            {/* Favorite Button */}
            <button
              onClick={() => onFavorite(recipe.id)}
              className={`p-2 rounded-xl transition-all transform hover:scale-110 ${
                isFavorited 
                  ? 'text-yellow-500 bg-yellow-50' 
                  : 'text-gray-500 hover:text-yellow-500 hover:bg-yellow-50'
              }`}
            >
              <Bookmark className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;