/*
  # Create Recipe Interaction Tables

  1. New Tables
    - `recipe_likes`
      - `id` (uuid, primary key)
      - `recipe_id` (uuid) - Foreign key to recipes
      - `user_id` (uuid) - Foreign key to users
      - `created_at` (timestamptz)
      - Unique constraint on (recipe_id, user_id) - one like per user per recipe
    
    - `recipe_comments`
      - `id` (uuid, primary key)
      - `recipe_id` (uuid) - Foreign key to recipes
      - `user_id` (uuid) - Foreign key to users
      - `comment` (text) - Comment content
      - `created_at` (timestamptz)
    
    - `recipe_favorites`
      - `id` (uuid, primary key)
      - `recipe_id` (uuid) - Foreign key to recipes
      - `user_id` (uuid) - Foreign key to users
      - `created_at` (timestamptz)
      - Unique constraint on (recipe_id, user_id) - one favorite per user per recipe

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read all interactions
    - Add policies for users to manage only their own interactions
*/

CREATE TABLE IF NOT EXISTS public.recipe_likes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id uuid REFERENCES public.recipes(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(recipe_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.recipe_comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id uuid REFERENCES public.recipes(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  comment text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.recipe_favorites (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id uuid REFERENCES public.recipes(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(recipe_id, user_id)
);

ALTER TABLE public.recipe_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read likes"
  ON public.recipe_likes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert likes"
  ON public.recipe_likes FOR INSERT
  TO authenticated
  WITH CHECK ((current_setting('app.user_id', true))::uuid = user_id);

CREATE POLICY "Users can delete own likes"
  ON public.recipe_likes FOR DELETE
  TO authenticated
  USING ((current_setting('app.user_id', true))::uuid = user_id);

CREATE POLICY "Anyone can read comments"
  ON public.recipe_comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert comments"
  ON public.recipe_comments FOR INSERT
  TO authenticated
  WITH CHECK ((current_setting('app.user_id', true))::uuid = user_id);

CREATE POLICY "Users can delete own comments"
  ON public.recipe_comments FOR DELETE
  TO authenticated
  USING ((current_setting('app.user_id', true))::uuid = user_id);

CREATE POLICY "Anyone can read favorites"
  ON public.recipe_favorites FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert favorites"
  ON public.recipe_favorites FOR INSERT
  TO authenticated
  WITH CHECK ((current_setting('app.user_id', true))::uuid = user_id);

CREATE POLICY "Users can delete own favorites"
  ON public.recipe_favorites FOR DELETE
  TO authenticated
  USING ((current_setting('app.user_id', true))::uuid = user_id);