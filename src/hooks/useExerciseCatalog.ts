import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ExerciseTemplate {
    name: string;
    category: string;
    animation_url: string | null;
}

export const useExerciseCatalog = () => {
    return useQuery({
        queryKey: ['exercise-catalog'],
        queryFn: async () => {
            // Get unique exercise names from all workouts
            const { data, error } = await supabase
                .from('workout_exercises')
                .select('name, animation_url')
                .order('name');

            if (error) throw error;

            // Group by name and get unique exercises
            const uniqueExercises = new Map<string, ExerciseTemplate>();

            data.forEach((exercise) => {
                if (!uniqueExercises.has(exercise.name)) {
                    // Infer category from exercise name (can be enhanced later)
                    let category = 'strength';
                    const lowerName = exercise.name.toLowerCase();

                    if (lowerName.includes('cardio') || lowerName.includes('running') || lowerName.includes('jump')) {
                        category = 'cardio';
                    } else if (lowerName.includes('stretch') || lowerName.includes('yoga')) {
                        category = 'flexibility';
                    } else if (lowerName.includes('core') || lowerName.includes('plank') || lowerName.includes('crunch')) {
                        category = 'core';
                    }

                    uniqueExercises.set(exercise.name, {
                        name: exercise.name,
                        category,
                        animation_url: exercise.animation_url,
                    });
                }
            });

            return Array.from(uniqueExercises.values());
        },
    });
};
