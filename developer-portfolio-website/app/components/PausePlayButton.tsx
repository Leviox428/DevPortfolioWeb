import { Play, Pause } from "lucide-react";

interface PlayPauseButtonProps {
    isPlaying: boolean;
    onToggle: () => void;
}

export function PlayPauseButton({ isPlaying, onToggle }: PlayPauseButtonProps) {
    return (
        <div className="fixed top-4 left-4">
            <button
                onClick={onToggle}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg hover:bg-gray-100 transition"
            >
                {isPlaying ? (
                    <Pause className="w-6 h-6 text-gray-800" />
                    ) : (
                    <Play className="w-6 h-6 text-gray-800" />
                )}
            </button>
        </div>
    );
}