import { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { useBranding } from '@/contexts/BrandingContext';
import { useUpdateBranding, GymBranding } from '@/hooks/useGymBranding';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, Palette, Building2, Phone, Globe, Upload, ImageIcon } from 'lucide-react';

const BrandingSettings = () => {
    const { branding, isLoading } = useBranding();
    const updateBranding = useUpdateBranding();

    const [formData, setFormData] = useState<Partial<GymBranding>>({});

    // Initialize form with branding data
    const getFieldValue = (field: keyof GymBranding) => {
        return formData[field] !== undefined ? formData[field] : branding[field];
    };

    const handleChange = (field: keyof GymBranding, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateBranding.mutate(formData);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in max-w-4xl">
            <PageHeader
                title="Branding Settings"
                description="Customize your gym's branding and appearance"
            />

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-primary" />
                            <div>
                                <CardTitle className="text-lg">Gym Information</CardTitle>
                                <CardDescription>Basic details about your gym</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="gym_name">Gym Name</Label>
                            <Input
                                id="gym_name"
                                placeholder="Enter your gym name"
                                value={getFieldValue('gym_name') as string}
                                onChange={(e) => handleChange('gym_name', e.target.value)}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="logo_url">Logo URL</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="logo_url"
                                    placeholder="https://example.com/logo.png"
                                    value={(getFieldValue('logo_url') as string) || ''}
                                    onChange={(e) => handleChange('logo_url', e.target.value)}
                                />
                            </div>
                            {getFieldValue('logo_url') && (
                                <div className="mt-2 p-4 border rounded-lg bg-muted/50 flex items-center justify-center">
                                    <img
                                        src={getFieldValue('logo_url') as string}
                                        alt="Logo preview"
                                        className="max-h-20 object-contain"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="address">Address</Label>
                            <Textarea
                                id="address"
                                placeholder="Enter your gym address"
                                value={(getFieldValue('address') as string) || ''}
                                onChange={(e) => handleChange('address', e.target.value)}
                                className="resize-none h-20"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Info */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Phone className="h-5 w-5 text-primary" />
                            <div>
                                <CardTitle className="text-lg">Contact Information</CardTitle>
                                <CardDescription>How customers can reach you</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="contact_number">Phone Number</Label>
                                <Input
                                    id="contact_number"
                                    placeholder="+91 9876543210"
                                    value={(getFieldValue('contact_number') as string) || ''}
                                    onChange={(e) => handleChange('contact_number', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="website_url">Website URL</Label>
                                <Input
                                    id="website_url"
                                    placeholder="https://yourgym.com"
                                    value={(getFieldValue('website_url') as string) || ''}
                                    onChange={(e) => handleChange('website_url', e.target.value)}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Theme Colors */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Palette className="h-5 w-5 text-primary" />
                            <div>
                                <CardTitle className="text-lg">Theme Colors</CardTitle>
                                <CardDescription>Customize your dashboard appearance</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="primary_color">Primary Color</Label>
                                <div className="flex gap-2">
                                    <div
                                        className="w-10 h-10 rounded-lg border cursor-pointer"
                                        style={{ backgroundColor: getFieldValue('primary_color') as string }}
                                        onClick={() => document.getElementById('primary_color_picker')?.click()}
                                    />
                                    <Input
                                        id="primary_color"
                                        placeholder="#3b82f6"
                                        value={getFieldValue('primary_color') as string}
                                        onChange={(e) => handleChange('primary_color', e.target.value)}
                                        className="flex-1"
                                    />
                                    <input
                                        type="color"
                                        id="primary_color_picker"
                                        className="sr-only"
                                        value={getFieldValue('primary_color') as string}
                                        onChange={(e) => handleChange('primary_color', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="secondary_color">Secondary Color</Label>
                                <div className="flex gap-2">
                                    <div
                                        className="w-10 h-10 rounded-lg border cursor-pointer"
                                        style={{ backgroundColor: getFieldValue('secondary_color') as string }}
                                        onClick={() => document.getElementById('secondary_color_picker')?.click()}
                                    />
                                    <Input
                                        id="secondary_color"
                                        placeholder="#1e40af"
                                        value={getFieldValue('secondary_color') as string}
                                        onChange={(e) => handleChange('secondary_color', e.target.value)}
                                        className="flex-1"
                                    />
                                    <input
                                        type="color"
                                        id="secondary_color_picker"
                                        className="sr-only"
                                        value={getFieldValue('secondary_color') as string}
                                        onChange={(e) => handleChange('secondary_color', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Colors will be applied across the dashboard after saving.
                        </p>
                    </CardContent>
                </Card>

                {/* Submit Button */}
                <Button type="submit" className="w-full sm:w-auto" disabled={updateBranding.isPending}>
                    {updateBranding.isPending ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Branding Settings
                        </>
                    )}
                </Button>
            </form>
        </div>
    );
};

export default BrandingSettings;
