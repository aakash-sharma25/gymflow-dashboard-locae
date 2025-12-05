import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useAddPayment } from '@/hooks/useMembers';
import { Loader2 } from 'lucide-react';

interface AddPaymentDialogProps {
    memberId: string;
    memberName: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const AddPaymentDialog = ({
    memberId,
    memberName,
    open,
    onOpenChange,
}: AddPaymentDialogProps) => {
    const [amount, setAmount] = useState('');
    const [type, setType] = useState<'membership' | 'pt' | 'product'>('membership');
    const [status, setStatus] = useState<'paid' | 'pending' | 'failed'>('paid');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const addPayment = useAddPayment();

    const handleSubmit = async () => {
        if (!amount || !description) return;

        await addPayment.mutateAsync({
            member_id: memberId,
            amount: parseFloat(amount),
            type,
            status,
            description,
            date,
        });

        // Reset form
        setAmount('');
        setType('membership');
        setStatus('paid');
        setDescription('');
        setDate(new Date().toISOString().split('T')[0]);
        onOpenChange(false);
    };

    const paymentTypes = [
        { value: 'membership', label: 'Membership Fee' },
        { value: 'pt', label: 'Personal Training' },
        { value: 'product', label: 'Product Purchase' },
    ];

    const paymentStatuses = [
        { value: 'paid', label: 'Paid' },
        { value: 'pending', label: 'Pending' },
        { value: 'failed', label: 'Failed' },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Payment</DialogTitle>
                    <DialogDescription>
                        Record a new payment transaction for {memberName}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="amount">Amount (₹)</Label>
                        <Input
                            id="amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            min="0"
                            step="0.01"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="type">Payment Type</Label>
                            <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {paymentTypes.map((pt) => (
                                        <SelectItem key={pt.value} value={pt.value}>
                                            {pt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {paymentStatuses.map((ps) => (
                                        <SelectItem key={ps.value} value={ps.value}>
                                            {ps.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="date">Date</Label>
                        <Input
                            id="date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g., Monthly membership fee"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={addPayment.isPending || !amount || !description}>
                        {addPayment.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Add Payment
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
