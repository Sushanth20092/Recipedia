const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  async register(username, email, password) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    return response.json();
  },

  async login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  async getProfile() {
    const response = await fetch(`${API_URL}/auth/profile`, {
      headers: getAuthHeader(),
    });
    return response.json();
  },

  async getAllRecipes(search = '') {
    const url = search ? `${API_URL}/recipes?search=${encodeURIComponent(search)}` : `${API_URL}/recipes`;
    const response = await fetch(url);
    return response.json();
  },

  async getRecipeById(id) {
    const response = await fetch(`${API_URL}/recipes/${id}`);
    return response.json();
  },

  async createRecipe(recipeData) {
    const response = await fetch(`${API_URL}/recipes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(recipeData),
    });
    return response.json();
  },

  async updateRecipe(id, recipeData) {
    const response = await fetch(`${API_URL}/recipes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(recipeData),
    });
    return response.json();
  },

  async deleteRecipe(id) {
    const response = await fetch(`${API_URL}/recipes/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return response.json();
  },

  async getMyRecipes() {
    const response = await fetch(`${API_URL}/recipes/my-recipes`, {
      headers: getAuthHeader(),
    });
    return response.json();
  },

  async likeRecipe(recipeId) {
    const response = await fetch(`${API_URL}/recipes/${recipeId}/like`, {
      method: 'POST',
      headers: getAuthHeader(),
    });
    return response.json();
  },

  async unlikeRecipe(recipeId) {
    const response = await fetch(`${API_URL}/recipes/${recipeId}/like`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return response.json();
  },

  async addComment(recipeId, comment) {
    const response = await fetch(`${API_URL}/recipes/${recipeId}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ comment }),
    });
    return response.json();
  },

  async deleteComment(commentId) {
    const response = await fetch(`${API_URL}/recipes/comment/${commentId}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return response.json();
  },

  async favoriteRecipe(recipeId) {
    const response = await fetch(`${API_URL}/recipes/${recipeId}/favorite`, {
      method: 'POST',
      headers: getAuthHeader(),
    });
    return response.json();
  },

  async unfavoriteRecipe(recipeId) {
    const response = await fetch(`${API_URL}/recipes/${recipeId}/favorite`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return response.json();
  },

  async getFavorites() {
    const response = await fetch(`${API_URL}/recipes/favorites`, {
      headers: getAuthHeader(),
    });
    return response.json();
  },

  async getLikes() {
    const response = await fetch(`${API_URL}/recipes/likes`, {
      headers: getAuthHeader(),
    });
    return response.json();
  },

  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_URL}/recipes/upload-image`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: formData,
    });
    return response.json();
  },
};
