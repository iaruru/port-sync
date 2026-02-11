"use client";

import { usePortfolio } from "@/hooks/usePortfolio";
import { Header } from "@/components/Header";
import { CashInput } from "@/components/CashInput";
import { ModeToggle } from "@/components/ModeToggle";
import { AssetTable } from "@/components/AssetTable";
import { DonutChart } from "@/components/DonutChart";
import { RebalanceResultTable } from "@/components/RebalanceResult";
import { WeightValidation } from "@/components/WeightValidation";

export default function Home() {
  const {
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
  } = usePortfolio();

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      <Header />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left Column: Controls & Summary */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-xl space-y-4">
            <h2 className="text-lg font-semibold">설정</h2>
            <CashInput value={portfolio.cash} onChange={setCash} />
            <ModeToggle mode={portfolio.rebalanceMode} onChange={setRebalanceMode} />
          </div>

          <div className="glass-panel p-6 rounded-xl">
            <h2 className="text-lg font-semibold mb-4">요약</h2>
            <div className="flex justify-between items-center py-2 border-b border-muted dark:border-white/5">
              <span className="text-muted-foreground">총 자산</span>
              <span className="font-bold text-xl">{totalValue.toLocaleString()}</span>
            </div>
            <div className="mt-4">
              <WeightValidation totalWeight={Math.round(targetWeightSum * 100) / 100} />
            </div>
          </div>
        </div>

        {/* Center/Right: Data & Chart */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <AssetTable
                assets={portfolio.assets}
                totalValue={totalValue}
                onUpdate={updateAsset}
                onDelete={removeAsset}
                onAdd={addAsset}
              />
            </div>
          </div>

          {/* Calculate Button - positioned right after the table */}
          <div className="flex justify-center">
            <button
              onClick={calculate}
              className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 text-lg"
            >
              계산하기
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DonutChart assets={portfolio.assets} totalValue={totalValue} />

            <div className="glass-panel p-6 rounded-xl flex flex-col justify-center">
              <h3 className="text-lg font-semibold mb-2">리밸런싱 전략</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                현재 모드: <span className="text-primary font-medium uppercase">{portfolio.rebalanceMode === "full" ? "전체 재조정" : "매도 없음"}</span>
                <br />
                {portfolio.rebalanceMode === "full"
                  ? "목표 비중에 맞추기 위해 자산을 매수하거나 매도합니다."
                  : "보유 현금 내에서 매수만 수행합니다. 기존 보유 자산은 매도하지 않습니다."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {isCalculated && (
        <RebalanceResultTable plan={rebalancePlan} projectedCash={projectedCash} />
      )}
    </main>
  );
}
