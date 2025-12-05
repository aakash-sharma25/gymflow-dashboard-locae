import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useGymBranding, GymBranding, DEFAULT_BRANDING } from '@/hooks/useGymBranding';
import { useAuth } from '@/contexts/AuthContext';

interface BrandingContextType {
    branding: GymBranding;
    isLoading: boolean;
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export const useBranding = () => {
    const context = useContext(BrandingContext);
    if (context === undefined) {
        throw new Error('useBranding must be used within a BrandingProvider');
    }
    return context;
};

export const BrandingProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const { data: branding = DEFAULT_BRANDING, isLoading } = useGymBranding();

    // Apply theme colors to CSS custom properties when branding changes
    useEffect(() => {
        if (branding.primary_color) {
            // Convert hex to HSL for CSS variables
            const hsl = hexToHSL(branding.primary_color);
            if (hsl) {
                document.documentElement.style.setProperty('--primary', hsl);
            }
        }
        if (branding.secondary_color) {
            const hsl = hexToHSL(branding.secondary_color);
            if (hsl) {
                document.documentElement.style.setProperty('--secondary', hsl);
            }
        }
    }, [branding.primary_color, branding.secondary_color]);

    return (
        <BrandingContext.Provider value={{ branding, isLoading }}>
            {children}
        </BrandingContext.Provider>
    );
};

// Helper function to convert hex color to HSL format for Tailwind CSS
function hexToHSL(hex: string): string | null {
    // Remove the hash if present
    hex = hex.replace(/^#/, '');

    // Parse the hex color
    const r = parseInt(hex.slice(0, 2), 16) / 255;
    const g = parseInt(hex.slice(2, 4), 16) / 255;
    const b = parseInt(hex.slice(4, 6), 16) / 255;

    if (isNaN(r) || isNaN(g) || isNaN(b)) return null;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r:
                h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                break;
            case g:
                h = ((b - r) / d + 2) / 6;
                break;
            case b:
                h = ((r - g) / d + 4) / 6;
                break;
        }
    }

    // Return in the format Tailwind expects: "H S% L%"
    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}
