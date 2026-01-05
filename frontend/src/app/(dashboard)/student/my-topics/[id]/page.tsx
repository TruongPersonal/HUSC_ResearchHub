"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { topicService } from "@/features/topics/api/topic.service";
import { authService } from "@/features/auth/api/auth.service";
import { toast } from "sonner";
import { TopicRow } from "@/features/topics/types";
import { MyTopic } from "@/features/topics/types";
import { StatusBadge } from "@/features/topics/components/StatusBadge";
import { API_BASE_URL } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const getAvatarUrl = (avatar: string | undefined) => {
  if (!avatar) return "";
  if (avatar.startsWith("http")) return avatar;

  // Normalize path: ensure it starts with /uploads/ if it's a relative path
  let path = avatar.startsWith("/") ? avatar : `/${avatar}`;
  if (!path.startsWith("/uploads/")) {
    path = `/uploads${path}`;
  }

  return `${API_BASE_URL}${path}`;
};

const getInitials = (name: string) => {
  if (!name) return "";
  const parts = name.trim().split(" ");
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (
    parts[0].substring(0, 1) + parts[parts.length - 1].substring(0, 1)
  ).toUpperCase();
};

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  ArrowLeft,
  Calendar,
  User,
  Users,
  Crown,
  Target,
  FileText,
  DollarSign,
  StickyNote,
  Save,
  Edit2,
  X,
  Mail,
  Phone,
  Upload,
  BookOpen,
  Presentation,
  Trash2,
  Download,
} from "lucide-react";
import { UploadReportDialog } from "@/features/topics/components/UploadReportDialog";
import { EditSummaryDialog } from "@/features/topics/components/EditSummaryDialog";
import { approvedTopicService } from "@/features/topics/api/approved-topic.service";
import { ApprovedTopicDocumentResponse } from "@/features/topics/types";
import { format } from "date-fns";

