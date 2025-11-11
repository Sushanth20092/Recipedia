import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ChefHat, LogOut, Home, PlusCircle, BookMarked, User, Menu, X } from 'lucide-react';

const Navbar = ({ currentPage, onNavigate }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'add-recipe', label: 'Add Recipe', icon: PlusCircle },
    { id: 'my-recipes', label: 'My Recipes', icon: User },
    { id: 'favorites', label: 'Favorites', icon: BookMarked },
  ];

  return (
    <nav className="bg-white/70 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-50/50 via-transparent to-red-50/50 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => user && onNavigate('home')}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl blur opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gradient-to-br from-orange-500 to-red-500 p-2.5 rounded-2xl transform group-hover:scale-110 transition-transform">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Recipedia
              </span>
              <span className="text-[10px] text-gray-500 -mt-0.5 tracking-wide">CULINARY COMMUNITY</span>
            </div>
          </div>

          {user && (
            <>
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-2">
                {/* Nav Items */}
                <div className="flex items-center gap-1 bg-gray-100/50 rounded-2xl p-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => onNavigate(item.id)}
                        className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          isActive
                            ? 'text-white'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {isActive && (
                          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg" />
                        )}
                        <Icon className={`h-4 w-4 relative z-10 ${isActive ? 'text-white' : ''}`} />
                        <span className="relative z-10">{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* User Section */}
                <div className="flex items-center gap-3 ml-2 pl-4 border-l border-gray-200">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200/50">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-400 via-red-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-gray-800">{user.username}</span>
                      <span className="text-[10px] text-gray-500">Chef</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden lg:inline">Logout</span>
                  </button>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6 text-gray-700" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-700" />
                )}
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        {user && mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-lg">
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </button>
                );
              })}
              
              <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 via-red-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800">{user.username}</span>
                    <span className="text-xs text-gray-500">Chef</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;