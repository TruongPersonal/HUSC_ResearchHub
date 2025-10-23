"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Megaphone, Pencil, Trash2 } from "lucide-react";

/* ===== Types ===== */
type Announcement = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  createdBy?: string;
};

/* ===== Mock data ===== */
const MOCK: Announcement[] = [
  {
    id: "a-001",
    title: "Thông báo họp giao ban tuần",
    content: "Toàn bộ trợ lý khoa họp lúc 14:00 thứ Hai tại phòng A201.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    createdBy: "assistant_001",
  },
  {
    id: "a-002",
    title: "Nhắc hạn đăng ký đề tài NCKH",
    content: "Sinh viên hoàn tất đăng ký đề tài trước 23:59 ngày 25/10.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    createdBy: "assistant_002",
  },
];

/* ===== Helpers ===== */
const genId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : "id-" + Math.random().toString(36).slice(2);

export default function AssistantNotificationsPage() {
  const [items, setItems] = useState<Announcement[]>(MOCK);
  const [pending, startTransition] = useTransition();

  // Sheet xem thông báo chung (nếu cần, bạn có thể quay lại dùng Sheet)
  // const [openSheet, setOpenSheet] = useState(false);

  // create form
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // edit
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [editForm, setEditForm] = useState({ title: "", content: "" });

  // delete confirm
  const [confirmText, setConfirmText] = useState("");

  const create = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    startTransition(() => {
      const next: Announcement = {
        id: genId(),
        title: title.trim(),
        content: content.trim(),
        createdAt: new Date().toISOString(),
        createdBy: "assistant_001",
      };
      setItems((prev) => [next, ...prev]);
      setTitle("");
      setContent("");
    });
  };

  const beginEdit = (a: Announcement) => {
    setEditing(a);
    setEditForm({ title: a.title, content: a.content });
  };

  const saveEdit = () => {
    if (!editing) return;
    startTransition(() => {
      setItems((prev) =>
        prev.map((x) =>
          x.id === editing.id
            ? { ...x, title: editForm.title, content: editForm.content }
            : x
        )
      );
      setEditing(null);
    });
  };

  const hardDelete = (id: string) => {
    startTransition(() => {
      setItems((prev) => prev.filter((x) => x.id !== id));
      setConfirmText("");
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Quản lý thông báo
          </h1>
          <p className="text-sm text-gray-600">
            Tạo mới, sửa, xóa thông báo chung trong khoa.
          </p>
        </div>
      </div>

      {/* Create Card */}
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-blue-600" />
          <h2 className="text-base font-semibold">Tạo thông báo</h2>
        </div>
        <form onSubmit={create} className="space-y-3">
          <input
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Tiêu đề"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="w-full rounded-lg border px-3 py-2 min-h-[120px]"
            placeholder="Nội dung"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex gap-2">
            <Button type="submit" className="ml-auto px-4" disabled={pending}>
              Thêm mới
            </Button>
          </div>
        </form>
      </div>

      {/* List Card */}
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="mb-3 text-base font-semibold">Danh sách thông báo</div>

        {!items.length ? (
          <div className="text-sm text-neutral-500">Chưa có thông báo.</div>
        ) : (
          <div className="space-y-3">
            {items.map((a) => (
              <div key={a.id} className="rounded-xl border bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{a.title}</div>
                    <div className="mt-1 whitespace-pre-wrap text-sm text-neutral-700">
                      {a.content}
                    </div>
                    <div className="mt-2 text-xs text-neutral-500">
                      {new Date(a.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {/* Edit */}
                    <Dialog onOpenChange={(open) => !open && setEditing(null)}>
                      <DialogTrigger asChild>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => beginEdit(a)}
                        >
                          <Pencil className="mr-1 h-4 w-4" /> Sửa
                        </Button>
                      </DialogTrigger>
                      {editing?.id === a.id && (
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Sửa thông báo</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-3">
                            <input
                              className="w-full rounded-lg border px-3 py-2"
                              value={editForm.title}
                              onChange={(e) =>
                                setEditForm((s) => ({
                                  ...s,
                                  title: e.target.value,
                                }))
                              }
                            />
                            <textarea
                              className="w-full min-h-[120px] rounded-lg border px-3 py-2"
                              value={editForm.content}
                              onChange={(e) =>
                                setEditForm((s) => ({
                                  ...s,
                                  content: e.target.value,
                                }))
                              }
                            />
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                onClick={() => setEditing(null)}
                              >
                                Hủy
                              </Button>
                              <Button onClick={saveEdit} disabled={pending}>
                                Lưu
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      )}
                    </Dialog>

                    {/* Hard Delete */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={pending}
                        >
                          <Trash2 className="mr-1 h-4 w-4" /> Xóa
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Xóa thông báo này?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Hành động này không thể hoàn tác. Bạn có chắc chắn
                            muốn xóa?
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => hardDelete(a.id)}
                            disabled={pending}
                          >
                            Xác nhận xóa
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* Component nhỏ cho Confirm Delete */
function ConfirmDeleteInput({
  onConfirm,
  onCancel,
  pending,
  confirmText,
  setConfirmText,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  pending: boolean;
  confirmText: string;
  setConfirmText: (v: string) => void;
}) {
  return (
    <>
      <input
        autoFocus
        className="mt-3 w-full rounded-md border px-3 py-2"
        placeholder="Gõ XOA để xác nhận"
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
      />
      <AlertDialogFooter>
        <AlertDialogCancel onClick={onCancel}>Hủy</AlertDialogCancel>
        <AlertDialogAction
          disabled={confirmText !== "XOA" || pending}
          onClick={onConfirm}
        >
          Tôi hiểu, xóa vĩnh viễn
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );
}
