-- Add animation_url column to workout_exercises table
ALTER TABLE public.workout_exercises 
ADD COLUMN IF NOT EXISTS animation_url TEXT;

-- Create storage bucket for exercise animations
INSERT INTO storage.buckets (id, name, public)
VALUES ('exercise-animations', 'exercise-animations', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on the bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'exercise-animations' );

CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'exercise-animations' );

CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'exercise-animations' );

CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'exercise-animations' );
