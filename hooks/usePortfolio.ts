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

    // Reset calculation when portfolio changes
    useMemo(() => {
        setIsCalculated(false);
    }, [portfolio]);

    const calculate = () => {
        const plan = calculateRebalancePlan(portfolio.assets, portfolio.cash, portfolio.rebalanceMode);
        const nextCash = calculateProjectedCash(portfolio.cash, plan);

        setRebalancePlan(plan);
        setProjectedCash(nextCash);
        setIsCalculated(true);
    };

    return {
        portfolio,
        totalValue,
        rebalancePlan,
        projectedCash,
        targetWeightSum,
        isCalculated,
        calculate,
        addAsset,
        updateAsset,
        removeAsset,
        setCash,
        setRebalanceMode,
    };
}
