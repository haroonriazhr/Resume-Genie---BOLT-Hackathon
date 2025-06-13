/*
  # Add template_id column to resumes table

  1. Changes
    - Add template_id column to resumes table to store which template was used
    - Set default value to 'professional' for existing resumes
    - Update existing resumes to have a template_id
*/

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

-- Update existing resumes to have template_id if they don't have one
UPDATE resumes 
SET template_id = 'professional' 
WHERE template_id IS NULL;

-- Make template_id not null for future records
ALTER TABLE resumes 
ALTER COLUMN template_id SET NOT NULL;