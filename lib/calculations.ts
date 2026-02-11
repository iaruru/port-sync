import { Asset, RebalanceResult, RebalanceMode } from "@/types/portfolio";

// Helper to round numbers to 2 decimal places
const roundTwo = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100;

export function calculateTotalValue(assets: Asset[], cash: number): number {
    const assetsValue = assets.reduce((sum, asset) => sum + asset.quantity * asset.price, 0);
    return roundTwo(assetsValue + cash);
}

export function calculateCurrentWeight(asset: Asset, totalValue: number): number {
    if (totalValue === 0) return 0;
    const assetValue = asset.quantity * asset.price;
    return roundTwo((assetValue / totalValue) * 100);
}

export function calculateTargetAmount(totalValue: number, targetWeight: number): number {
    return roundTwo(totalValue * (targetWeight / 100));
}

export function calculateRebalancePlan(
    assets: Asset[],
    cash: number,
    mode: RebalanceMode
): RebalanceResult[] {
    const totalValue = calculateTotalValue(assets, cash);

    // First pass: Calculate initial necessary quantities
    let plan = assets.map((asset) => {
        const currentAmount = asset.quantity * asset.price;
        const targetAmount = calculateTargetAmount(totalValue, asset.targetWeight);
        const difference = targetAmount - currentAmount;

        // Safety check for 0 price
        if (asset.price <= 0) {
            return {
                asset,
                action: "hold" as const,
                quantity: 0,
                amount: 0,
                cost: 0
            };
        }

        let necessaryQuantity = Math.floor(difference / asset.price);

        // Mode-specific logic: No Sell
        if (mode === "noSell" && necessaryQuantity < 0) {
            necessaryQuantity = 0;
        }

        return {
            asset,
            action: necessaryQuantity > 0 ? "buy" : necessaryQuantity < 0 ? "sell" : "hold",
            quantity: Math.abs(necessaryQuantity),
            amount: roundTwo(Math.abs(necessaryQuantity * asset.price)),
            cost: necessaryQuantity * asset.price // Positive for buy, negative for sell
        };
    });

    // Second pass: Cap buys if in noSell mode and we exceed cash
    if (mode === "noSell") {
        const totalBuyCost = plan.reduce((sum, item) => (item.cost > 0 ? sum + item.cost : sum), 0);

        if (totalBuyCost > cash) {
            // We need to scale down. 
            // Simple approach: Scale everything by (cash / totalBuyCost) and floor it.
            // This might leave some cash unused, but guarantees we don't overspend.
            const scale = cash / totalBuyCost;

            plan = plan.map(item => {
                if (item.action !== "buy") return item;

                const newQuantity = Math.floor(item.quantity * scale);
                const newCost = newQuantity * item.asset.price;

                return {
                    ...item,
                    quantity: newQuantity,
                    amount: roundTwo(Math.abs(newCost)),
                    cost: newCost,
                    action: newQuantity > 0 ? "buy" : "hold"
                };
            });
        }
    }

    // Final mapping to output format
    return plan.map(item => {
        const { asset, quantity, amount, action } = item;

        // Calculate projected weight
        // For projected weight, we simulate the action happened.
        // New Qty = Old Qty + (Buy Qty) or - (Sell Qty)
        const outputAction = (action as "buy" | "sell" | "hold");
        let signedQtyChange = 0;
        if (outputAction === "buy") signedQtyChange = quantity;
        if (outputAction === "sell") signedQtyChange = -quantity;

        const newQuantity = asset.quantity + signedQtyChange;
        const newAmount = newQuantity * asset.price;

        // We use the original totalValue for % projection to see alignment with target
        const projectedWeight = totalValue > 0 ? roundTwo((newAmount / totalValue) * 100) : 0;

        return {
            assetId: asset.id,
            ticker: asset.ticker,
            action: outputAction,
            quantity: quantity,
            amount: amount,
            projectedWeight,
        };
    });
}

export function calculateProjectedCash(currentCash: number, rebalancePlan: RebalanceResult[]): number {
    let projectedCash = currentCash;
    rebalancePlan.forEach(item => {
        if (item.action === 'buy') {
            projectedCash -= item.amount;
        } else if (item.action === 'sell') {
            projectedCash += item.amount;
        }
    });
    return roundTwo(projectedCash);
}
