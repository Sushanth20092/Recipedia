import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { api } from '../utils/api';

const RecipeForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    ingredients: initialData?.ingredients || '',
    steps: initialData?.steps || '',
    image_url: initialData?.image_url || '',
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const response = await api.uploadImage(file);
      if (response.image_url) {
        setFormData({ ...formData, image_url: response.image_url });
      } else {
        setError(response.error || 'Failed to upload image');
      }
    } catch (err) {
      setError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.ingredients || !formData.steps) {
      setError('Please fill in all required fields');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Recipe Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="Enter recipe title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ingredients
        </label>
        <textarea
          value={formData.ingredients}
          onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="List all ingredients (one per line)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Instructions
        </label>
        <textarea
          value={formData.steps}
          onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
          rows={8}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="Enter step-by-step instructions"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Recipe Image
        </label>
        {formData.image_url ? (
          <div className="relative">
            <img
              src={formData.image_url}
              alt="Recipe preview"
              className="w-full h-64 object-cover rounded-md"
            />
            <button
              type="button"
              onClick={() => setFormData({ ...formData, image_url: '' })}
              className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
              disabled={uploading}
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="h-12 w-12 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">
                {uploading ? 'Uploading...' : 'Click to upload image'}
              </span>
            </label>
          </div>
        )}
      </div>

      <div className="flex space-x-4">
        <button
          type="submit"
          className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors"
        >
          {initialData ? 'Update Recipe' : 'Create Recipe'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default RecipeForm;
