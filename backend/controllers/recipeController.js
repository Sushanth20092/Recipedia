import { supabase } from '../config/supabase.js';

export const getAllRecipes = async (req, res) => {
  try {
    const { search } = req.query;
    let query = supabase
      .from('recipes')
      .select(`
        *,
        users!recipes_created_by_fkey(id, username),
        recipe_likes(count),
        recipe_comments(count)
      `)
      .order('created_at', { ascending: false });

    if (search) {
      query = query.or(`title.ilike.%${search}%,ingredients.ilike.%${search}%`);
    }

    const { data: recipes, error } = await query;

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch recipes' });
    }

    res.json({ recipes });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: recipe, error } = await supabase
      .from('recipes')
      .select(`
        *,
        users!recipes_created_by_fkey(id, username),
        recipe_likes(count),
        recipe_comments(
          id,
          comment,
          created_at,
          users!recipe_comments_user_id_fkey(id, username)
        )
      `)
      .eq('id', id)
      .maybeSingle();

    if (error || !recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.json({ recipe });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const createRecipe = async (req, res) => {
  try {
    const { title, ingredients, steps, image_url } = req.body;

    if (!title || !ingredients || !steps) {
      return res.status(400).json({ error: 'Title, ingredients, and steps are required' });
    }

    const { data: recipe, error } = await supabase
      .from('recipes')
      .insert([{
        title,
        ingredients,
        steps,
        image_url: image_url || null,
        created_by: req.userId,
      }])
      .select(`
        *,
        users!recipes_created_by_fkey(id, username)
      `)
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to create recipe' });
    }

    res.status(201).json({ recipe });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, ingredients, steps, image_url } = req.body;

    const { data: existingRecipe } = await supabase
      .from('recipes')
      .select('created_by')
      .eq('id', id)
      .maybeSingle();

    if (!existingRecipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    if (existingRecipe.created_by !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized to update this recipe' });
    }

    const { data: recipe, error } = await supabase
      .from('recipes')
      .update({ title, ingredients, steps, image_url })
      .eq('id', id)
      .select(`
        *,
        users!recipes_created_by_fkey(id, username)
      `)
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to update recipe' });
    }

    res.json({ recipe });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: existingRecipe } = await supabase
      .from('recipes')
      .select('created_by')
      .eq('id', id)
      .maybeSingle();

    if (!existingRecipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    if (existingRecipe.created_by !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized to delete this recipe' });
    }

    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({ error: 'Failed to delete recipe' });
    }

    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getMyRecipes = async (req, res) => {
  try {
    const { data: recipes, error } = await supabase
      .from('recipes')
      .select(`
        *,
        users!recipes_created_by_fkey(id, username),
        recipe_likes(count),
        recipe_comments(count)
      `)
      .eq('created_by', req.userId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch recipes' });
    }

    res.json({ recipes });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const likeRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;

    const { data: existingLike } = await supabase
      .from('recipe_likes')
      .select('id')
      .eq('recipe_id', recipeId)
      .eq('user_id', req.userId)
      .maybeSingle();

    if (existingLike) {
      return res.status(400).json({ error: 'Recipe already liked' });
    }

    const { error } = await supabase
      .from('recipe_likes')
      .insert([{ recipe_id: recipeId, user_id: req.userId }]);

    if (error) {
      return res.status(500).json({ error: 'Failed to like recipe' });
    }

    res.status(201).json({ message: 'Recipe liked successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const unlikeRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;

    const { error } = await supabase
      .from('recipe_likes')
      .delete()
      .eq('recipe_id', recipeId)
      .eq('user_id', req.userId);

    if (error) {
      return res.status(500).json({ error: 'Failed to unlike recipe' });
    }

    res.json({ message: 'Recipe unliked successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const addComment = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).json({ error: 'Comment text is required' });
    }

    const { data: newComment, error } = await supabase
      .from('recipe_comments')
      .insert([{ recipe_id: recipeId, user_id: req.userId, comment }])
      .select(`
        *,
        users!recipe_comments_user_id_fkey(id, username)
      `)
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to add comment' });
    }

    res.status(201).json({ comment: newComment });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const { data: existingComment } = await supabase
      .from('recipe_comments')
      .select('user_id')
      .eq('id', commentId)
      .maybeSingle();

    if (!existingComment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (existingComment.user_id !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized to delete this comment' });
    }

    const { error } = await supabase
      .from('recipe_comments')
      .delete()
      .eq('id', commentId);

    if (error) {
      return res.status(500).json({ error: 'Failed to delete comment' });
    }

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const favoriteRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;

    const { data: existingFavorite } = await supabase
      .from('recipe_favorites')
      .select('id')
      .eq('recipe_id', recipeId)
      .eq('user_id', req.userId)
      .maybeSingle();

    if (existingFavorite) {
      return res.status(400).json({ error: 'Recipe already in favorites' });
    }

    const { error } = await supabase
      .from('recipe_favorites')
      .insert([{ recipe_id: recipeId, user_id: req.userId }]);

    if (error) {
      return res.status(500).json({ error: 'Failed to add to favorites' });
    }

    res.status(201).json({ message: 'Recipe added to favorites' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const unfavoriteRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;

    const { error } = await supabase
      .from('recipe_favorites')
      .delete()
      .eq('recipe_id', recipeId)
      .eq('user_id', req.userId);

    if (error) {
      return res.status(500).json({ error: 'Failed to remove from favorites' });
    }

    res.json({ message: 'Recipe removed from favorites' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const { data: favorites, error } = await supabase
      .from('recipe_favorites')
      .select(`
        recipe_id,
        recipes!recipe_favorites_recipe_id_fkey(
          *,
          users!recipes_created_by_fkey(id, username),
          recipe_likes(count),
          recipe_comments(count)
        )
      `)
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch favorites' });
    }

    const recipes = favorites.map(f => f.recipes);

    res.json({ recipes });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getLikes = async (req, res) => {
  try {
    const { data: likes, error } = await supabase
      .from('recipe_likes')
      .select('recipe_id')
      .eq('user_id', req.userId);

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch likes' });
    }

    const recipeIds = likes.map((l) => l.recipe_id);
    res.json({ recipeIds });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const fileName = `${Date.now()}-${req.file.originalname}`;
    const fileBuffer = req.file.buffer;

    const { data, error } = await supabase.storage
      .from('recipe-images')
      .upload(fileName, fileBuffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (error) {
      return res.status(500).json({ error: 'Failed to upload image' });
    }

    const { data: urlData } = supabase.storage
      .from('recipe-images')
      .getPublicUrl(data.path);

    res.json({ image_url: urlData.publicUrl });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
