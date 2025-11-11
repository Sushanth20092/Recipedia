import { useState } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="relative group">
        {/* Glow effect on focus */}
        <div className={`absolute -inset-1 bg-gradient-to-r from-orange-400 via-red-400 to-orange-400 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity ${isFocused ? 'opacity-30' : ''}`} />
        
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <Search className={`h-5 w-5 transition-colors ${isFocused ? 'text-orange-500' : 'text-gray-400'}`} />
          </div>
          
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search recipes, ingredients, or cuisine..."
            className="w-full pl-12 pr-32 py-4 bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:bg-white transition-all shadow-sm hover:shadow-md"
          />

          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {searchTerm && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors group/clear"
              >
                <X className="h-4 w-4 text-gray-400 group-hover/clear:text-gray-600" />
              </button>
            )}
            
            <button
              onClick={handleSubmit}
              type="button"
              className="px-5 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Quick search suggestions */}
      {isFocused && !searchTerm && (
        <div className="mt-3 flex flex-wrap gap-2 animate-fadeIn">
          <span className="text-xs text-gray-500 mr-2">Popular:</span>
          {['Pasta', 'Chicken', 'Vegetarian', 'Dessert', 'Quick & Easy'].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => {
                setSearchTerm(tag);
                onSearch(tag);
              }}
              className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50 transition-all"
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;