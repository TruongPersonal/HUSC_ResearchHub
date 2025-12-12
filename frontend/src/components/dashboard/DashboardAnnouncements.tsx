"use client";

import { useEffect, useState } from "react";
import { AnnouncementList } from "@/features/announcements/components/AnnouncementList";
import {
    AnnouncementDetailModal,
    Noti,
} from "@/features/announcements/components/AnnouncementDetailModal";
import { announcementService } from "@/features/announcements/api/announcement.service";
import { Announcement } from "@/features/announcements/types";
import { Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link"; // Assuming we might want a "View All" link later, or just remove if unused.

export function DashboardAnnouncements() {
    const [data, setData] = useState<Noti[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<Noti | null>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch latest 5 announcements
                const response = await announcementService.getAll(
                    undefined,
                    0,
                    5
                );

                const mappedData: Noti[] = response.content.map(
                    (item: Announcement) => ({
                        id: item.id,
                        title: item.title,
                        content: item.content,
                        publishDatetime: item.publishDatetime,
                        category: item.departmentName ? "Cấp khoa" : "Cấp trường",
                    })
                );

                setData(mappedData);
            } catch (error) {
                console.error("Failed to fetch announcements", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const openDetail = (n: Noti) => {
        setSelected(n);
        setOpen(true);
    };

    return (
        <>
            <div className="space-y-4 pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Bell className="w-5 h-5 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-semibold tracking-tight">Thông báo mới nhất</h2>
                    </div>
                </div>

                <AnnouncementList data={data} onItemClick={openDetail} />
            </div>

            <AnnouncementDetailModal
                open={open}
                onOpenChange={setOpen}
                notification={selected}
            />
        </>
    );
}
