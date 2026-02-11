"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
    const { theme, setTheme, mounted } = useTheme();

    // Prevent hydration mismatch — render nothing until mounted
    if (!mounted) {
        return (
            <div className="glass-panel p-1 rounded-full flex h-fit w-fit items-center gap-1">
                <div className="p-2 rounded-full"><Sun className="w-4 h-4 text-muted-foreground" /></div>
                <div className="p-2 rounded-full"><Moon className="w-4 h-4 text-muted-foreground" /></div>
                <div className="p-2 rounded-full"><Monitor className="w-4 h-4 text-muted-foreground" /></div>
            </div>
        );
    }

    return (
        <div className="glass-panel p-1 rounded-full flex h-fit w-fit items-center gap-1">
            <button
                onClick={() => setTheme("light")}
                className={cn(
                    "p-2 rounded-full transition-all",
                    theme === "light"
                        ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                        : "text-muted-foreground hover:text-foreground hover:bg-black/10 dark:hover:bg-white/10"
                )}
                aria-label="Light Mode"
            >
                <Sun className="w-4 h-4" />
            </button>
            <button
                onClick={() => setTheme("dark")}
                className={cn(
                    "p-2 rounded-full transition-all",
                    theme === "dark"
                        ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                        : "text-muted-foreground hover:text-foreground hover:bg-black/10 dark:hover:bg-white/10"
                )}
                aria-label="Dark Mode"
            >
                <Moon className="w-4 h-4" />
            </button>
            <button
                onClick={() => setTheme("system")}
                className={cn(
                    "p-2 rounded-full transition-all",
                    theme === "system"
                        ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                        : "text-muted-foreground hover:text-foreground hover:bg-black/10 dark:hover:bg-white/10"
                )}
                aria-label="System Mode"
            >
                <Monitor className="w-4 h-4" />
            </button>
        </div>
    );
}
