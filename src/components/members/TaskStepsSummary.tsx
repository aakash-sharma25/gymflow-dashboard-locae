import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePendingTaskSteps, useCompleteTaskStep } from '@/hooks/useMemberTaskSteps';
import { Footprints, CheckCircle, Loader2, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface TaskStepsSummaryProps {
    memberId: string;
}

export const TaskStepsSummary = ({ memberId }: TaskStepsSummaryProps) => {
    const { data: pendingTasks = [], isLoading } = usePendingTaskSteps(memberId);
    const completeTask = useCompleteTaskStep();

    const totalPendingSteps = pendingTasks.reduce((sum, task) => sum + task.step_count, 0);

    const handleMarkComplete = (taskId: string) => {
        completeTask.mutate({ id: taskId, member_id: memberId });
    };

    if (isLoading) {
        return (
            <Card className="bg-muted/30">
                <CardContent className="p-4 flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        );
    }

    if (pendingTasks.length === 0) {
        return null; // Don't show anything if no pending tasks
    }

    return (
        <Card className="bg-orange-500/10 border-orange-500/20">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-orange-500/20">
                            <Footprints className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                            <CardTitle className="text-sm font-medium">Pending Steps Tasks</CardTitle>
                            <CardDescription className="text-xs">
                                {pendingTasks.length} task{pendingTasks.length !== 1 ? 's' : ''} • {totalPendingSteps.toLocaleString()} total steps
                            </CardDescription>
                        </div>
                    </div>
                    <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/30">
                        {totalPendingSteps.toLocaleString()} steps
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
                {pendingTasks.map((task) => (
                    <div
                        key={task.id}
                        className="flex items-center justify-between p-2.5 bg-background/50 rounded-lg border border-border/50"
                    >
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm text-orange-600">
                                    {task.step_count.toLocaleString()} steps
                                </span>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    {format(new Date(task.assigned_at), 'MMM dd')}
                                </div>
                            </div>
                            {task.notes && (
                                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                                    {task.notes}
                                </p>
                            )}
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkComplete(task.id)}
                            disabled={completeTask.isPending}
                            className="ml-2 h-7 text-xs hover:bg-green-500/10 hover:text-green-600"
                        >
                            {completeTask.isPending ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                                <>
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Complete
                                </>
                            )}
                        </Button>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};
