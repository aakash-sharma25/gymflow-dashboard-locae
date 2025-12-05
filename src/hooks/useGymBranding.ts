import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface GymBranding {
    id: string;
    user_id: string;
    gym_name: string;
    logo_url: string | null;
    primary_color: string;
    secondary_color: string;
    address: string | null;
    contact_number: string | null;
    website_url: string | null;
    created_at: string;
    updated_at: string;
}

// Default branding fallback
export const DEFAULT_BRANDING: GymBranding = {
    id: '',
    user_id: '',
    gym_name: 'Your Gym',
    logo_url: null,
    primary_color: '#3b82f6',
    secondary_color: '#1e40af',
    address: null,
    contact_number: null,
    website_url: null,
    created_at: '',
    updated_at: '',
};

/**
 * Fetch current user's gym branding
 */
export const useGymBranding = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['gym-branding', user?.id],
        queryFn: async () => {
            if (!user?.id) return DEFAULT_BRANDING;

            const { data, error } = await supabase
                .from('gym_branding')
                .select('*')
                .eq('user_id', user.id)
                .maybeSingle();

            if (error) {
                console.error('Error fetching branding:', error);
                return DEFAULT_BRANDING;
            }

            return (data as GymBranding) || DEFAULT_BRANDING;
        },
        enabled: !!user?.id,
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });
};

/**
 * Update gym branding
 */
export const useUpdateBranding = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (updates: Partial<Omit<GymBranding, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
            if (!user?.id) throw new Error('Not authenticated');

            // First try to update existing
            const { data: existing } = await supabase
                .from('gym_branding')
                .select('id')
                .eq('user_id', user.id)
                .maybeSingle();

            if (existing) {
                // Update existing
                const { data, error } = await supabase
                    .from('gym_branding')
                    .update({
                        ...updates,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('user_id', user.id)
                    .select()
                    .single();

                if (error) throw error;
                return data;
            } else {
                // Insert new
                const { data, error } = await supabase
                    .from('gym_branding')
                    .insert({
                        user_id: user.id,
                        ...updates,
                    })
                    .select()
                    .single();

                if (error) throw error;
                return data;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gym-branding'] });
            toast({ title: 'Success', description: 'Branding updated successfully' });
        },
        onError: (error) => {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        },
    });
};
