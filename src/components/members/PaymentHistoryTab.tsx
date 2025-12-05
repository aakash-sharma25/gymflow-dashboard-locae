import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMemberPayments, useDeletePayment, useUpdatePayment, MemberPayment } from '@/hooks/useMembers';
import { AddPaymentDialog } from './AddPaymentDialog';
import { format } from 'date-fns';
import { Plus, Download, MoreHorizontal, Edit2, Trash2, CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentHistoryTabProps {
    memberId: string;
    memberName: string;
}

export const PaymentHistoryTab = ({ memberId, memberName }: PaymentHistoryTabProps) => {
    const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
    const { data: payments = [], isLoading } = useMemberPayments(memberId);
    const deletePayment = useDeletePayment();
    const updatePayment = useUpdatePayment();

    const handleDelete = async (paymentId: string) => {
        if (confirm('Are you sure you want to delete this payment?')) {
            await deletePayment.mutateAsync({ id: paymentId, member_id: memberId });
        }
    };

    const handleStatusChange = async (payment: MemberPayment, newStatus: 'paid' | 'pending' | 'failed') => {
        await updatePayment.mutateAsync({
            id: payment.id,
            member_id: payment.member_id,
            status: newStatus,
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'paid':
                return <Badge variant="outline" className="bg-green-500/10 text-green-500"><CheckCircle className="h-3 w-3 mr-1" />Paid</Badge>;
            case 'pending':
                return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
            case 'failed':
                return <Badge variant="outline" className="bg-red-500/10 text-red-500"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getTypeBadge = (type: string) => {
        switch (type) {
            case 'membership':
                return <Badge variant="outline" className="bg-primary/10 text-primary">Membership</Badge>;
            case 'pt':
                return <Badge variant="outline" className="bg-purple-500/10 text-purple-500">Personal Training</Badge>;
            case 'product':
                return <Badge variant="outline" className="bg-blue-500/10 text-blue-500">Product</Badge>;
            default:
                return <Badge variant="outline">{type}</Badge>;
        }
    };

    const totalAmount = payments.reduce((sum, p) => sum + (p.status === 'paid' ? p.amount : 0), 0);
    const pendingAmount = payments.reduce((sum, p) => sum + (p.status === 'pending' ? p.amount : 0), 0);

    const handleExportInvoice = () => {
        toast.success('Invoice export coming soon!');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-500/10 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Received</p>
                    <p className="text-2xl font-bold text-green-500">₹{totalAmount.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-yellow-500/10 rounded-lg">
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold text-yellow-500">₹{pendingAmount.toLocaleString()}</p>
                </div>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between">
                <h4 className="font-semibold">Transaction History</h4>
                <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={handleExportInvoice}>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                    <Button size="sm" onClick={() => setIsAddPaymentOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Payment
                    </Button>
                </div>
            </div>

            {/* Payments Table */}
            {payments.length > 0 ? (
                <div className="border border-border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-[60px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payments.map((payment) => (
                                <TableRow key={payment.id}>
                                    <TableCell className="font-medium">
                                        {format(new Date(payment.date), 'MMM dd, yyyy')}
                                    </TableCell>
                                    <TableCell>{payment.description}</TableCell>
                                    <TableCell>{getTypeBadge(payment.type)}</TableCell>
                                    <TableCell className="font-semibold">₹{payment.amount.toLocaleString()}</TableCell>
                                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {payment.status !== 'paid' && (
                                                    <DropdownMenuItem onClick={() => handleStatusChange(payment, 'paid')}>
                                                        <CheckCircle className="h-4 w-4 mr-2" />
                                                        Mark as Paid
                                                    </DropdownMenuItem>
                                                )}
                                                {payment.status !== 'pending' && (
                                                    <DropdownMenuItem onClick={() => handleStatusChange(payment, 'pending')}>
                                                        <Clock className="h-4 w-4 mr-2" />
                                                        Mark as Pending
                                                    </DropdownMenuItem>
                                                )}
                                                {payment.status !== 'failed' && (
                                                    <DropdownMenuItem onClick={() => handleStatusChange(payment, 'failed')}>
                                                        <XCircle className="h-4 w-4 mr-2" />
                                                        Mark as Failed
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem
                                                    className="text-destructive"
                                                    onClick={() => handleDelete(payment.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <div className="text-center py-8 text-muted-foreground">
                    No payment history found. Click "Add Payment" to record a transaction.
                </div>
            )}

            {/* Add Payment Dialog */}
            <AddPaymentDialog
                memberId={memberId}
                memberName={memberName}
                open={isAddPaymentOpen}
                onOpenChange={setIsAddPaymentOpen}
            />
        </div>
    );
};
