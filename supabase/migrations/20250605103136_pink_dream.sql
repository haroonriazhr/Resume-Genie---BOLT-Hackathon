/*
  # Add DeepSeek API key to Supabase secrets

  1. Changes
    - Add DEEPSEEK_API_KEY to Supabase secrets
*/

-- Add DeepSeek API key to Supabase secrets
DO $$
BEGIN
  INSERT INTO vault.secrets (name, secret)
  VALUES (
    'DEEPSEEK_API_KEY',
    'sk-46e244e25961494980796a9e2cef6a8e'
  )
  ON CONFLICT (name) DO UPDATE
  SET secret = EXCLUDED.secret;
END $$;