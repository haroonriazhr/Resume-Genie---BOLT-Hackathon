/*
  # Create handle_updated_at function and ensure updated_at column works properly

  1. Changes
    - Create handle_updated_at() function if it doesn't exist
    - Ensure updated_at column exists on resumes table
    - Create trigger to automatically update updated_at timestamp
    - Set default values for existing records
*/

-- Create the handle_updated_at function if it doesn't exist
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'resumes' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE resumes
    ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Add template_id column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'resumes' AND column_name = 'template_id'
  ) THEN
    ALTER TABLE resumes
    ADD COLUMN template_id text DEFAULT 'professional';
  END IF;
END $$;

-- Update existing records to have updated_at = created_at if updated_at is null
UPDATE resumes 
SET updated_at = created_at 
WHERE updated_at IS NULL;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_resumes_updated_at ON resumes;

-- Create the trigger
CREATE TRIGGER update_resumes_updated_at
  BEFORE UPDATE ON resumes
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Ensure the updated_at column is not null for future records
ALTER TABLE resumes 
ALTER COLUMN updated_at SET DEFAULT now(),
ALTER COLUMN updated_at SET NOT NULL;
