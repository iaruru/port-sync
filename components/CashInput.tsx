import { DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface CashInputProps {
    value: number;
    onChange: (value: number) => void;
}

export function CashInput({ value, onChange }: CashInputProps) {
    return (
        <div className="glass-panel p-6 rounded-xl flex flex-col gap-2">
            <label className="text-sm font-medium text-muted-foreground">보유 현금</label>
            <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                    type="text"
                    value={value.toLocaleString()}
                    onChange={(e) => {
                        const rawValue = e.target.value.replace(/,/g, "");
                        if (!/^\d*$/.test(rawValue)) return;
                        onChange(Number(rawValue));
                    }}
                    className="w-full pl-10 pr-4 py-3 text-2xl font-bold bg-transparent border border-muted rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/30 text-foreground"
                    placeholder="0"
                />
            </div>
        </div>
    );
}
