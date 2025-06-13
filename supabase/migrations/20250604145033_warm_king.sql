/*
  # Add avatar_url to profiles table

  1. Changes
    - Add avatar_url column to profiles table
*/

-- Add avatar_url column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE profiles 
    ADD COLUMN avatar_url text;
  END IF;
END $$;