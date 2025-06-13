/*
  # Add updated_at column to resumes table

  1. Changes
    - Add updated_at column to resumes table
    - Add trigger to automatically update the updated_at timestamp
*/

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

-- Create trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_resumes_updated_at'
  ) THEN
    CREATE TRIGGER update_resumes_updated_at
    BEFORE UPDATE ON resumes
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();
  END IF;
END $$;