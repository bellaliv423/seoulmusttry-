import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg";
    text?: string;
    className?: string;
}

export function LoadingSpinner({ size = "md", text, className }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-8 h-8",
        lg: "w-12 h-12",
    };

    return (
        <div className={cn("flex flex-col items-center justify-center p-4", className)}>
            <Loader2 className={cn("animate-spin text-orange-500", sizeClasses[size])} />
            {text && <p className="mt-2 text-sm text-gray-500 font-medium">{text}</p>}
        </div>
    );
}
