-- ========================================
-- COMPLETE DATABASE POPULATION SCRIPT
-- Run this in Supabase SQL Editor to populate all tables
-- ========================================

-- 1. INSERT TRAINERS
INSERT INTO public.trainers (id, name, photo, specialization) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Sarah Johnson', 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=150&h=150&fit=crop', 'Strength & Conditioning'),
('550e8400-e29b-41d4-a716-446655440002', 'Michael Chen', 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&h=150&fit=crop', 'CrossFit & HIIT'),
('550e8400-e29b-41d4-a716-446655440003', 'Emily Rodriguez', 'https://images.unsplash.com/photo-1595078475328-1ab05d0a6a0e?w=150&h=150&fit=crop', 'Yoga & Flexibility'),
('550e8400-e29b-41d4-a716-446655440004', 'David Kim', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop', 'Powerlifting');

-- 2. INSERT MEMBERS
INSERT INTO public.members (id, name, email, phone, address, emergency_contact, plan, status, start_date, expiry_date, payment_due) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'John Doe', 'john.doe@example.com', '+1234567890', '123 Main St', '+1234567899', '12-month-premium', 'active', '2024-01-01', '2025-01-01', 0),
('650e8400-e29b-41d4-a716-446655440002', 'Jane Smith', 'jane.smith@example.com', '+1234567891', '456 Oak Ave', '+1234567898', '6-month-standard', 'active', '2024-06-01', '2024-12-01', 500),
('650e8400-e29b-41d4-a716-446655440003', 'Bob Wilson', 'bob.wilson@example.com', '+1234567892', '789 Pine Rd', '+1234567897', '3-month-basic', 'trial', '2024-11-01', '2025-02-01', 0),
('650e8400-e29b-41d4-a716-446655440004', 'Alice Brown', 'alice.brown@example.com', '+1234567893', '321 Elm St', '+1234567896', '1-month-trial', 'expired', '2024-10-01', '2024-11-01', 1000);

-- 3. INSERT WORKOUTS
INSERT INTO public.workouts (id, name, body_part, difficulty, equipment, duration, trainer_id, thumbnail, video_url, usage_count) VALUES
('750e8400-e29b-41d4-a716-446655440001', 'Chest Power Builder', 'chest', 'intermediate', 'free-weights', 45, '550e8400-e29b-41d4-a716-446655440001', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop', 'https://www.youtube.com/watch?v=IODxDxX7oi4', 125),
('750e8400-e29b-41d4-a716-446655440002', 'Back Strength Training', 'back', 'advanced', 'mixed', 60, '550e8400-e29b-41d4-a716-446655440004', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop', NULL, 98),
('750e8400-e29b-41d4-a716-446655440003', 'Leg Day Destroyer', 'legs', 'intermediate', 'free-weights', 55, '550e8400-e29b-41d4-a716-446655440001', 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=400&h=300&fit=crop', NULL, 156),
('750e8400-e29b-41d4-a716-446655440004', 'Full Body HIIT', 'full-body', 'intermediate', 'bodyweight', 30, '550e8400-e29b-41d4-a716-446655440002', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&h=300&fit=crop', 'https://www.youtube.com/watch?v=ml6cT4AZdqI', 203),
('750e8400-e29b-41d4-a716-446655440005', 'Arm Blaster', 'arms', 'beginner', 'free-weights', 35, '550e8400-e29b-41d4-a716-446655440001', 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop', NULL, 87),
('750e8400-e29b-41d4-a716-446655440006', 'Core Crusher', 'core', 'intermediate', 'bodyweight', 25, '550e8400-e29b-41d4-a716-446655440002', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop', NULL, 112),
('750e8400-e29b-41d4-a716-446655440007', 'Shoulder Sculpt', 'shoulders', 'intermediate', 'free-weights', 40, '550e8400-e29b-41d4-a716-446655440001', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop', NULL, 94);

-- 4. INSERT WORKOUT EXERCISES
-- Chest Power Builder Exercises
INSERT INTO public.workout_exercises (workout_id, name, sets, reps, rest, notes, order_index, animation_url) VALUES
('750e8400-e29b-41d4-a716-446655440001', 'Barbell Bench Press', 4, '8-10', '120s', 'Keep your feet planted', 1, NULL),
('750e8400-e29b-41d4-a716-446655440001', 'Incline Dumbbell Press', 3, '10-12', '90s', 'Control the descent', 2, NULL),
('750e8400-e29b-41d4-a716-446655440001', 'Cable Flyes', 3, '12-15', '60s', 'Squeeze at the top', 3, NULL),
('750e8400-e29b-41d4-a716-446655440001', 'Push-ups', 3, '15-20', '60s', 'Full range of motion', 4, NULL);

-- Back Strength Training Exercises
INSERT INTO public.workout_exercises (workout_id, name, sets, reps, rest, notes, order_index, animation_url) VALUES
('750e8400-e29b-41d4-a716-446655440002', 'Deadlifts', 4, '6-8', '180s', 'Keep core tight', 1, NULL),
('750e8400-e29b-41d4-a716-446655440002', 'Pull-ups', 4, '8-10', '90s', 'Full hang', 2, NULL),
('750e8400-e29b-41d4-a716-446655440002', 'Barbell Rows', 4, '8-10', '120s', 'Pull to lower chest', 3, NULL),
('750e8400-e29b-41d4-a716-446655440002', 'Lat Pulldown', 3, '10-12', '60s', 'Slow and controlled', 4, NULL);

-- Leg Day Destroyer Exercises
INSERT INTO public.workout_exercises (workout_id, name, sets, reps, rest, notes, order_index, animation_url) VALUES
('750e8400-e29b-41d4-a716-446655440003', 'Squats', 4, '8-12', '120s', 'Go below parallel', 1, NULL),
('750e8400-e29b-41d4-a716-446655440003', 'Romanian Deadlifts', 3, '10-12', '90s', 'Feel the hamstrings', 2, NULL),
('750e8400-e29b-41d4-a716-446655440003', 'Leg Press', 3, '12-15', '90s', 'Full range', 3, NULL),
('750e8400-e29b-41d4-a716-446655440003', 'Lunges', 3, '10-12 each', '60s', 'Alternate legs', 4, NULL),
('750e8400-e29b-41d4-a716-446655440003', 'Calf Raises', 4, '15-20', '45s', 'Hold at top', 5, NULL);

-- Full Body HIIT Exercises
INSERT INTO public.workout_exercises (workout_id, name, sets, reps, rest, notes, order_index, animation_url) VALUES
('750e8400-e29b-41d4-a716-446655440004', 'Burpees', 4, '15', '30s', 'Explosive movement', 1, NULL),
('750e8400-e29b-41d4-a716-446655440004', 'Mountain Climbers', 4, '30s', '30s', 'Fast pace', 2, NULL),
('750e8400-e29b-41d4-a716-446655440004', 'Jump Squats', 4, '12', '30s', 'Land softly', 3, NULL),
('750e8400-e29b-41d4-a716-446655440004', 'High Knees', 4, '30s', '30s', 'Drive knees up', 4, NULL);

-- Arm Blaster Exercises
INSERT INTO public.workout_exercises (workout_id, name, sets, reps, rest, notes, order_index, animation_url) VALUES
('750e8400-e29b-41d4-a716-446655440005', 'Barbell Curls', 3, '10-12', '60s', 'No swinging', 1, NULL),
('750e8400-e29b-41d4-a716-446655440005', 'Tricep Dips', 3, '10-12', '60s', '90 degree angle', 2, NULL),
('750e8400-e29b-41d4-a716-446655440005', 'Hammer Curls', 3, '12-15', '45s', 'Neutral grip', 3, NULL),
('750e8400-e29b-41d4-a716-446655440005', 'Overhead Tricep Extension', 3, '12-15', '45s', 'Keep elbows in', 4, NULL);

-- Core Crusher Exercises
INSERT INTO public.workout_exercises (workout_id, name, sets, reps, rest, notes, order_index, animation_url) VALUES
('750e8400-e29b-41d4-a716-446655440006', 'Plank', 3, '60s', '45s', 'Hold position', 1, NULL),
('750e8400-e29b-41d4-a716-446655440006', 'Russian Twists', 3, '20-30', '30s', 'Control the movement', 2, NULL),
('750e8400-e29b-41d4-a716-446655440006', 'Bicycle Crunches', 3, '20-30', '30s', 'Slow and controlled', 3, NULL),
('750e8400-e29b-41d4-a716-446655440006', 'Leg Raises', 3, '12-15', '45s', 'Lower slowly', 4, NULL);

-- Shoulder Sculpt Exercises
INSERT INTO public.workout_exercises (workout_id, name, sets, reps, rest, notes, order_index, animation_url) VALUES
('750e8400-e29b-41d4-a716-446655440007', 'Overhead Press', 4, '8-10', '90s', 'Press straight up', 1, NULL),
('750e8400-e29b-41d4-a716-446655440007', 'Lateral Raises', 3, '12-15', '60s', 'Slight bend in elbows', 2, NULL),
('750e8400-e29b-41d4-a716-446655440007', 'Front Raises', 3, '12-15', '60s', 'Stop at eye level', 3, NULL),
('750e8400-e29b-41d4-a716-446655440007', 'Face Pulls', 3, '15-20', '45s', 'Pull to face level', 4, NULL);

-- 5. INSERT WORKOUT ASSIGNMENTS
INSERT INTO public.workout_assignments (member_id, workout_id, status) VALUES
('650e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', 'active'),
('650e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440003', 'active'),
('650e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440004', 'active'),
('650e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440005', 'active');

-- 6. INSERT DIET PLANS
INSERT INTO public.diet_plans (id, name, description, diet_type, diet_goal, category, duration, target_calories, macros_protein, macros_carbs, macros_fat, water_intake, trainer_id, thumbnail) VALUES
('850e8400-e29b-41d4-a716-446655440001', 'Muscle Gain Pro', 'High protein plan for muscle building', 'non-vegetarian', 'muscle-gain', 'muscle-gain', 90, 3000, 200, 350, 100, 4.0, '550e8400-e29b-41d4-a716-446655440001', 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop'),
('850e8400-e29b-41d4-a716-446655440002', 'Fat Loss Express', 'Calorie deficit for weight loss', 'vegetarian', 'weight-loss', 'weight-loss', 60, 1800, 120, 180, 60, 3.5, '550e8400-e29b-41d4-a716-446655440003', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop');

-- 7. INSERT MEMBER ATTENDANCE (sample data)
INSERT INTO public.member_attendance (member_id, date, check_in_time, check_out_time) VALUES
('650e8400-e29b-41d4-a716-446655440001', CURRENT_DATE, '06:00:00', '07:30:00'),
('650e8400-e29b-41d4-a716-446655440001', CURRENT_DATE - INTERVAL '1 day', '06:00:00', '07:30:00'),
('650e8400-e29b-41d4-a716-446655440002', CURRENT_DATE, '18:00:00', NULL),
('650e8400-e29b-41d4-a716-446655440003', CURRENT_DATE - INTERVAL '2 days', '10:00:00', '11:30:00');

-- 8. INSERT MEMBER PAYMENTS (sample data)
INSERT INTO public.member_payments (member_id, amount, type, status, date, description) VALUES
('650e8400-e29b-41d4-a716-446655440001', 1200, 'membership', 'paid', '2024-01-01', '12-month premium membership'),
('650e8400-e29b-41d4-a716-446655440002', 500, 'membership', 'paid', '2024-06-01', '6-month standard membership'),
('650e8400-e29b-41d4-a716-446655440002', 500, 'membership', 'pending', CURRENT_DATE, 'Membership renewal'),
('650e8400-e29b-41d4-a716-446655440004', 1000, 'membership', 'failed', '2024-11-01', 'Membership renewal - Payment failed');

-- ========================================
-- VERIFICATION QUERIES
-- Run these to verify data was inserted
-- ========================================

-- Check trainers
-- SELECT COUNT(*) as trainer_count FROM public.trainers;

-- Check members  
-- SELECT COUNT(*) as member_count FROM public.members;

-- Check workouts
-- SELECT COUNT(*) as workout_count FROM public.workouts;

-- Check exercises
-- SELECT COUNT(*) as exercise_count FROM public.workout_exercises;

-- Check workout with exercises
-- SELECT 
--   w.name as workout_name,
--   COUNT(we.id) as exercise_count
-- FROM public.workouts w
-- LEFT JOIN public.workout_exercises we ON w.id = we.workout_id
-- GROUP BY w.id, w.name
-- ORDER BY w.name;

-- ========================================
-- UPDATE ANIMATION URLs
-- Assign your uploaded animations to exercises
-- ========================================

-- Update exercises with your actual animation file names
-- NOTE: Files are directly in bucket root, not in a subfolder
-- URL format: https://wylqgcpsuhnxcllkwjdx.supabase.co/storage/v1/object/public/exercise-animations/FILE_NAME.json

-- Example assignments - UPDATE THESE WITH YOUR ACTUAL FILE NAMES
UPDATE public.workout_exercises 
SET animation_url = 'https://wylqgcpsuhnxcllkwjdx.supabase.co/storage/v1/object/public/exercise-animations/Reverse%20Crunches.json'
WHERE name ILIKE '%crunch%' OR name ILIKE '%bicycle%';

UPDATE public.workout_exercises 
SET animation_url = 'https://wylqgcpsuhnxcllkwjdx.supabase.co/storage/v1/object/public/exercise-animations/Squat%20kicks.json'
WHERE name ILIKE '%squat%';

UPDATE public.workout_exercises 
SET animation_url = 'https://wylqgcpsuhnxcllkwjdx.supabase.co/storage/v1/object/public/exercise-animations/Push%20ups.json'
WHERE name ILIKE '%push%';

-- Add more specific mappings for your other 5 uploaded files:
-- UPDATE public.workout_exercises SET animation_url = 'https://wylqgcpsuhnxcllkwjdx.supabase.co/storage/v1/object/public/exercise-animations/YOUR_FILE_NAME.json' WHERE name ILIKE '%exercise_keyword%';

-- Assign a default animation to all remaining exercises without one
UPDATE public.workout_exercises 
SET animation_url = 'https://wylqgcpsuhnxcllkwjdx.supabase.co/storage/v1/object/public/exercise-animations/Reverse%20Crunches.json'
WHERE animation_url IS NULL;
