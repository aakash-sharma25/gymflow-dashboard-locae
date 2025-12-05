import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface MemberTaskStep {
    id: string;
    member_id: string;
    step_count: number;
    assigned_by_admin_id: string | null;
    assigned_at: string;
    status: 'pending' | 'completed';
    notes: string | null;
    completed_at: string | null;
}

/**
 * Fetch all task steps for a specific member
 */
export const useMemberTaskSteps = (memberId: string) => {
    return useQuery({
        queryKey: ['member-task-steps', memberId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('member_task_steps')
                .select('*')
                .eq('member_id', memberId)
                .order('assigned_at', { ascending: false });

            if (error) throw error;
            return data as MemberTaskStep[];
        },
        enabled: !!memberId,
    });
};

/**
 * Fetch pending task steps for a specific member
 */
export const usePendingTaskSteps = (memberId: string) => {
    return useQuery({
        queryKey: ['member-task-steps', memberId, 'pending'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('member_task_steps')
                .select('*')
                .eq('member_id', memberId)
                .eq('status', 'pending')
                .order('assigned_at', { ascending: false });

            if (error) throw error;
            return data as MemberTaskStep[];
        },
        enabled: !!memberId,
    });
};

/**
 * Assign a new task step to a member
 */
export const useAssignTaskSteps = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (taskStep: {
            member_id: string;
            step_count: number;
            notes?: string;
        }) => {
            // Get current user for assigned_by_admin_id
            const { data: { user } } = await supabase.auth.getUser();

            const { data, error } = await supabase
                .from('member_task_steps')
                .insert({
                    member_id: taskStep.member_id,
                    step_count: taskStep.step_count,
                    notes: taskStep.notes || null,
                    assigned_by_admin_id: user?.id || null,
                    status: 'pending',
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['member-task-steps', variables.member_id] });
            toast({ title: 'Success', description: `Assigned ${variables.step_count.toLocaleString()} steps task` });
        },
        onError: (error) => {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        },
    });
};

/**
 * Mark a task step as completed
 */
export const useCompleteTaskStep = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async ({ id, member_id }: { id: string; member_id: string }) => {
            const { data, error } = await supabase
                .from('member_task_steps')
                .update({
                    status: 'completed',
                    completed_at: new Date().toISOString(),
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['member-task-steps', variables.member_id] });
            toast({ title: 'Success', description: 'Task marked as completed' });
        },
        onError: (error) => {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        },
    });
};

/**
 * Delete a task step
 */
export const useDeleteTaskStep = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async ({ id, member_id }: { id: string; member_id: string }) => {
            const { error } = await supabase
                .from('member_task_steps')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return member_id;
        },
        onSuccess: (member_id) => {
            queryClient.invalidateQueries({ queryKey: ['member-task-steps', member_id] });
            toast({ title: 'Success', description: 'Task step deleted' });
        },
        onError: (error) => {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        },
    });
};
