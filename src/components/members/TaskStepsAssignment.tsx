import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAssignTaskSteps } from '@/hooks/useMemberTaskSteps';
import { Footprints, Loader2 } from 'lucide-react';

const PRESET_STEPS = [2000, 3000, 5000, 8000, 10000];

interface TaskStepsAssignmentProps {
    memberId: string;
    memberName: string;
}

export const TaskStepsAssignment = ({ memberId, memberName }: TaskStepsAssignmentProps) => {
    const [stepCount, setStepCount] = useState<number>(0);
    const [notes, setNotes] = useState('');
    const assignTaskSteps = useAssignTaskSteps();

    const handlePresetClick = (steps: number) => {
        setStepCount(steps);
    };

    const handleSubmit = () => {
        if (stepCount <= 0) return;

        assignTaskSteps.mutate({
            member_id: memberId,
            step_count: stepCount,
            notes: notes || undefined,
        }, {
            onSuccess: () => {
                setStepCount(0);
                setNotes('');
            },
        });
    };

    return (
        <Card className="border-dashed border-2 border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <Footprints className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-base">Task Steps Assignment</CardTitle>
                        <CardDescription className="text-xs">
                            Assign step tasks for absences, rule violations, or missed workouts
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Quick Select Presets */}
                <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Quick Select</Label>
                    <div className="flex flex-wrap gap-2">
                        {PRESET_STEPS.map((steps) => (
                            <Button
                                key={steps}
                                type="button"
                                variant={stepCount === steps ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handlePresetClick(steps)}
                                className="text-xs"
                            >
                                {steps.toLocaleString()} steps
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Custom Step Count Input */}
                <div className="space-y-2">
                    <Label htmlFor="stepCount">Custom Step Count</Label>
                    <Input
                        id="stepCount"
                        type="number"
                        min="100"
                        max="50000"
                        step="100"
                        placeholder="Enter step count..."
                        value={stepCount || ''}
                        onChange={(e) => setStepCount(parseInt(e.target.value) || 0)}
                    />
                </div>

                {/* Notes/Reason */}
                <div className="space-y-2">
                    <Label htmlFor="notes">Reason (Optional)</Label>
                    <Textarea
                        id="notes"
                        placeholder="e.g., Missed 3 gym sessions, Rule violation..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="resize-none h-20"
                    />
                </div>

                {/* Submit Button */}
                <Button
                    onClick={handleSubmit}
                    disabled={stepCount <= 0 || assignTaskSteps.isPending}
                    className="w-full"
                >
                    {assignTaskSteps.isPending ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Assigning...
                        </>
                    ) : (
                        <>
                            <Footprints className="h-4 w-4 mr-2" />
                            Assign {stepCount > 0 ? `${stepCount.toLocaleString()} Steps` : 'Steps Task'}
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
};
