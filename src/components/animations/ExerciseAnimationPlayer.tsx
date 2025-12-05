import { Player } from '@lottiefiles/react-lottie-player';
import { useState } from 'react';

interface ExerciseAnimationPlayerProps {
    animationUrl: string | null;
    className?: string;
    autoplay?: boolean;
    loop?: boolean;
}

export const ExerciseAnimationPlayer = ({
    animationUrl,
    className = "h-24 w-24",
    autoplay = true,
    loop = true
}: ExerciseAnimationPlayerProps) => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    if (!animationUrl) {
        return (
            <div className={`${className} bg-muted rounded-lg flex items-center justify-center`}>
                <span className="text-xs text-muted-foreground">No Animation</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`${className} bg-destructive/10 rounded-lg flex items-center justify-center`}>
                <span className="text-xs text-destructive">Load Error</span>
            </div>
        );
    }

    return (
        <div className={`${className} relative`}>
            {loading && (
                <div className="absolute inset-0 bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">Loading...</span>
                </div>
            )}
            <Player
                autoplay={autoplay}
                loop={loop}
                src={animationUrl}
                style={{ height: '100%', width: '100%' }}
                onEvent={(event) => {
                    if (event === 'load') {
                        setLoading(false);
                        setError(false);
                    } else if (event === 'error') {
                        setLoading(false);
                        setError(true);
                        console.error('Animation load error:', animationUrl);
                    }
                }}
            />
        </div>
    );
};
