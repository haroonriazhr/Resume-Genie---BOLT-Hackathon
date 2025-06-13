/*
  # Create resumes table and policies

  1. New Tables
    - `resumes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `content` (text)
      - `title` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on resumes table
    - Add policies for CRUD operations
*/

-- Create resumes table
CREATE TABLE IF NOT EXISTS resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  content text NOT NULL,
  title text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'resumes' AND policyname = 'Users can read own resumes'
  ) THEN
    CREATE POLICY "Users can read own resumes"
      ON resumes
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'resumes' AND policyname = 'Users can create resumes'
  ) THEN
    CREATE POLICY "Users can create resumes"
      ON resumes
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'resumes' AND policyname = 'Users can update own resumes'
  ) THEN
    CREATE POLICY "Users can update own resumes"
      ON resumes
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'resumes' AND policyname = 'Users can delete own resumes'
  ) THEN
    CREATE POLICY "Users can delete own resumes"
      ON resumes
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;