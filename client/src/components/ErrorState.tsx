import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface ErrorStateProps {
    title?: string;
    description?: string;
    onRetry?: () => void;
    className?: string;
}

export function ErrorState({ title, description, onRetry, className }: ErrorStateProps) {
    const { t } = useLanguage();

    return (
        <div className={cn("flex flex-col items-center justify-center p-8 text-center text-red-500 bg-red-50 rounded-lg border border-red-100", className)}>
            <AlertCircle className="w-10 h-10 mb-4" />
            <h3 className="text-lg font-semibold mb-1">{title || t("error")}</h3>
            {description && <p className="text-sm text-red-400 mb-6">{description}</p>}
            {onRetry && (
                <Button onClick={onRetry} variant="outline" className="border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50">
                    {t("tryAgain")}
                </Button>
            )}
        </div>
    );
}
