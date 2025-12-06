"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useAcademicYear } from "@/contexts/AcademicYearContext"

export function AcademicYearSelector() {
    const { years, selectedYear, setSelectedYear, loading } = useAcademicYear()

    const handleValueChange = (value: string) => {
        const year = years.find(y => y.id.toString() === value)
        if (year) {
            setSelectedYear(year)
        }
    }

    if (loading) {
        return <div className="h-9 w-[180px] animate-pulse rounded-md bg-muted" />
    }

    if (years.length === 0) {
        return <div className="text-sm text-muted-foreground">Chưa có năm học</div>
    }

    return (
        <div className="flex items-center gap-2">
            <Select value={selectedYear?.id.toString()} onValueChange={handleValueChange}>
                <SelectTrigger className="w-[140px] md:w-[180px] h-9 bg-white border-gray-200">
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
    )
}
