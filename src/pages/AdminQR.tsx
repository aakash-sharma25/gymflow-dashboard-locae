import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Download, Printer, ExternalLink, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import QRCode from 'qrcode';

const AdminQR = () => {
    const [gymId, setGymId] = useState<string | null>(null);
    const [gymName, setGymName] = useState<string>('Sweat Ledger Gym');
    const [qrDataUrl, setQrDataUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    // Fetch gym branding to get the gym ID
    useEffect(() => {
        const fetchGymBranding = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data: branding } = await supabase
                        .from('gym_branding')
                        .select('id, gym_name')
                        .eq('user_id', user.id)
                        .single();

                    if (branding) {
                        setGymId(branding.id);
                        setGymName(branding.gym_name || 'Sweat Ledger Gym');
                    }
                }
            } catch (error) {
                console.error('Error fetching gym branding:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGymBranding();
    }, []);

    // Generate QR code with gym ID
    const registrationUrl = gymId
        ? `${window.location.origin}/new-customer?gymId=${gymId}`
        : `${window.location.origin}/new-customer`;

    // Generate QR code dynamically
    useEffect(() => {
        const generateQR = async () => {
            try {
                const url = await QRCode.toDataURL(registrationUrl, {
                    width: 400,
                    margin: 2,
                    color: {
                        dark: '#000000',
                        light: '#ffffff'
                    }
                });
                setQrDataUrl(url);
            } catch (error) {
                console.error('Error generating QR code:', error);
                toast.error('Failed to generate QR code');
            }
        };

        if (registrationUrl) {
            generateQR();
        }
    }, [registrationUrl]);

    const handleDownload = () => {
        if (!qrDataUrl) return;
        const link = document.createElement('a');
        link.href = qrDataUrl;
        link.download = `${gymName.replace(/\s+/g, '-').toLowerCase()}-registration-qr.png`;
        link.click();
        toast.success('QR code downloaded');
    };

    const handlePrint = () => {
        window.print();
        toast.success('Print dialog opened');
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(registrationUrl);
        toast.success('Registration link copied to clipboard');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <PageHeader
                title="Customer Registration QR Code"
                description={`Display this QR code to new customers for easy registration${gymId ? ` at ${gymName}` : ''}.`}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* QR Code Display */}
                <Card className="print:col-span-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <QrCode className="h-5 w-5" />
                            Registration QR Code
                        </CardTitle>
                        <CardDescription>
                            Customers can scan this code with any QR scanner to access the registration form
                            {gymId && <span className="block text-xs mt-1">Linked to: {gymName}</span>}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center space-y-6">
                        <div className="bg-white p-8 rounded-xl shadow-lg print:shadow-none">
                            {qrDataUrl ? (
                                <img
                                    src={qrDataUrl}
                                    alt="Gym Registration QR Code"
                                    className="w-full max-w-sm mx-auto"
                                />
                            ) : (
                                <div className="w-64 h-64 flex items-center justify-center bg-muted rounded">
                                    <Loader2 className="h-8 w-8 animate-spin" />
                                </div>
                            )}
                        </div>
                        <div className="text-center space-y-2">
                            <p className="text-sm font-medium">Scan to Register</p>
                            <p className="text-xs text-muted-foreground font-mono break-all max-w-md">
                                {registrationUrl}
                            </p>
                        </div>
                        <div className="flex gap-2 print:hidden">
                            <Button onClick={handleDownload} variant="outline" className="gap-2" disabled={!qrDataUrl}>
                                <Download className="h-4 w-4" />
                                Download
                            </Button>
                            <Button onClick={handlePrint} variant="outline" className="gap-2">
                                <Printer className="h-4 w-4" />
                                Print
                            </Button>
                            <Button onClick={handleCopyLink} variant="outline" className="gap-2">
                                <ExternalLink className="h-4 w-4" />
                                Copy Link
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Instructions */}
                <Card className="print:hidden">
                    <CardHeader>
                        <CardTitle>How to Use</CardTitle>
                        <CardDescription>
                            Quick guide for using the QR code registration system
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex gap-3">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                                    1
                                </div>
                                <div>
                                    <h4 className="font-medium mb-1">Display QR Code</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Show this QR code at your gym reception or entrance area where new customers can easily see it.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                                    2
                                </div>
                                <div>
                                    <h4 className="font-medium mb-1">Customer Scans</h4>
                                    <p className="text-sm text-muted-foreground">
                                        New customers can scan the QR code using their phone's camera app, Google Lens, or any QR scanner.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                                    3
                                </div>
                                <div>
                                    <h4 className="font-medium mb-1">Fill Registration Form</h4>
                                    <p className="text-sm text-muted-foreground">
                                        The customer will be directed to a registration form where they can enter their details.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                                    4
                                </div>
                                <div>
                                    <h4 className="font-medium mb-1">Auto-Generated ID</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Upon submission, a unique customer ID will be automatically generated and displayed to the customer.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                                    5
                                </div>
                                <div>
                                    <h4 className="font-medium mb-1">View in Dashboard</h4>
                                    <p className="text-sm text-muted-foreground">
                                        All new registrations will appear in the <a href="/admin/customers" className="text-primary hover:underline">Customer List</a> where you can review and manage them.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Print Styles */}
            <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:col-span-full,
          .print\\:col-span-full * {
            visibility: visible;
          }
          .print\\:col-span-full {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
        </div>
    );
};

export default AdminQR;

