import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ApprovedTopicResponse,
  ApprovedTopicDocumentResponse,
} from "@/features/topics/types";
import { approvedTopicService } from "@/features/topics/api/approved-topic.service";
import { FileText, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface ApprovedTopicReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topic: ApprovedTopicResponse | null;
}

/**
 * Dialog xem danh sách tài liệu báo cáo của Đề tài đã duyệt.
 * Hiển thị các file báo cáo giữa kỳ, báo cáo tổng kết, bài báo khoa học, v.v.
 */
export function ApprovedTopicReportDialog({
  open,
  onOpenChange,
  topic,
}: ApprovedTopicReportDialogProps) {
  const [documents, setDocuments] = useState<ApprovedTopicDocumentResponse[]>(
    [],
  );
  const [loadingDocs, setLoadingDocs] = useState(false);

  useEffect(() => {
    if (open && topic) {
      fetchDocuments(topic.id);
    } else {
      setDocuments([]);
    }
  }, [open, topic]);

  const fetchDocuments = async (id: number) => {
    setLoadingDocs(true);
    try {
      const docs = await approvedTopicService.getDocuments(id);
      setDocuments(docs);
    } catch (error) {
      console.error("Failed to fetch documents", error);
    } finally {
      setLoadingDocs(false);
    }
  };

  if (!topic) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] md:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Xem tài liệu</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-lg font-semibold text-[#0b57a8]">
            {topic.topic.title}
          </div>

          <div className="space-y-4">
            <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Tài liệu báo cáo ({documents.length})
            </div>

            {loadingDocs ? (
              <div className="flex items-center gap-2 text-sm text-gray-500 justify-center py-8">
                <Loader2 className="h-4 w-4 animate-spin" /> Đang tải tài
                liệu...
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg bg-gray-50">
                Chưa có tài liệu nào.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {documents.map((doc) => {
                  let typeLabel: string = doc.documentType;
                  switch (doc.documentType) {
                    case "MIDTERM_REPORT":
                      typeLabel = "Báo cáo giữa kỳ";
                      break;
                    case "SUMMARY_REPORT":
                      typeLabel = "Báo cáo tổng kết";
                      break;
                    case "SCIENTIFIC_ARTICLE":
                      typeLabel = "Bài báo khoa học";
                      break;
                    case "SCIENTIFIC_PRESENTATION":
                      typeLabel = "Thuyết trình khoa học";
                      break;
                  }

                  return (
                    <div
                      key={doc.id}
                      className="flex flex-col p-3 rounded-md border border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm transition-all gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="h-10 w-10 rounded bg-blue-50 flex items-center justify-center flex-shrink-0">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {typeLabel}
                            </p>
                            <p className="text-xs text-gray-500">
                              {format(
                                new Date(doc.uploadedAt),
                                "dd/MM/yyyy HH:mm",
                              )}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() =>
                            window.open(
                              `http://localhost:8080${doc.fileUrl}`,
                              "_blank",
                            )
                          }
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>

                      {doc.scientificArticleSummary && (
                        <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-100 mt-1">
                          <span className="font-semibold">Tóm tắt: </span>
                          {doc.scientificArticleSummary}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
