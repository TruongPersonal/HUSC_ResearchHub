"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, FileText, BookOpen } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MyTopic } from "@/features/topics/types";
import { MyTopicsTable } from "@/features/topics/components/MyTopicsTable";
import { topicService } from "@/features/topics/api/topic.service";
import { TopicRow } from "@/features/topics/types";
import { authService } from "@/features/auth/api/auth.service";

export default function TeacherMyTopicsPage() {
    const router = useRouter();
    const [data, setData] = useState<MyTopic[]>([]);
    const [loading, setLoading] = useState(true);

    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. Get Profile for ID
                const user = await authService.getProfile();
                setCurrentUserId(user.id); // Assuming Profile has ID. If not, needs checking.

                // 2. Get Topics
                const response = await topicService.getMyTopics();

                // Map API response to UI model
                const mappedData = response.map((item: TopicRow): MyTopic | null => {
                    const isLeader = item.studentLeaderId === user.id;
                    const isPending = item.pendingMembers?.some(m => m.id === user.id);
                    const isApprovedMember = item.approvedMembers?.some(m => m.id === user.id);
                    const isAdvisor = item.advisorId === user.id;

                    // If user is not Leader AND not Approved Member AND not Advisor => Filter out.
                    // (Hides Rejected, Cancelled, AND Pending as requested)
                    if (!isLeader && !isApprovedMember && !isAdvisor) {
                        return null;
                    }

                    let role: "LEADER" | "MEMBER" | "PENDING" | "ADVISOR" = "MEMBER";
                    if (isLeader) role = "LEADER";
                    if (isPending) role = "PENDING";
                    if (isAdvisor) role = "ADVISOR";

                    return {
                        id: item.id.toString(),
                        code: item.code,
                        name: item.title,
                        status: (item.approvedStatus || item.status) as any,
                        createdAt: new Date(item.submittedAt).toLocaleDateString('vi-VN'),
                        type: item.status === "APPROVED" ? "TOPIC" : "PROPOSAL",
                        role: role,
                        budget: parseFloat(item.budget || "0"),
                        lecturer: {
                            name: item.advisor || "Chưa có giảng viên",
                            username: ""
                        },
                        students: item.approvedMembers ? item.approvedMembers.map(m => ({
                            id: m.id.toString(),
                            code: m.username || "",
                            name: m.name,
                            isLeader: item.studentLeaderId === m.id
                        })) : []
                    };
                }).filter((item): item is MyTopic => item !== null);

                setData(mappedData);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    // Proposals: Show ALL topics.
    // If a topic is officially active (IN_PROGRESS, etc.), show it as "APPROVED" in the Proposal list.
    const proposals = data.map(item => {
        const isOfficialStatus = ["IN_PROGRESS", "COMPLETED", "NOT_COMPLETED", "CANCELED"].includes(item.status);
        if (isOfficialStatus) {
            return { ...item, status: "APPROVED" as any };
        }
        return item;
    });

    // Official Topics: Only show those that are actually Approved/Active.
    const topics = data.filter(item => {
        return ["APPROVED", "IN_PROGRESS", "COMPLETED", "NOT_COMPLETED", "CANCELED"].includes(item.status);
    });





    return (
        <div className="max-w-[1080px] mx-auto pb-12">
            {/* Header */}
            <div className="mb-8 flex items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Đề tài của tôi</h1>
                    <p className="text-gray-500 mt-1">Hồ sơ đăng ký và danh sách đề tài.</p>
                </div>
                <Link href="/teacher/topic-registration">
                    <Button className="bg-blue-600 hover:bg-blue-700 shadow-sm transition-all">
                        <Plus className="w-4 h-4 mr-2" />
                        Đăng ký đề tài
                    </Button>
                </Link>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="proposals" className="space-y-6">
                <TabsList className="bg-gray-100/50 p-1 rounded-lg inline-flex h-auto border border-gray-200/50">
                    <TabsTrigger
                        value="proposals"
                        className="px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm font-medium transition-all gap-2 text-sm"
                    >
                        <FileText className="w-4 h-4" />
                        Hồ sơ đăng ký
                        <span className="ml-1.5 bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full text-xs">
                            {proposals.length}
                        </span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="topics"
                        className="px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm font-medium transition-all gap-2 text-sm"
                    >
                        <BookOpen className="w-4 h-4" />
                        Danh sách đề tài
                        <span className="ml-1.5 bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full text-xs">
                            {topics.length}
                        </span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="proposals" className="space-y-6 animate-in fade-in-50 duration-300 slide-in-from-bottom-2">
                    <MyTopicsTable
                        data={proposals}
                        onView={(topic: MyTopic) => router.push(`/teacher/my-topics/${topic.id}?view=proposal`)}
                        emptyMessage="Bạn chưa có hồ sơ đăng ký nào."
                        showCode={false}
                    />
                </TabsContent>

                <TabsContent value="topics" className="space-y-6 animate-in fade-in-50 duration-300 slide-in-from-bottom-2">
                    <MyTopicsTable
                        data={topics}
                        onView={(topic: MyTopic) => router.push(`/teacher/my-topics/${topic.id}?view=topic`)}
                        emptyMessage="Bạn chưa có đề tài nghiên cứu nào."
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
