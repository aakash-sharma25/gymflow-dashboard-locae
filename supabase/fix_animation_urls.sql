-- Quick SQL to update ALL your animations with correct URLs
-- Replace the file names with your actual 8 uploaded files

-- First, clear any wrong URLs
UPDATE public.workout_exercises SET animation_url = NULL;

-- Then assign your animations to specific exercises
-- Replace these file names with your actual uploaded file names

-- Animation 1: Reverse Crunches
UPDATE public.workout_exercises 
SET animation_url = 'https://wylqgcpsuhnxcllkwjdx.supabase.co/storage/v1/object/public/exercise-animations/Reverse%20Crunches.json'
WHERE name ILIKE '%crunch%' OR name ILIKE '%bicycle%' OR name ILIKE '%russian%';

-- Animation 2: Squat kicks  
UPDATE public.workout_exercises 
SET animation_url = 'https://wylqgcpsuhnxcllkwjdx.supabase.co/storage/v1/object/public/exercise-animations/Squat%20kicks.json'
WHERE name ILIKE '%squat%';

-- Animation 3: Push ups
UPDATE public.workout_exercises 
SET animation_url = 'https://wylqgcpsuhnxcllkwjdx.supabase.co/storage/v1/object/public/exercise-animations/Push%20ups.json'
WHERE name ILIKE '%push%';

-- Animation 4-8: Add your other 5 files here
-- Example format (replace FILE_NAME with your actual file):
-- UPDATE public.workout_exercises 
-- SET animation_url = 'https://wylqgcpsuhnxcllkwjdx.supabase.co/storage/v1/object/public/exercise-animations/FILE_NAME.json'
-- WHERE name ILIKE '%keyword%';

-- List your 8 uploaded files here for reference:
-- 1. Reverse Crunches.json
-- 2. Squat kicks.json  
-- 3. Push ups.json
-- 4. __________.json
-- 5. __________.json
-- 6. __________.json
-- 7. __________.json
-- 8. __________.json

-- Set default animation for any exercises without one
UPDATE public.workout_exercises 
SET animation_url = 'https://wylqgcpsuhnxcllkwjdx.supabase.co/storage/v1/object/public/exercise-animations/Reverse%20Crunches.json'
WHERE animation_url IS NULL;

-- Verify assignments
SELECT 
  name,
  CASE 
    WHEN animation_url IS NULL THEN 'No Animation'
    ELSE 'Has Animation'
  END as status,
  animation_url
FROM workout_exercises
ORDER BY name;