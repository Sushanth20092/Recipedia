import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AddRecipe from './pages/AddRecipe';
import MyRecipes from './pages/MyRecipes';
import EditRecipe from './pages/EditRecipe';
import RecipeDetails from './pages/RecipeDetails';
import Favorites from './pages/Favorites';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('login');
  const [pageData, setPageData] = useState({});

  const navigate = (page, data = {}) => {
    setCurrentPage(page);
    setPageData(data);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user) {
    if (currentPage === 'register') {
      return <Register onNavigate={navigate} />;
    }
    return <Login onNavigate={navigate} />;
  }

  switch (currentPage) {
    case 'home':
      return <Home onNavigate={navigate} />;
    case 'add-recipe':
      return <AddRecipe onNavigate={navigate} />;
    case 'my-recipes':
      return <MyRecipes onNavigate={navigate} />;
    case 'edit-recipe':
      return <EditRecipe onNavigate={navigate} recipeId={pageData.recipeId} />;
    case 'recipe-details':
      return <RecipeDetails onNavigate={navigate} recipeId={pageData.recipeId} />;
    case 'favorites':
      return <Favorites onNavigate={navigate} />;
    default:
      return <Home onNavigate={navigate} />;
  }
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
