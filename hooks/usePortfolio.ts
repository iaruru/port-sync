import { useLocalStorage } from "./useLocalStorage";
import { Asset, PortfolioState, RebalanceMode } from "@/types/portfolio";
import {
    calculateTotalValue,
    calculateRebalancePlan,
    calculateProjectedCash,
} from "@/lib/calculations";
import { v4 as uuidv4 } from "uuid";
import { useMemo, useState } from "react";

const INITIAL_STATE: PortfolioState = {
    assets: [],
    cash: 0,
    rebalanceMode: "full",
};

export function usePortfolio() {
    const [portfolio, setPortfolio] = useLocalStorage<PortfolioState>(
        "portfolio-state",
        INITIAL_STATE
    );

    const addAsset = (asset: Omit<Asset, "id">) => {
        const newAsset: Asset = { ...asset, id: uuidv4() };
        setPortfolio((prev) => ({
            ...prev,
            assets: [...prev.assets, newAsset],
        }));
    };

    const updateAsset = (id: string, updates: Partial<Asset>) => {
        setPortfolio((prev) => ({
            ...prev,
            assets: prev.assets.map((asset) =>
                asset.id === id ? { ...asset, ...updates } : asset
            ),
        }));
    };

    const removeAsset = (id: string) => {
        setPortfolio((prev) => ({
            ...prev,
            assets: prev.assets.filter((asset) => asset.id !== id),
        }));
    };

    const setCash = (cash: number) => {
        setPortfolio((prev) => ({ ...prev, cash }));
    };

    const setRebalanceMode = (mode: RebalanceMode) => {
        setPortfolio((prev) => ({ ...prev, rebalanceMode: mode }));
    };

    // Derived State
    const totalValue = useMemo(() =>
        calculateTotalValue(portfolio.assets, portfolio.cash),
        [portfolio.assets, portfolio.cash]
    );

    const targetWeightSum = useMemo(() =>
        portfolio.assets.reduce((sum, asset) => sum + asset.targetWeight, 0),
        [portfolio.assets]
    );

    // Manual Calculation State
    const [rebalancePlan, setRebalancePlan] = useState<ReturnType<typeof calculateRebalancePlan>>([]);
    const [projectedCash, setProjectedCash] = useState(0);
    const [isCalculated, setIsCalculated] = useState(false);

    const calculate = () => {
        const plan = calculateRebalancePlan(portfolio.assets, portfolio.cash, portfolio.rebalanceMode);
        const nextCash = calculateProjectedCash(portfolio.cash, plan);

        setRebalancePlan(plan);
        setProjectedCash(nextCash);
        setIsCalculated(true);
    };

    const resetCalculation = () => {
        setIsCalculated(false);
        setRebalancePlan([]);
        setProjectedCash(0);
    };

    // Apply the rebalancing plan: update asset quantities and cash
    const applyPlan = () => {
        setPortfolio((prev) => {
            const updatedAssets = prev.assets.map((asset) => {
                const planItem = rebalancePlan.find((p) => p.assetId === asset.id);
                if (!planItem || planItem.action === "hold") return asset;

                const qtyChange = planItem.action === "buy" ? planItem.quantity : -planItem.quantity;
                return { ...asset, quantity: asset.quantity + qtyChange };
            });

            return {
                ...prev,
                assets: updatedAssets,
                cash: projectedCash,
            };
        });

        // After applying, recalculate to show "no changes needed"
        // We need a slight delay because setPortfolio is async
        setTimeout(() => {
            setRebalancePlan([]);
            setProjectedCash(0);
            setIsCalculated(false);
        }, 0);
    };

    return {
        portfolio,
        totalValue,
        rebalancePlan,
        projectedCash,
        targetWeightSum,
        isCalculated,
        calculate,
        resetCalculation,
        applyPlan,
        addAsset,
        updateAsset,
        removeAsset,
        setCash,
        setRebalanceMode,
    };
}
