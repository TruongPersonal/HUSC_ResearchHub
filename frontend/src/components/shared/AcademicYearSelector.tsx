"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAcademicYear } from "@/contexts/AcademicYearContext";
import { cn } from "@/lib/utils";

interface AcademicYearSelectorProps {
    className?: string;
    triggerClassName?: string;
}

export function AcademicYearSelector({
    className,
    triggerClassName,
}: AcademicYearSelectorProps) {
    const { years, selectedYear, setSelectedYear } = useAcademicYear();

    return (
        <div className={className}>
            <Select
                value={selectedYear?.id.toString()}
                onValueChange={(value) => {
                    const year = years.find((y) => y.id.toString() === value);
                    if (year) setSelectedYear(year);
                }}
            >
                <SelectTrigger
                    className={cn(
                        "w-full bg-white/60 backdrop-blur-md rounded-xl px-4 py-2 border-slate-200 text-sm font-semibold text-gray-700 hover:bg-white/80 transition-colors focus:ring-slate-200",
                        triggerClassName,
                    )}
                >
                    <SelectValue placeholder="Chọn năm học" />
                </SelectTrigger>
                <SelectContent>
                    {years.map((year) => (
                        <SelectItem key={year.id} value={year.id.toString()}>
                            {year.year}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
