-- Create Gym Branding Table
-- Each gym owner (auth.users) has their own branding

CREATE TABLE IF NOT EXISTS public.gym_branding (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    gym_name TEXT NOT NULL DEFAULT 'Your Gym',
    logo_url TEXT,
    primary_color TEXT DEFAULT '#3b82f6',
    secondary_color TEXT DEFAULT '#1e40af',
    address TEXT,
    contact_number TEXT,
    website_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gym_branding ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own branding
CREATE POLICY "Users can view own branding" 
ON public.gym_branding 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Policy: Users can insert their own branding
CREATE POLICY "Users can insert own branding" 
ON public.gym_branding 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own branding
CREATE POLICY "Users can update own branding" 
ON public.gym_branding 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

-- Function to auto-create branding on user signup
CREATE OR REPLACE FUNCTION public.create_branding_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.gym_branding (user_id, gym_name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', 'Your Gym'));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create branding when new user signs up
DROP TRIGGER IF EXISTS on_auth_user_created_branding ON auth.users;
CREATE TRIGGER on_auth_user_created_branding
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.create_branding_for_new_user();

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_gym_branding_user_id ON public.gym_branding(user_id);
