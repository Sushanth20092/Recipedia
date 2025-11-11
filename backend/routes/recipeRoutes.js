import express from 'express';
import multer from 'multer';
import {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getMyRecipes,
  likeRecipe,
  unlikeRecipe,
  addComment,
  deleteComment,
  favoriteRecipe,
  unfavoriteRecipe,
  getFavorites,
  getLikes,
  uploadImage,
} from '../controllers/recipeController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', getAllRecipes);
router.get('/my-recipes', authMiddleware, getMyRecipes);
router.get('/favorites', authMiddleware, getFavorites);
router.get('/likes', authMiddleware, getLikes);
router.get('/:id', getRecipeById);
router.post('/', authMiddleware, createRecipe);
router.put('/:id', authMiddleware, updateRecipe);
router.delete('/:id', authMiddleware, deleteRecipe);

router.post('/:recipeId/like', authMiddleware, likeRecipe);
router.delete('/:recipeId/like', authMiddleware, unlikeRecipe);

router.post('/:recipeId/comment', authMiddleware, addComment);
router.delete('/comment/:commentId', authMiddleware, deleteComment);

router.post('/:recipeId/favorite', authMiddleware, favoriteRecipe);
router.delete('/:recipeId/favorite', authMiddleware, unfavoriteRecipe);

router.post('/upload-image', authMiddleware, upload.single('image'), uploadImage);

export default router;
