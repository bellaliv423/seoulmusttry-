import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center p-8 text-center bg-orange-50/50 rounded-lg border border-orange-100", className)}>
            {Icon && (
                <div className="bg-white p-3 rounded-full mb-4 shadow-sm">
                    <Icon className="w-8 h-8 text-orange-400" />
                </div>
            )}
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
            {description && <p className="text-sm text-gray-500 mb-6 max-w-sm">{description}</p>}
            {action && (
                <Button onClick={action.onClick} variant="outline" className="border-orange-200 text-orange-600 hover:text-orange-700 hover:bg-orange-50">
                    {action.label}
                </Button>
            )}
        </div>
    );
}
