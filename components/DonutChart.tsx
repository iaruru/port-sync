"use client";

import { Asset } from "@/types/portfolio";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData, ChartOptions } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { calculateCurrentWeight } from "@/lib/calculations";
import { useEffect, useState } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DonutChartProps {
    assets: Asset[];
    totalValue: number;
}

export function DonutChart({ assets, totalValue }: DonutChartProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const data: ChartData<"doughnut"> = {
        labels: assets.map((a) => a.ticker),
        datasets: [
            {
                data: assets.map((a) => calculateCurrentWeight(a, totalValue)),
                backgroundColor: [
                    "rgba(99, 102, 241, 0.8)", // Primary
                    "rgba(16, 185, 129, 0.8)", // Success
                    "rgba(245, 158, 11, 0.8)", // Warning
                    "rgba(239, 68, 68, 0.8)", // Danger
                    "rgba(59, 130, 246, 0.8)", // Info
                    "rgba(139, 92, 246, 0.8)", // Violet
                    "rgba(236, 72, 153, 0.8)", // Pink
                    "rgba(20, 184, 166, 0.8)", // Teal
                ],
                borderColor: "rgba(24, 24, 27, 1)",
                borderWidth: 2,
                hoverOffset: 4,
            },
        ],
    };

    const options: ChartOptions<"doughnut"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    color: "#a1a1aa",
                    padding: 20,
                    font: {
                        family: "'Inter', sans-serif",
                        size: 12,
                    },
                },
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const val = context.raw as number;
                        return ` ${val.toFixed(2)}%`;
                    },
                },
                backgroundColor: "rgba(24, 24, 27, 0.9)",
                padding: 12,
                cornerRadius: 8,
            },
        },
        cutout: "70%",
    };

    return (
        <div className="glass-panel p-6 rounded-xl flex flex-col items-center justify-center relative h-80">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                    <p className="text-sm text-muted-foreground">총 자산</p>
                    <p className="text-xl font-bold text-foreground tracking-tight">
                        {totalValue.toLocaleString()}
                    </p>
                </div>
            </div>
            <div className="w-full h-full relative z-10">
                <Doughnut data={data} options={options} />
            </div>
        </div>
    );
}
