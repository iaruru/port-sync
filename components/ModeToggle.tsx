import { RebalanceMode } from "@/types/portfolio";
import { cn } from "@/lib/utils";
import { RefreshCw, Lock } from "lucide-react";

interface ModeToggleProps {
    mode: RebalanceMode;
    onChange: (mode: RebalanceMode) => void;
}

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
    return (
        <div className="glass-panel p-1 rounded-lg flex h-fit w-fit self-end">
            <button
                onClick={() => onChange("full")}
                className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                    mode === "full"
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "text-muted-foreground hover:text-foreground hover:bg-black/10 dark:hover:bg-white/10"
                )}
            >
                <RefreshCw className="w-4 h-4" />
                전체 재조정
            </button>
            <button
                onClick={() => onChange("noSell")}
                className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                    mode === "noSell"
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "text-muted-foreground hover:text-foreground hover:bg-black/10 dark:hover:bg-white/10"
                )}
            >
                <Lock className="w-4 h-4" />
                매도 없음
            </button>
        </div>
    );
}
