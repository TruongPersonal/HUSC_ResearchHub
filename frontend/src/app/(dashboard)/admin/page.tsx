"use client";

import { redirect } from "next/navigation";

export default function AdminHomePage() {
    redirect("/admin/overview");
}
