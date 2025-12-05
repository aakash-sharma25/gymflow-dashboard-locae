import { Workout as DbWorkout } from '@/hooks/useWorkouts';
import { Workout as FrontendWorkout } from '@/types';

/**
 * Maps database workout format (snake_case) to frontend format (camelCase)
 */
export const mapDbWorkoutToFrontend = (dbWorkout: DbWorkout): FrontendWorkout => {
    return {
        id: dbWorkout.id,
        name: dbWorkout.name,
        trainer: dbWorkout.trainer?.name || 'Unknown Trainer',
        trainerId: dbWorkout.trainer_id || '',
        bodyPart: dbWorkout.body_part,
        difficulty: dbWorkout.difficulty,
        equipment: dbWorkout.equipment,
        duration: dbWorkout.duration,
        exercises: (dbWorkout.exercises || []).map(ex => ({
            name: ex.name || 'Unknown Exercise',
            sets: ex.sets || 3,
            reps: ex.reps || '10',
            rest: ex.rest || '60s',
            notes: ex.notes || '',
            animation_url: ex.animation_url || null,
        })),
        members: [], // TODO: Load from workout_assignments
        usageCount: dbWorkout.usage_count || 0,
        thumbnail: dbWorkout.thumbnail || 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop',
        videoUrl: dbWorkout.video_url || undefined,
    };
};
