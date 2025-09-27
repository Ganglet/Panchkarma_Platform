-- Fix RLS policies to allow viewing practitioner profiles
-- This allows users to see practitioner profiles for booking appointments

-- Add policy to allow viewing practitioner profiles
CREATE POLICY "Users can view practitioner profiles" ON profiles
FOR SELECT
TO public
USING (user_type = 'practitioner');

-- Also allow viewing all profiles for authenticated users (optional, more permissive)
-- Uncomment the line below if you want to allow viewing all profiles
-- CREATE POLICY "Authenticated users can view all profiles" ON profiles
-- FOR SELECT
-- TO authenticated
-- USING (true);

-- Verify the policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles';