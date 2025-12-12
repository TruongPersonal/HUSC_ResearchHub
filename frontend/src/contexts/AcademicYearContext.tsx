"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { AcademicYear } from "@/features/academic-year/types";
import { academicYearService } from "@/features/academic-year/api/academic-year.service";
import { toast } from "sonner";

interface AcademicYearContextType {
  years: AcademicYear[];
  selectedYear: AcademicYear | null;
  setSelectedYear: (year: AcademicYear) => void;
  loading: boolean;
  refreshYears: () => Promise<void>;
}

const AcademicYearContext = createContext<AcademicYearContextType | undefined>(
  undefined,
);

export function AcademicYearProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [years, setYears] = useState<AcademicYear[]>([]);
  const [selectedYear, setSelectedYearState] = useState<AcademicYear | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const fetchYears = async () => {
    try {
      const response = await academicYearService.getAll("", 0, 100);
      const activeYears = response.content.filter((y) => y.isActive);
      setYears(activeYears);

      // Logic to determine selected year
      let yearToSelect: AcademicYear | undefined;

      // 1. Try to keep current selection if it still exists and is active
      if (selectedYear) {
        const found = activeYears.find((y) => y.id === selectedYear.id);
        if (found) {
          yearToSelect = found;
        }
      }

      // 2. If no selection or invalid, try localStorage
      if (!yearToSelect) {
        const savedYearId = localStorage.getItem("selectedAcademicYearId");
        if (savedYearId) {
          yearToSelect = activeYears.find(
            (y) => y.id.toString() === savedYearId,
          );
        }
      }

      // 3. If still nothing, default to highest year
      if (!yearToSelect && activeYears.length > 0) {
        const sortedYears = [...activeYears].sort((a, b) => b.year - a.year);
        yearToSelect = sortedYears[0];
      }

      if (yearToSelect) {
        setSelectedYearState(yearToSelect);
        localStorage.setItem(
          "selectedAcademicYearId",
          yearToSelect.id.toString(),
        );
      } else {
        setSelectedYearState(null);
      }
    } catch (error) {
      console.error("Failed to fetch academic years", error);
      toast.error("Không thể tải danh sách năm học");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYears();

    const handleUpdate = () => {
      fetchYears();
    };

    window.addEventListener("academic-year-updated", handleUpdate);

    return () => {
      window.removeEventListener("academic-year-updated", handleUpdate);
    };
  }, []);

    const setSelectedYear = (year: AcademicYear) => {
      setSelectedYearState(year);
      localStorage.setItem("selectedAcademicYearId", year.id.toString());
      toast.success(`Đã chuyển sang năm học ${year.year}`);
    };

    return (
      <AcademicYearContext.Provider
        value={{
          years,
          selectedYear,
          setSelectedYear,
          loading,
          refreshYears: fetchYears,
        }}
      >
        {children}
      </AcademicYearContext.Provider>
    );
  }

export function useAcademicYear() {
    const context = useContext(AcademicYearContext);
    if (context === undefined) {
      throw new Error(
        "useAcademicYear must be used within an AcademicYearProvider",
      );
    }
    return context;
  }
