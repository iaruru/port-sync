import { Asset } from "@/types/portfolio";
import { calculateCurrentWeight, calculateTargetAmount } from "@/lib/calculations";
import { Trash2, Plus, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface AssetTableProps {
    assets: Asset[];
    totalValue: number;
    onUpdate: (id: string, updates: Partial<Asset>) => void;
    onDelete: (id: string) => void;
    onAdd: (asset: Omit<Asset, "id">) => void;
}

export function AssetTable({ assets, totalValue, onUpdate, onDelete, onAdd }: AssetTableProps) {
    const [newAsset, setNewAsset] = useState<Omit<Asset, "id">>({
        ticker: "",
        quantity: 0,
        price: 0,
        targetWeight: 0,
    });

    const handleAdd = () => {
        if (!newAsset.ticker) return;
        onAdd(newAsset);
        setNewAsset({ ticker: "", quantity: 0, price: 0, targetWeight: 0 });
    };

    return (
        <div className="glass-panel rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-muted/50 dark:bg-white/5 uppercase text-xs font-semibold text-muted-foreground">
                        <tr>
                            <th className="px-4 py-3">종목명</th>
                            <th className="px-4 py-3 text-right">수량</th>
                            <th className="px-4 py-3 text-right">현재가</th>
                            <th className="px-4 py-3 text-right">평가금액</th>
                            <th className="px-4 py-3 text-right">현재 비중</th>
                            <th className="px-4 py-3 text-right">목표 비중</th>
                            <th className="px-4 py-3 text-right">차이</th>
                            <th className="px-4 py-3 text-center">관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-muted dark:divide-white/5">
                        {assets.map((asset) => {
                            const currentWeight = calculateCurrentWeight(asset, totalValue);
                            const diff = (asset.targetWeight - currentWeight).toFixed(2);
                            const isPositive = Number(diff) > 0;
                            const value = asset.quantity * asset.price;

                            return (
                                <tr key={asset.id} className="hover:bg-muted/50 dark:hover:bg-white/5 transition-colors group">
                                    <td className="px-4 py-3">
                                        <input
                                            type="text"
                                            value={asset.ticker}
                                            onChange={(e) => onUpdate(asset.id, { ticker: e.target.value })}
                                            className="bg-transparent font-medium w-full focus:outline-none focus:text-primary uppercase text-foreground"
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <input
                                            type="number"
                                            value={asset.quantity}
                                            onChange={(e) => onUpdate(asset.id, { quantity: Number(e.target.value) })}
                                            className="bg-transparent text-right w-full focus:outline-none focus:text-primary text-foreground"
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <input
                                            type="number"
                                            value={asset.price}
                                            onChange={(e) => onUpdate(asset.id, { price: Number(e.target.value) })}
                                            className="bg-transparent text-right w-full focus:outline-none focus:text-primary text-foreground"
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-right font-medium text-muted-foreground">
                                        {value.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-right text-muted-foreground">
                                        {currentWeight.toFixed(2)}%
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <input
                                                type="number"
                                                value={asset.targetWeight}
                                                onChange={(e) => onUpdate(asset.id, { targetWeight: Number(e.target.value) })}
                                                className="bg-transparent text-right w-16 focus:outline-none focus:text-primary text-foreground"
                                            />
                                            <span className="text-muted-foreground">%</span>
                                        </div>
                                    </td>
                                    <td className={cn("px-4 py-3 text-right font-medium", isPositive ? "text-info" : "text-danger")}>
                                        {Number(diff) > 0 ? "+" : ""}{diff}%
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => onDelete(asset.id)}
                                            className="p-1 rounded-md text-muted-foreground hover:text-danger hover:bg-danger/10 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}

                        {/* Add Row */}
                        <tr className="bg-primary/5 dark:bg-primary/5">
                            <td className="px-4 py-3">
                                <input
                                    placeholder="새 종목"
                                    value={newAsset.ticker}
                                    onChange={(e) => setNewAsset({ ...newAsset, ticker: e.target.value })}
                                    className="bg-transparent w-full focus:outline-none placeholder:text-muted-foreground/50 uppercase text-foreground"
                                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                                />
                            </td>
                            <td className="px-4 py-3 text-right">
                                <input
                                    type="number"
                                    placeholder="수량"
                                    value={newAsset.quantity || ""}
                                    onChange={(e) => setNewAsset({ ...newAsset, quantity: Number(e.target.value) })}
                                    className="bg-transparent text-right w-full focus:outline-none placeholder:text-muted-foreground/50 text-foreground"
                                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                                />
                            </td>
                            <td className="px-4 py-3 text-right">
                                <input
                                    type="number"
                                    placeholder="현재가"
                                    value={newAsset.price || ""}
                                    onChange={(e) => setNewAsset({ ...newAsset, price: Number(e.target.value) })}
                                    className="bg-transparent text-right w-full focus:outline-none placeholder:text-muted-foreground/50 text-foreground"
                                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                                />
                            </td>
                            <td className="px-4 py-3 text-right text-muted-foreground">-</td>
                            <td className="px-4 py-3 text-right text-muted-foreground">-</td>
                            <td className="px-4 py-3 text-right">
                                <input
                                    type="number"
                                    placeholder="비중"
                                    value={newAsset.targetWeight || ""}
                                    onChange={(e) => setNewAsset({ ...newAsset, targetWeight: Number(e.target.value) })}
                                    className="bg-transparent text-right w-16 focus:outline-none placeholder:text-muted-foreground/50 text-foreground"
                                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                                />
                            </td>
                            <td className="px-4 py-3 text-right text-muted-foreground">-</td>
                            <td className="px-4 py-3 text-center">
                                <button
                                    onClick={handleAdd}
                                    disabled={!newAsset.ticker}
                                    className="p-1 rounded-md text-primary hover:bg-primary/10 transition-colors disabled:opacity-50"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
