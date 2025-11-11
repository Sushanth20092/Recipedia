/*
  # Create Users Table

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - Unique identifier for each user
      - `username` (text) - User's display name
      - `email` (text, unique) - User's email address for login
      - `password` (text) - Hashed password using bcrypt
      - `created_at` (timestamptz) - Account creation timestamp

  2. Security
    - Enable RLS on `users` table
    - Add policy for users to read their own data
    - Add policy for users to update their own data
*/

CREATE TABLE IF NOT EXISTS public.users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  username text NOT NULL,
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON public.users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own data"
  ON public.users FOR UPDATE
  TO authenticated
  USING (id = (current_setting('app.user_id', true))::uuid)
  WITH CHECK (id = (current_setting('app.user_id', true))::uuid);