-- SQL Script to Insert Common Gym Exercises
-- Run this in Supabase SQL Editor to populate exercises for testing

-- Note: You'll need to replace 'YOUR_WORKOUT_ID' with actual workout IDs from your workouts table
-- Or create workouts first, then insert exercises

-- Common Exercises List (you can add animation_url later)
INSERT INTO public.workout_exercises (workout_id, name, sets, reps, rest, notes, order_index, animation_url) VALUES
-- Example workout exercises (replace workout_id with your actual workout IDs)
-- For testing purposes, these are sample exercises with placeholder workout_id
('00000000-0000-0000-0000-000000000000', 'Push-ups', 3, '12-15', '60s', 'Keep your back straight', 1, NULL),
('00000000-0000-0000-0000-000000000000', 'Squats', 4, '10-12', '90s', 'Go as low as comfortable', 2, NULL),
('00000000-0000-0000-0000-000000000000', 'Pull-ups', 3, '8-10', '90s', 'Full range of motion', 3, NULL),
('00000000-0000-0000-0000-000000000000', 'Bench Press', 4, '8-10', '120s', 'Control the weight', 4, NULL),
('00000000-0000-0000-0000-000000000000', 'Deadlifts', 4, '6-8', '180s', 'Keep your core tight', 5, NULL),
('00000000-0000-0000-0000-000000000000', 'Lunges', 3, '10-12 each', '60s', 'Alternate legs', 6, NULL),
('00000000-0000-0000-0000-000000000000', 'Plank', 3, '30-60s', '60s', 'Hold position', 7, NULL),
('00000000-0000-0000-0000-000000000000', 'Bicep Curls', 3, '12-15', '60s', 'Slow and controlled', 8, NULL),
('00000000-0000-0000-0000-000000000000', 'Tricep Dips', 3, '10-12', '60s', 'Elbows at 90 degrees', 9, NULL),
('00000000-0000-0000-0000-000000000000', 'Shoulder Press', 3, '10-12', '90s', 'Keep core engaged', 10, NULL),
('00000000-0000-0000-0000-000000000000', 'Leg Press', 4, '12-15', '90s', 'Full range of motion', 11, NULL),
('00000000-0000-0000-0000-000000000000', 'Lat Pulldown', 3, '10-12', '60s', 'Pull to chest level', 12, NULL),
('00000000-0000-0000-0000-000000000000', 'Crunches', 3, '15-20', '45s', 'Engage your core', 13, NULL),
('00000000-0000-0000-0000-000000000000', 'Russian Twists', 3, '20-30', '45s', 'Control the movement', 14, NULL),
('00000000-0000-0000-0000-000000000000', 'Mountain Climbers', 3, '30s', '45s', 'Fast pace', 15, NULL);

-- If you have specific workout IDs, use this pattern instead:
-- First, get your workout IDs by running:
-- SELECT id, name FROM public.workouts;

-- Then insert exercises for specific workouts like this:
-- INSERT INTO public.workout_exercises (workout_id, name, sets, reps, rest, notes, order_index, animation_url) VALUES
-- ('your-actual-workout-uuid-here', 'Exercise Name', 3, '12', '60s', 'Notes', 1, 'https://your-bucket-url/animation.json');

-- To assign animation URLs to all exercises (after uploading):
-- UPDATE public.workout_exercises 
-- SET animation_url = 'https://wylqgcpsuhnxcllkwjdx.supabase.co/storage/v1/object/public/exercise-animations/exercise_animations/squat_kicks.json'
-- WHERE animation_url IS NULL;

-- To assign specific animations to specific exercises by name:
-- UPDATE public.workout_exercises 
-- SET animation_url = 'https://wylqgcpsuhnxcllkwjdx.supabase.co/storage/v1/object/public/exercise-animations/exercise_animations/push_ups.json'
-- WHERE name ILIKE '%push%';

-- UPDATE public.workout_exercises 
-- SET animation_url = 'https://wylqgcpsuhnxcllkwjdx.supabase.co/storage/v1/object/public/exercise-animations/exercise_animations/squats.json'
-- WHERE name ILIKE '%squat%';
