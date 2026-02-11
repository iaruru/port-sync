import { RebalanceResult } from "@/types/portfolio";
import { cn } from "@/lib/utils";
import { ArrowRight, Wallet } from "lucide-react";

interface RebalanceResultProps {
    plan: RebalanceResult[];
    projectedCash: number;
}

export function RebalanceResultTable({ plan, projectedCash }: RebalanceResultProps) {
    const hasActions = plan.some((item) => item.action !== "hold");

    if (plan.length === 0) return null;

    return (
        <div className="glass-panel rounded-xl overflow-hidden mt-8">
            <div className="p-4 border-b border-muted dark:border-white/5 flex justify-between items-center">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                    <ArrowRight className="w-5 h-5 text-primary" />
                    리밸런싱 계획
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 dark:bg-white/5 px-3 py-1 rounded-full">
                    <Wallet className="w-4 h-4" />
                    <span>예상 현금: </span>
                    <span className="text-foreground font-medium">{projectedCash.toLocaleString()}</span>
                </div>
            </div>

            {!hasActions ? (
                <div className="p-8 text-center text-muted-foreground">
                    조정이 필요하지 않습니다. 포트폴리오가 균형 상태입니다.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/50 dark:bg-white/5 uppercase text-xs font-semibold text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3">종목명</th>
                                <th className="px-4 py-3 text-center">관리</th>
                                <th className="px-4 py-3 text-right">수량</th>
                                <th className="px-4 py-3 text-right">금액</th>
                                <th className="px-4 py-3 text-right">예상 비중</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-muted dark:divide-white/5">
                            {plan.map((item) => {
                                if (item.action === "hold") return null;

                                return (
                                    <tr key={item.assetId} className="hover:bg-muted/50 dark:hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-3 font-medium">{item.ticker}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span
                                                className={cn(
                                                    "px-2 py-1 rounded-full text-xs font-bold uppercase",
                                                    item.action === "buy" && "bg-info/20 text-info",
                                                    item.action === "sell" && "bg-danger/20 text-danger"
                                                )}
                                            >
                                                {item.action === "buy" ? "매수" : "매도"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right font-medium">
                                            {item.quantity}
                                        </td>
                                        <td className="px-4 py-3 text-right text-muted-foreground">
                                            {item.amount.toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            {item.projectedWeight.toFixed(2)}%
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
