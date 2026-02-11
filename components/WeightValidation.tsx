import { AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeightValidationProps {
    totalWeight: number;
}

export function WeightValidation({ totalWeight }: WeightValidationProps) {
    if (totalWeight === 100) return null;

    const isError = totalWeight > 100;

    return (
        <div
            className={cn(
                "rounded-lg p-3 text-sm flex items-center gap-2 mt-4",
                isError ? "bg-danger/10 text-danger border border-danger/20" : "bg-info/10 text-info border border-info/20"
            )}
        >
            {isError ? <AlertTriangle className="w-4 h-4" /> : <Info className="w-4 h-4" />}
            <span>
                {isError
                    ? `목표 비중 합계가 ${totalWeight}% 입니다. ${totalWeight - 100}% 만큼 줄여주세요.`
                    : `목표 비중 합계가 ${totalWeight}% 입니다. 남은 ${100 - totalWeight}% 는 현금으로 보유합니다.`}
            </span>
        </div>
    );
}
