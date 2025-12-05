import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Loader2, CheckCircle, Link as LinkIcon } from 'lucide-react';
import { uploadLottieAnimation, assignAnimationToAllExercises } from '@/utils/animationStorage';
import { toast } from 'sonner';

/**
 * Component for uploading Lottie animations
 * Usage: Add this to your admin panel
 */
export const LottieUploader = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
    const [assigning, setAssigning] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (!selectedFile.name.endsWith('.json')) {
                toast.error('Please select a .json file');
                return;
            }
            setFile(selectedFile);
            setUploadedUrl(null);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error('Please select a file first');
            return;
        }

        setUploading(true);
        const url = await uploadLottieAnimation(file);
        if (url) {
            setUploadedUrl(url);
        }
        setUploading(false);
    };

    const handleAssignToAll = async () => {
        if (!uploadedUrl) {
            toast.error('Please upload a file first');
            return;
        }

        setAssigning(true);
        await assignAnimationToAllExercises(uploadedUrl);
        setAssigning(false);
    };

    const copyToClipboard = () => {
        if (uploadedUrl) {
            navigator.clipboard.writeText(uploadedUrl);
            toast.success('URL copied to clipboard!');
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Upload Lottie Animation</CardTitle>
                <CardDescription>
                    Upload .json Lottie files for exercise animations
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Input
                        type="file"
                        accept=".json"
                        onChange={handleFileChange}
                        disabled={uploading}
                    />
                    {file && (
                        <p className="text-sm text-muted-foreground">
                            Selected: {file.name}
                        </p>
                    )}
                </div>

                <Button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className="w-full"
                >
                    {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {!uploading && <Upload className="mr-2 h-4 w-4" />}
                    Upload to Storage
                </Button>

                {uploadedUrl && (
                    <div className="space-y-3 p-4 bg-muted rounded-lg">
                        <div className="flex items-start gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                            <div className="flex-1 space-y-2">
                                <p className="text-sm font-medium">Upload Successful!</p>
                                <div className="flex items-center gap-2">
                                    <code className="text-xs bg-background p-2 rounded flex-1 break-all">
                                        {uploadedUrl}
                                    </code>
                                    <Button size="sm" variant="outline" onClick={copyToClipboard}>
                                        <LinkIcon className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={handleAssignToAll}
                            disabled={assigning}
                            variant="secondary"
                            className="w-full"
                        >
                            {assigning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Assign to All Exercises (Testing)
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