export default function TopicDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewMode = searchParams.get("view"); // 'proposal' | 'topic'

  const [topic, setTopic] = useState<MyTopic | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<MyTopic>>({});
  const [loading, setLoading] = useState(true);

  // Upload Dialog State
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const [uploadInitialSummary, setUploadInitialSummary] = useState("");
  const [documents, setDocuments] = useState<ApprovedTopicDocumentResponse[]>(
    [],
  );

  // Edit Summary State
  const [editSummaryDoc, setEditSummaryDoc] = useState<{
    id: number;
    summary: string;
  } | null>(null);
  const [deleteDocId, setDeleteDocId] = useState<number | null>(null);

  // Initial Fetch (Topic Details) - RESTORED LOGIC FROM SYNTAX FIX
  useEffect(() => {
    const fetchDetail = async () => {
      // ...
    };
    fetchDetail();
  }, [params.id, viewMode]);

  // Fetch Documents Logic (Separated)
  const fetchDocs = async () => {
    if (topic?.id) {
      try {
        const docs = await approvedTopicService.getDocumentsByTopicId(
          parseInt(topic.id),
        );
        setDocuments(docs);
      } catch (error) {
        console.error("Failed to fetch documents", error);
      }
    }
  };

  useEffect(() => {
    if (topic?.id && viewMode === "topic") {
      fetchDocs();
    }
  }, [topic?.id, viewMode, uploadDialogOpen]);

  const handleConfirmDelete = async () => {
    if (!deleteDocId) return;
    try {
      await approvedTopicService.deleteDocument(deleteDocId);
      toast.success("Xóa tài liệu thành công");
      fetchDocs();
    } catch (error) {
      console.error("Delete failed", error);
      toast.error("Xóa tài liệu thất bại");
    } finally {
      setDeleteDocId(null);
    }
  };

  // ... existing ...

  // In render loop: switch onClick logic
  // onClick={(e) => { e.stopPropagation(); setDeleteDocId(doc.id); }}

  // Render logic at end of return:
  /*
                <AlertDialog open={!!deleteDocId} onOpenChange={(open) => !open && setDeleteDocId(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Xác nhận xóa tài liệu</AlertDialogTitle>
                            <AlertDialogDescription>
                                Bạn có chắc chắn muốn xóa tài liệu này không? Hành động này không thể hoàn tác.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
                                Xóa
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
    */

  // I need to be careful with ReplaceFileContent.
  // I will replace `editSummaryDoc` state block to include `deleteDocId`.
  // Then replace `handleDeleteDocument`.
  // Then replace the render block.

  useEffect(() => {
    const fetchDetail = async () => {
      if (!params.id) return;
      setLoading(true);
      try {
        const id = parseInt(
          Array.isArray(params.id) ? params.id[0] : params.id,
        );

        // 1. Get Topic Detail
        const item: TopicRow = await topicService.getDetail(id);

        // 2. Get Current User for Role Check
        const user = await authService.getProfile();

        // 3. Map to MyTopic
        // Logic for Proposal View vs Topic View
        let displayStatus: any;
        let displayCode = item.code;

        // Determine effective lifecycle status to check for locks
        const effectiveStatus = item.approvedStatus || item.status;
        const isLocked = ["CANCELLED", "CANCELED", "COMPLETED"].includes(
          effectiveStatus,
        );

        if (viewMode === "proposal") {
          displayCode = undefined;

          // If approvedStatus exists (e.g. IN_PROGRESS), it implies original status was APPROVED.
          // Otherwise use the raw status (PENDING, REJECTED, NEEDS_UPDATE, or early CANCELLED)
          if (item.approvedStatus) {
            displayStatus = "APPROVED";
          } else {
            displayStatus = item.status;
          }
        } else {
          displayStatus = item.approvedStatus || item.status;
        }

        const mappedTopic: MyTopic = {
          id: item.id.toString(),
          code: displayCode,
          prize: item.prize,
          name: item.title,
          status: displayStatus,
          sessionStatus: item.sessionStatus,
          researchField: item.researchField,
          researchType: item.researchType,
          createdAt: new Date(item.submittedAt).toLocaleDateString("vi-VN"),
          type: item.status === "APPROVED" ? "TOPIC" : "PROPOSAL",
          role: item.studentLeaderId === user.id ? "LEADER" : "MEMBER",
          lecturer: {
            name: item.advisorName || item.advisor || "Chưa có giảng viên",
            username: item.advisorUsername || "",
            email: item.advisorEmail,
            phone: item.advisorPhone,
            avatar: item.advisorAvatar,
            id: item.advisorId || 0,
          },
          students: item.approvedMembers
            ? item.approvedMembers.map((m) => ({
              id: m.id.toString(),
              code: m.username || "",
              name: m.name,
              email: m.email,
              phone: m.phone,
              isLeader: item.studentLeaderId === m.id,
              avatar: m.avatar,
            }))
            : [],
          objective: item.objective,
          content: item.content,
          budget: item.budget ? parseInt(item.budget) : 0,
          note: item.note,
          description: item.short, // Map short description
          isLocked: isLocked, // Set lock status
        };
        setTopic(mappedTopic);
        console.log("Mapped Topic Data:", mappedTopic);
        console.log("Students with Avatar:", mappedTopic.students);

        setEditData({
          objective: item.objective,
          content: item.content,
          budget: item.budget ? parseFloat(item.budget.toString()) : 0,
          note: item.note,
          description: item.short, // Init description
          researchField: item.researchField,
          researchType: item.researchType,
        });
      } catch (error) {
        console.error("Failed to fetch topic detail", error);
        toast.error("Không thể tải thông tin đề tài");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [params.id, viewMode]);

  if (loading) {
    return (
      <div className="max-w-[1080px] mx-auto pb-20 animate-pulse">
        <div className="mb-6 h-9 w-32 bg-gray-200 rounded-md"></div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
          <div className="h-48 bg-gray-200"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div className="h-64 bg-gray-200 rounded-2xl"></div>
            <div className="h-64 bg-gray-200 rounded-2xl"></div>
          </div>
          <div className="space-y-6">
            <div className="h-40 bg-gray-200 rounded-2xl"></div>
            <div className="h-40 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="p-8 text-center text-gray-500">Không tìm thấy đề tài</div>
    );
  }

  const canEdit =
    topic.role === "LEADER" &&
    (topic.status === "PENDING" ||
      topic.status === "NEEDS_UPDATE" ||
      topic.status === "APPROVED" ||
      topic.status === "IN_PROGRESS" ||
      topic.status === "NOT_COMPLETED") &&
    topic.sessionStatus !== "COMPLETED" &&
    !topic.isLocked;

  const handleSave = async () => {
    // Validation
    if (
      editData.budget &&
      (editData.budget < 7000000 || editData.budget > 10000000)
    ) {
      toast.error("Kinh phí đề nghị phải từ 7.000.000 VNĐ đến 10.000.000 VNĐ");
      return;
    }

    setLoading(true);
    try {
      await topicService.update(parseInt(topic.id), {
        title: topic.name, // Keep existing title
        objective: editData.objective,
        content: editData.content,
        short: editData.description || topic.description, // Use description or fallback
        budget: editData.budget?.toString(),
        note: editData.note,
        researchField: editData.researchField || topic.researchField,
        researchType: editData.researchType || topic.researchType,
      });

      setTopic((prev) => (prev ? { ...prev, ...editData } : null));
      setIsEditing(false);
      toast.success("Cập nhật thành công!");
    } catch (error) {
      console.error("Failed to update topic", error);
      toast.error("Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // --- VIEW MODE: TOPIC (Official) ---
  if (viewMode === "topic") {
    const reportTypes = [
      {
        id: "MIDTERM_REPORT",
        label: "Báo cáo giữa kỳ",
        icon: FileText,
        color: "text-blue-500",
        bg: "bg-blue-50",
      },
      {
        id: "SCIENTIFIC_ARTICLE",
        label: "Bài báo khoa học",
        icon: BookOpen,
        color: "text-orange-500",
        bg: "bg-orange-50",
      },
      {
        id: "SCIENTIFIC_PRESENTATION",
        label: "Thuyết trình khoa học",
        icon: Presentation,
        bg: "bg-purple-50",
        color: "text-purple-600",
      },
      {
        id: "SUMMARY_REPORT",
        label: "Báo cáo tổng kết",
        icon: StickyNote,
        color: "text-purple-500",
        bg: "bg-purple-50",
      },
    ];

    // Logic check: disabled if sessionStatus != 'IN_PROGRESS' OR topic.status != 'IN_PROGRESS'
    // Logic check: disabled if sessionStatus != 'IN_PROGRESS' OR topic.status != 'IN_PROGRESS' (except NOT_COMPLETED still allows upload)
    const canSubmit =
      (topic.status === "IN_PROGRESS" || topic.status === "NOT_COMPLETED") &&
      topic.sessionStatus === "IN_PROGRESS";

    let disableReason = "";
    if (topic.status !== "IN_PROGRESS" && topic.status !== "NOT_COMPLETED") {
      disableReason = "Đóng";
    } else if (topic.sessionStatus !== "IN_PROGRESS") {
      disableReason = "Đóng";
    }

    return (
      <div className="max-w-[1080px] mx-auto pb-20">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            className="pl-0 hover:bg-transparent hover:text-blue-600 text-gray-500 gap-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Button>
        </div>

        {/* Header Card - SAME STYLE AS PROPOSAL VIEW */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-3">
                  {topic.code && (
                    <Badge className="bg-white/20 hover:bg-white/30 text-white border-none px-3 py-1 text-sm font-normal backdrop-blur-sm">
                      {topic.code}
                    </Badge>
                  )}
                  <div className="bg-white/90 rounded-full px-1 py-0.5">
                    <StatusBadge status={topic.status} />
                  </div>
                </div>
                <h1 className="text-3xl font-bold leading-tight mb-2">
                  {topic.name}
                </h1>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-blue-100 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>Ngày tạo: {topic.createdAt}</span>
                  </div>
                </div>
              </div>

              {/* Edit Controls - Copied from Proposal View */}
              {canEdit && (
                <div className="shrink-0">
                  {isEditing ? (
                    <div className="flex items-center gap-2 bg-white/10 p-1 rounded-lg backdrop-blur-sm">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsEditing(false)}
                        className="text-white hover:bg-white/20 hover:text-white"
                        disabled={loading}
                      >
                        <X className="w-4 h-4 mr-2" /> Hủy
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSave}
                        className="bg-white text-blue-600 hover:bg-blue-50 border-none"
                        disabled={loading}
                      >
                        <Save className="w-4 h-4 mr-2" /> Lưu
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="bg-white/10 hover:bg-white/20 text-white border-none backdrop-blur-sm"
                    >
                      <Edit2 className="w-4 h-4 mr-2" /> Chỉnh sửa
                    </Button>
                  )}
                </div>
              )}
            </div>
            {topic.prize && (
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-yellow-400/20 border border-yellow-400/30 rounded-xl backdrop-blur-sm text-yellow-100">
                <Crown className="w-5 h-5 text-yellow-300" />
                <span className="font-semibold">
                  Giải thưởng: {topic.prize}
                </span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100 bg-white">
            {/* Research Field */}
            <div className="p-6">
              <h4 className="flex items-center gap-2 font-semibold text-gray-900 mb-4">
                <BookOpen className="w-5 h-5 text-indigo-500" />
                Lĩnh vực nghiên cứu
              </h4>
              {isEditing ? (
                <Select
                  value={editData.researchField || ""}
                  onValueChange={(value) =>
                    setEditData({ ...editData, researchField: value })
                  }
                >
                  <SelectTrigger className="w-full bg-gray-50 border-gray-200">
                    <SelectValue placeholder="Chọn lĩnh vực" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tự nhiên">Tự nhiên</SelectItem>
                    <SelectItem value="Xã hội Nhân văn">
                      Xã hội Nhân văn
                    </SelectItem>
                    <SelectItem value="Giáo dục">Giáo dục</SelectItem>
                    <SelectItem value="Kỹ thuật">Kỹ thuật</SelectItem>
                    <SelectItem value="Nông Lâm-Ngư">Nông Lâm-Ngư</SelectItem>
                    <SelectItem value="Y dược">Y dược</SelectItem>
                    <SelectItem value="Môi trường">Môi trường</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="font-medium text-gray-900 bg-indigo-50/50 px-4 py-3 rounded-xl border border-indigo-100">
                  {topic.researchField || "Chưa cập nhật"}
                </div>
              )}
            </div>

            {/* Research Type */}
            <div className="p-6">
              <h4 className="flex items-center gap-2 font-semibold text-gray-900 mb-4">
                <FileText className="w-5 h-5 text-purple-500" />
                Loại hình nghiên cứu
              </h4>
              {isEditing ? (
                <Select
                  value={editData.researchType || ""}
                  onValueChange={(value) =>
                    setEditData({ ...editData, researchType: value })
                  }
                >
                  <SelectTrigger className="w-full bg-gray-50 border-gray-200">
                    <SelectValue placeholder="Chọn loại hình" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cơ bản">Cơ bản</SelectItem>
                    <SelectItem value="Ứng dụng">Ứng dụng</SelectItem>
                    <SelectItem value="Triển khai">Triển khai</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="font-medium text-gray-900 bg-purple-50/50 px-4 py-3 rounded-xl border border-purple-100">
                  {topic.researchType || "Chưa cập nhật"}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Report Submission Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div />
            <Badge
              variant={canSubmit ? "default" : "secondary"}
              className={
                canSubmit
                  ? "bg-green-100 text-green-700 hover:bg-green-100"
                  : "bg-red-100 text-red-700 hover:bg-red-100"
              }
            >
              {canSubmit ? "Mở" : disableReason}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reportTypes.map((type) => {
              const doc = documents.find((d) => d.documentType === type.id);
              return (
                <div
                  key={type.id}
                  className={`bg-white rounded-2xl border ${doc ? "border-blue-200 shadow-md" : canSubmit ? "border-gray-200 hover:shadow-md" : "border-gray-100 opacity-60"} shadow-sm p-6 transition-all`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl ${doc ? "bg-green-50" : type.bg} flex items-center justify-center`}
                      >
                        <type.icon
                          className={`w-5 h-5 ${doc ? "text-green-600" : type.color}`}
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {type.label}
                        </h4>
                        {doc ? (
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <a
                                href={`${process.env.NEXT_PUBLIC_API_URL}${doc.fileUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1 font-medium"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Download className="w-3 h-3" /> Tải về
                              </a>
                              {canSubmit && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteDocId(doc.id);
                                  }}
                                  className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 mt-1"
                                  title="Xóa file"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                            <span className="text-[10px] text-gray-400 mt-0.5">
                              {format(
                                new Date(doc.uploadedAt),
                                "dd/MM/yyyy HH:mm",
                              )}
                            </span>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-500 mt-0.5">
                            Chưa có tệp nào
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {doc?.scientificArticleSummary && (
                    <div className="mb-4 text-xs bg-gray-50 p-2 rounded border border-gray-100 text-gray-600 relative group/summary">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold">Tóm tắt: </span>
                        {canSubmit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 text-gray-400 hover:text-blue-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditSummaryDoc({
                                id: doc.id,
                                summary: doc.scientificArticleSummary || "",
                              });
                            }}
                          >
                            <Edit2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                      {doc.scientificArticleSummary}
                    </div>
                  )}

                  <div
                    className={`border-2 border-dashed ${doc ? "border-blue-100 bg-blue-50/30" : "border-gray-100"} rounded-xl p-4 text-center transition-colors group ${canSubmit ? "hover:bg-gray-50/50 cursor-pointer" : "cursor-not-allowed bg-gray-50"}`}
                    onClick={() => {
                      if (canSubmit) {
                        setSelectedReportType({
                          id: type.id,
                          label: type.label,
                        });
                        setUploadInitialSummary(
                          doc?.scientificArticleSummary || "",
                        );
                        setUploadDialogOpen(true);
                      }
                    }}
                  >
                    <Upload
                      className={`w-5 h-5 mx-auto mb-2 transition-colors ${canSubmit ? "text-gray-400 group-hover:text-blue-500" : "text-gray-300"}`}
                    />
                    <p
                      className={`text-sm font-medium ${canSubmit ? "text-gray-500 group-hover:text-blue-600" : "text-gray-400"}`}
                    >
                      {canSubmit
                        ? doc
                          ? "Cập nhật file"
                          : "Click để tải lên"
                        : "Tạm khóa"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <UploadReportDialog
            open={uploadDialogOpen}
            onOpenChange={setUploadDialogOpen}
            topicId={parseInt(topic.id)}
            reportType={selectedReportType}
            initialSummary={uploadInitialSummary}
            onSuccess={() => {
              fetchDocs(); // Refresh list on success
            }}
          />

          {editSummaryDoc && (
            <EditSummaryDialog
              open={!!editSummaryDoc}
              onOpenChange={(open) => !open && setEditSummaryDoc(null)}
              documentId={editSummaryDoc.id}
              initialSummary={editSummaryDoc.summary}
              onSuccess={() => fetchDocs()}
            />
          )}

          <AlertDialog
            open={!!deleteDocId}
            onOpenChange={(open) => !open && setDeleteDocId(null)}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận xóa tài liệu</AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn có chắc chắn muốn xóa tài liệu này không? Hành động này
                  không thể hoàn tác.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmDelete}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Xác nhận xóa
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    );
  }

  // --- VIEW MODE: PROPOSAL (Default) ---
  return (
    <div className="max-w-[1080px] mx-auto pb-20">
      {/* Back Button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          className="pl-0 hover:bg-transparent hover:text-blue-600 text-gray-500 gap-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Button>
      </div>

      {/* Header Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3">
                {topic.code && (
                  <Badge className="bg-white/20 hover:bg-white/30 text-white border-none px-3 py-1 text-sm font-normal backdrop-blur-sm">
                    {topic.code}
                  </Badge>
                )}
                <div className="bg-white/90 rounded-full px-1 py-0.5">
                  <StatusBadge status={topic.status} />
                </div>
              </div>
              <h1 className="text-3xl font-bold leading-tight">{topic.name}</h1>
              <div className="flex items-center gap-2 text-blue-100 text-sm">
                <Calendar className="w-4 h-4" />
                <span>Ngày tạo: {topic.createdAt}</span>
              </div>
            </div>

            {canEdit && (
              <div className="shrink-0">
                {isEditing ? (
                  <div className="flex items-center gap-2 bg-white/10 p-1 rounded-lg backdrop-blur-sm">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsEditing(false)}
                      className="text-white hover:bg-white/20 hover:text-white"
                      disabled={loading}
                    >
                      <X className="w-4 h-4 mr-2" /> Hủy
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      className="bg-white text-blue-600 hover:bg-blue-50 border-none"
                      disabled={loading}
                    >
                      <Save className="w-4 h-4 mr-2" /> Lưu
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-white/10 hover:bg-white/20 text-white border-none backdrop-blur-sm"
                  >
                    <Edit2 className="w-4 h-4 mr-2" /> Chỉnh sửa
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100 border-b border-gray-100">
          <div className="p-6">
            <h4 className="flex items-center gap-2 font-semibold text-gray-900 mb-4">
              <User className="w-5 h-5 text-blue-500" />
              Giảng viên hướng dẫn
            </h4>
            <div className="flex items-center gap-3">

              <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                <AvatarImage
                  src={getAvatarUrl(topic.lecturer.avatar)}
                  alt={topic.lecturer.name}
                />
                <AvatarFallback className="bg-blue-50 text-blue-600 font-bold text-lg">
                  {getInitials(topic.lecturer.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-bold text-gray-900">
                  {topic.lecturer.name}
                </div>
                <div className="text-sm text-blue-600 font-medium">
                  @{topic.lecturer.username}
                </div>
                {topic.lecturer.phone && (
                  <div className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3" />
                    {topic.lecturer.phone}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 md:col-span-2">
            <h4 className="flex items-center gap-2 font-semibold text-gray-900 mb-4">
              <Users className="w-5 h-5 text-purple-500" />
              Sinh viên thực hiện
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {topic.students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50"
                >
                  <Avatar className="w-10 h-10 border border-white shadow-sm">
                    <AvatarImage
                      src={getAvatarUrl(student.avatar)}
                      alt={student.name}
                    />
                    <AvatarFallback className="bg-purple-50 text-purple-600 font-bold text-sm">
                      {getInitials(student.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {student.name}
                      </p>
                      {student.isLeader && (
                        <Crown className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-purple-600 font-medium">
                      {student.code}
                    </p>

                    <div className="mt-1 space-y-0.5">
                      {student.email && (
                        <p className="text-[10px] text-gray-500 flex items-center gap-1 truncate">
                          <Mail className="w-3 h-3" /> {student.email}
                        </p>
                      )}
                      {student.phone && (
                        <p className="text-[10px] text-gray-500 flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {student.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h4 className="flex items-center gap-2 font-bold text-gray-900 mb-4 text-lg">
              <StickyNote className="w-5 h-5 text-blue-500" />
              Mô tả đề tài
            </h4>
            {isEditing ? (
              <Textarea
                value={editData.description || ""}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
                className="min-h-[80px] text-base"
                placeholder="Nhập mô tả ngắn về đề tài..."
              />
            ) : (
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {topic.description || "Chưa có thông tin"}
              </div>
            )}
          </div>

          {/* Objective */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h4 className="flex items-center gap-2 font-bold text-gray-900 mb-4 text-lg">
              <Target className="w-5 h-5 text-green-500" />
              Mục tiêu đề tài
            </h4>
            {isEditing ? (
              <Textarea
                value={editData.objective || ""}
                onChange={(e) =>
                  setEditData({ ...editData, objective: e.target.value })
                }
                className="min-h-[120px] text-base"
                placeholder="Nhập mục tiêu đề tài..."
              />
            ) : (
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {topic.objective || "Chưa có thông tin"}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h4 className="flex items-center gap-2 font-bold text-gray-900 mb-4 text-lg">
              <FileText className="w-5 h-5 text-orange-500" />
              Nội dung thực hiện
            </h4>
            {isEditing ? (
              <Textarea
                value={editData.content || ""}
                onChange={(e) =>
                  setEditData({ ...editData, content: e.target.value })
                }
                className="min-h-[200px] text-base"
                placeholder="Nhập nội dung thực hiện..."
              />
            ) : (
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {topic.content || "Chưa có thông tin"}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h4 className="flex items-center gap-2 font-bold text-gray-900 mb-4">
              <DollarSign className="w-5 h-5 text-red-500" />
              Kinh phí đề nghị
            </h4>
            {isEditing ? (
              <div className="relative">
                <input
                  type="number"
                  value={editData.budget || 0}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      budget: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập kinh phí..."
                />
                <span className="absolute right-3 top-2.5 text-gray-500 text-sm">
                  VNĐ
                </span>
              </div>
            ) : (
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {topic.budget ? `${topic.budget.toLocaleString()} VNĐ` : "—"}
                </div>
                <p className="text-sm text-gray-500 mt-1">VNĐ</p>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h4 className="flex items-center gap-2 font-bold text-gray-900 mb-4">
              <StickyNote className="w-5 h-5 text-gray-500" />
              Ghi chú
            </h4>
            {isEditing ? (
              <Textarea
                value={editData.note || ""}
                onChange={(e) =>
                  setEditData({ ...editData, note: e.target.value })
                }
                className="min-h-[100px] text-base"
                placeholder="Nhập ghi chú..."
              />
            ) : (
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-gray-600 text-sm italic">
                {topic.note || "Không có ghi chú"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
