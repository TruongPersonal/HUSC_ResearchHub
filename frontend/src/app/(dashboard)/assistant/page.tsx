"use client"

import { useAssistantStats } from "@/hooks/useAssistantStats"
import { AssistantStatsGrid } from "@/components/dashboard/AssistantStatsGrid"

export default function AssistantOverviewPage() {
    const { stats, loading } = useAssistantStats()

    return (
        <div className="h-full flex-1 flex-col space-y-8 md:flex animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        Tổng quan
                    </h2>
                    <p className="text-muted-foreground">
                        Tổng quan về hoạt động nghiên cứu khoa học của Khoa.
                    </p>
                </div>
            </div>

            {/* Cards Grid */}
            <AssistantStatsGrid stats={stats} loading={loading} />
        </div>
    )
}
