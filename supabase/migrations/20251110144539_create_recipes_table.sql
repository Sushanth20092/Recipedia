/*
  # Create Recipes Table

  1. New Tables
    - `recipes`
      - `id` (uuid, primary key) - Unique identifier for each recipe
      - `title` (text) - Recipe title/name
      - `ingredients` (text) - List of ingredients
      - `steps` (text) - Cooking instructions
      - `image_url` (text) - URL to recipe image in Supabase Storage
      - `created_by` (uuid) - Foreign key to users table
      - `created_at` (timestamptz) - Recipe creation timestamp

  2. Security
    - Enable RLS on `recipes` table
    - Add policy for public read access (all users can view recipes)
    - Add policy for authenticated users to insert their own recipes
    - Add policy for users to update only their own recipes
    - Add policy for users to delete only their own recipes
*/

CREATE TABLE IF NOT EXISTS public.recipes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  ingredients text NOT NULL,
  steps text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL
);

ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read recipes"
  ON public.recipes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert recipes"
  ON public.recipes FOR INSERT
  TO authenticated
  WITH CHECK ((current_setting('app.user_id', true))::uuid = created_by);

CREATE POLICY "Users can update own recipes"
  ON public.recipes FOR UPDATE
  TO authenticated
  USING ((current_setting('app.user_id', true))::uuid = created_by)
  WITH CHECK ((current_setting('app.user_id', true))::uuid = created_by);

CREATE POLICY "Users can delete own recipes"
  ON public.recipes FOR DELETE
  TO authenticated
  USING ((current_setting('app.user_id', true))::uuid = created_by);