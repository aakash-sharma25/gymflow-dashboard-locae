import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Upload a Lottie animation file to Supabase Storage
 * @param file - The file to upload (from input or File object)
 * @param fileName - Optional custom filename (defaults to original file name)
 * @returns The public URL of the uploaded file
 */
export async function uploadLottieAnimation(
    file: File,
    fileName?: string
): Promise<string | null> {
    try {
        const finalFileName = fileName || file.name;
        const filePath = `exercise_animations/${finalFileName}`;

        // Upload file to Supabase Storage
        const { data, error } = await supabase.storage
            .from('exercise-animations')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true, // Overwrite if exists
            });

        if (error) {
            console.error('Upload error:', error);
            toast.error(`Failed to upload: ${error.message}`);
            return null;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('exercise-animations')
            .getPublicUrl(filePath);

        toast.success('Animation uploaded successfully!');
        return urlData.publicUrl;
    } catch (error) {
        console.error('Unexpected error:', error);
        toast.error('Failed to upload animation');
        return null;
    }
}

/**
 * Upload a local file from file path (Node.js environment only)
 * For browser: use uploadLottieAnimation with File from input
 */
export async function uploadLocalFile(
    filePath: string,
    destinationName: string
): Promise<string | null> {
    // This is for Node.js/server-side only
    // In browser, use file input instead
    throw new Error('Use file input in browser environment');
}

/**
 * Assign animation URL to all workout exercises
 * @param animationUrl - The URL of the animation to assign
 */
export async function assignAnimationToAllExercises(
    animationUrl: string
): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('workout_exercises')
            .update({ animation_url: animationUrl })
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all

        if (error) {
            console.error('Update error:', error);
            toast.error(`Failed to update exercises: ${error.message}`);
            return false;
        }

        toast.success('Animation URL assigned to all exercises!');
        return true;
    } catch (error) {
        console.error('Unexpected error:', error);
        toast.error('Failed to update exercises');
        return false;
    }
}

/**
 * Delete an animation from storage
 */
export async function deleteAnimation(fileName: string): Promise<boolean> {
    try {
        const filePath = `exercise_animations/${fileName}`;
        const { error } = await supabase.storage
            .from('exercise-animations')
            .remove([filePath]);

        if (error) {
            console.error('Delete error:', error);
            toast.error(`Failed to delete: ${error.message}`);
            return false;
        }

        toast.success('Animation deleted successfully!');
        return true;
    } catch (error) {
        console.error('Unexpected error:', error);
        toast.error('Failed to delete animation');
        return false;
    }
}
