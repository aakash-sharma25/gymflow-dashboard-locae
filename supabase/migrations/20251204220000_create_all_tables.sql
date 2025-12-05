-- Create Enums
CREATE TYPE public.app_role AS ENUM ('admin', 'trainer');
CREATE TYPE public.assignment_status AS ENUM ('active', 'completed', 'cancelled');
CREATE TYPE public.body_part AS ENUM ('chest', 'back', 'legs', 'arms', 'shoulders', 'core', 'full-body');
CREATE TYPE public.diet_category AS ENUM ('weight-loss', 'muscle-gain', 'maintenance', 'general');
CREATE TYPE public.diet_goal AS ENUM ('weight-loss', 'muscle-gain', 'maintenance', 'fat-loss', 'general-fitness');
CREATE TYPE public.diet_type AS ENUM ('vegetarian', 'non-vegetarian', 'vegan', 'keto', 'diabetic', 'gluten-free');
CREATE TYPE public.difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE public.equipment_type AS ENUM ('free-weights', 'machines', 'bodyweight', 'mixed');
CREATE TYPE public.meal_time AS ENUM ('Breakfast', 'Lunch', 'Dinner', 'Snacks');
CREATE TYPE public.member_status AS ENUM ('active', 'expired', 'trial');
CREATE TYPE public.payment_status AS ENUM ('paid', 'pending', 'failed');
CREATE TYPE public.payment_type AS ENUM ('membership', 'pt', 'product');

-- Create Tables

-- Trainers
CREATE TABLE IF NOT EXISTS public.trainers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    photo TEXT,
    specialization TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User Roles
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    role public.app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Members
CREATE TABLE IF NOT EXISTS public.members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT,
    emergency_contact TEXT,
    photo TEXT,
    plan TEXT NOT NULL,
    status public.member_status NOT NULL DEFAULT 'active',
    start_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    payment_due NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Workouts
CREATE TABLE IF NOT EXISTS public.workouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    difficulty public.difficulty_level NOT NULL,
    duration INTEGER NOT NULL, -- in minutes
    body_part public.body_part NOT NULL,
    equipment public.equipment_type NOT NULL,
    thumbnail TEXT,
    video_url TEXT,
    trainer_id UUID REFERENCES public.trainers(id),
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Workout Exercises
CREATE TABLE IF NOT EXISTS public.workout_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workout_id UUID NOT NULL REFERENCES public.workouts(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    sets INTEGER NOT NULL,
    reps TEXT NOT NULL,
    rest TEXT NOT NULL,
    notes TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Workout Assignments
CREATE TABLE IF NOT EXISTS public.workout_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    workout_id UUID NOT NULL REFERENCES public.workouts(id) ON DELETE CASCADE,
    status public.assignment_status NOT NULL DEFAULT 'active',
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Diet Plans
CREATE TABLE IF NOT EXISTS public.diet_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    diet_type public.diet_type NOT NULL,
    diet_goal public.diet_goal NOT NULL,
    category public.diet_category NOT NULL,
    duration INTEGER NOT NULL, -- in weeks/days
    target_calories INTEGER NOT NULL,
    macros_protein INTEGER NOT NULL,
    macros_carbs INTEGER NOT NULL,
    macros_fat INTEGER NOT NULL,
    water_intake NUMERIC,
    supplements TEXT[],
    special_instructions TEXT,
    thumbnail TEXT,
    trainer_id UUID REFERENCES public.trainers(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Diet Meals
CREATE TABLE IF NOT EXISTS public.diet_meals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    diet_plan_id UUID NOT NULL REFERENCES public.diet_plans(id) ON DELETE CASCADE,
    meal_time public.meal_time NOT NULL,
    items JSONB NOT NULL, -- Array of food items
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Diet Assignments
CREATE TABLE IF NOT EXISTS public.diet_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    diet_plan_id UUID NOT NULL REFERENCES public.diet_plans(id) ON DELETE CASCADE,
    status public.assignment_status NOT NULL DEFAULT 'active',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    notify_email BOOLEAN DEFAULT false,
    notify_sms BOOLEAN DEFAULT false,
    notify_whatsapp BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Member Attendance
CREATE TABLE IF NOT EXISTS public.member_attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    check_in_time TIME NOT NULL,
    check_out_time TIME,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Member Measurements
CREATE TABLE IF NOT EXISTS public.member_measurements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    weight NUMERIC NOT NULL,
    height NUMERIC NOT NULL,
    body_fat NUMERIC,
    bmi NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Member Payments
CREATE TABLE IF NOT EXISTS public.member_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    type public.payment_type NOT NULL,
    status public.payment_status NOT NULL,
    date DATE NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diet_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diet_meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diet_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_payments ENABLE ROW LEVEL SECURITY;

-- Create basic policies (Open for now to ensure functionality, can be tightened later)
CREATE POLICY "Enable all access for authenticated users" ON public.trainers FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all access for authenticated users" ON public.profiles FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all access for authenticated users" ON public.user_roles FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all access for authenticated users" ON public.members FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all access for authenticated users" ON public.workouts FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all access for authenticated users" ON public.workout_exercises FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all access for authenticated users" ON public.workout_assignments FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all access for authenticated users" ON public.diet_plans FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all access for authenticated users" ON public.diet_meals FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all access for authenticated users" ON public.diet_assignments FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all access for authenticated users" ON public.member_attendance FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all access for authenticated users" ON public.member_measurements FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all access for authenticated users" ON public.member_payments FOR ALL TO authenticated USING (true);

-- Helper function for role check
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
