"use client";

import { AcademicYearSelector } from "@/components/common/AcademicYearSelector";
import { UserMenu } from "@/components/dashboard/UserMenu";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useState } from "react";

/**
 * Navbar cho Admin và Assistant.
 * Bao gồm: Chọn năm học, Menu người dùng.
 */

export function Navbar() {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 md:px-6">
      <div className="flex items-center gap-4">
        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="-ml-2">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <Sidebar className="w-full border-none" onClose={() => setSheetOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>

        <AcademicYearSelector />
      </div>
      <div className="flex items-center gap-4">
        <UserMenu />
      </div>
    </header>
  );
}
