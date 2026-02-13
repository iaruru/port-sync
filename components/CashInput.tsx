import { DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface CashInputProps {
    value: number;
    onChange: (value: number) => void;
    disabled?: boolean;
}

export function CashInput({ value, onChange, disabled }: CashInputProps) {
    const [displayValue, setDisplayValue] = useState(value.toLocaleString());
    const [isFocused, setIsFocused] = useState(false);

    // Sync from parent when not focused
    useEffect(() => {
        if (!isFocused) {
            setDisplayValue(value.toLocaleString());
        }
    }, [value, isFocused]);

    return (
        <div className={cn("glass-panel p-6 rounded-xl flex flex-col gap-2", disabled && "opacity-60")}>
            <label className="text-sm font-medium text-muted-foreground">보유 현금</label>
            <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                    type="text"
                    value={displayValue}
                    onFocus={() => {
                        setIsFocused(true);
                        setDisplayValue(value === 0 ? "" : String(value));
                    }}
                    onChange={(e) => {
                        const raw = e.target.value;
                        if (!/^\d*\.?\d*$/.test(raw)) return;
                        setDisplayValue(raw);
                        const num = parseFloat(raw);
                        if (!isNaN(num)) {
                            onChange(num);
                        } else if (raw === "" || raw === ".") {
                            onChange(0);
                        }
                    }}
                    onBlur={() => {
                        setIsFocused(false);
                        setDisplayValue(value.toLocaleString());
                    }}
                    disabled={disabled}
                    className="w-full pl-10 pr-4 py-3 text-2xl font-bold bg-transparent border border-muted rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/30 text-foreground disabled:cursor-not-allowed"
                    placeholder="0"
                />
            </div>
        </div>
    );
}
