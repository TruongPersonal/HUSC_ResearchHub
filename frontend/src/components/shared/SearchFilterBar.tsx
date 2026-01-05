import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  key: string;
  placeholder: string;
  value: string;
  onValueChange: (value: string) => void;
  options: FilterOption[];
  minWidth?: string;
}

interface SearchFilterBarProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters?: FilterConfig[];
  rightContent?: React.ReactNode;
}

/**
 * Thanh tìm kiếm và bộ lọc dùng chung.
 * Hỗ trợ ô tìm kiếm (Search Input), các Dropdown bộ lọc, và content tùy chỉnh bên phải.
 */
export function SearchFilterBar({
  searchPlaceholder = "Tìm kiếm...",
  searchValue,
  onSearchChange,
  filters = [],
  rightContent,
}: SearchFilterBarProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center bg-white p-4 rounded-lg border shadow-sm">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={searchPlaceholder}
          className="pl-9 bg-gray-50/50 border-gray-200 focus:bg-white transition-colors"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      {rightContent}

      {filters.length > 0 && (
        <div className="flex flex-col lg:flex-row gap-2 w-full lg:w-auto">
          {filters.map((filter) => (
            <div
              key={filter.key}
              style={{ minWidth: filter.minWidth || "180px" }}
            >
              <Select value={filter.value} onValueChange={filter.onValueChange}>
                <SelectTrigger className="w-full bg-gray-50/50 border-gray-200 focus:bg-white transition-colors">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder={filter.placeholder} />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {filter.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
