"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Button } from "../../../components/ui/button";
import { Plus, Inbox, Send, Search, Trash2, ArrowLeft, Pencil } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../../../components/ui/dialog";
import { Textarea } from "../../../components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { toast } from "sonner";
import { useDebounce } from "../../../hooks/useDebounce";
import { cn } from "../../../lib/utils";
import { Pagination } from "../../../components/ui/pagination";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../../../components/ui/alert-dialog";
import { authService } from "@/features/auth/api/auth.service";
import { chatService, ChatPartner, Message } from "../api/chat.service";

// --- COMPOSE FORM COMPONENT ---
function ComposeForm({ onSent, currentUserId }: { onSent: () => void, currentUserId: number | null }) {
    const [recipientQuery, setRecipientQuery] = useState("");
    const [searchResults, setSearchResults] = useState<ChatPartner[]>([]);
    const [selectedUser, setSelectedUser] = useState<ChatPartner | null>(null);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const debouncedQuery = useDebounce(recipientQuery, 500);

    useEffect(() => {
        const search = async () => {
            if (!debouncedQuery.trim()) { setSearchResults([]); return; }
            if (selectedUser && debouncedQuery === selectedUser.fullName) return;
            setLoading(true);
            try {
                const data = await chatService.getPartners(debouncedQuery);
                setSearchResults(data.filter(u => u.id !== currentUserId));
            } catch (error) { console.error(error); } finally { setLoading(false); }
        };
        search();
    }, [debouncedQuery, selectedUser, currentUserId]);

    const handleSend = async () => {
        if (!selectedUser || !content.trim()) return toast.error("Vui lòng chọn người nhận và nhập nội dung");
        try {
            await chatService.sendMessage({ receiverId: selectedUser.id, content });
            toast.success("Đã gửi tin nhắn");
            setSelectedUser(null); setRecipientQuery(""); setContent("");
            onSent();
        } catch (error) { console.error(error); toast.error("Gửi thất bại"); }
    };

    return (
        <div className="space-y-4 pt-4">
            <div className="grid gap-2">
                <label className="text-sm font-bold text-gray-700">Người nhận:</label>
                <div className="relative">
                    <Input placeholder="Nhập tên người nhận..." value={recipientQuery}
                        onChange={(e) => {
                            setRecipientQuery(e.target.value);
                            if (selectedUser && e.target.value !== selectedUser.fullName) setSelectedUser(null);
                        }} />
                    {searchResults.length > 0 && !selectedUser && (
                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                            {searchResults.map(user => (
                                <div key={user.id} onClick={() => { setSelectedUser(user); setRecipientQuery(user.fullName); setSearchResults([]); }}
                                    className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
                                    <Avatar className="h-6 w-6"><AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback></Avatar>
                                    <div className="text-sm"><span className="font-medium">{user.fullName}</span> <span className="text-xs text-gray-500">({user.role})</span></div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="grid gap-2">
                <label className="text-sm font-bold text-gray-700">Nội dung:</label>
                <Textarea value={content} onChange={e => setContent(e.target.value)} className="min-h-[150px]" placeholder="Nhập nội dung..." />
            </div>
            <div className="flex justify-end pt-2">
                <Button onClick={handleSend} className="bg-blue-600 hover:bg-blue-700 text-white"><Send className="h-4 w-4 mr-2" /> Gửi tin nhắn</Button>
            </div>
        </div>
    );
}

// --- MAIN LAYOUT ---
export function ChatLayout() {
    const [activeTab, setActiveTab] = useState("inbox");
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [composeOpen, setComposeOpen] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;

    // Edit State
    const [editingMessage, setEditingMessage] = useState<Message | null>(null);
    const [editContent, setEditContent] = useState("");

    // Delete State
    const [messageToDelete, setMessageToDelete] = useState<number | null>(null);

    // Reply State
    const [replyOpen, setReplyOpen] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            try { const p = await authService.getProfile(); setCurrentUserId(p.id); } catch (e) { console.error(e); }
        };
        loadProfile();
    }, []);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const data = activeTab === "inbox" ? await chatService.getInbox() : await chatService.getSent();
            setMessages(data);
        } catch (e) { console.error(e); toast.error("Lỗi tải tin nhắn"); } finally { setLoading(false); }
    };

    useEffect(() => { fetchMessages(); setSelectedMessage(null); setCurrentPage(0); }, [activeTab]);

    const handleDeleteClick = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        setMessageToDelete(id);
    };

    const confirmDelete = async () => {
        if (!messageToDelete) return;
        try {
            await chatService.deleteMessage(messageToDelete);
            toast.success("Đã xoá tin nhắn thành công");
            fetchMessages();
        } catch (e) { toast.error("Xoá thất bại"); }
        setMessageToDelete(null);
    };

    const handleEditClick = (e: React.MouseEvent, msg: Message) => {
        e.stopPropagation();
        setEditingMessage(msg);
        setEditContent(msg.content);
    };

    const handleSaveEdit = async () => {
        if (!editingMessage || !editContent.trim()) return;
        try {
            await chatService.updateMessage(editingMessage.id, editContent);
            toast.success("Đã cập nhật tin nhắn");
            setEditingMessage(null);
            fetchMessages();
        } catch (e) { toast.error("Cập nhật thất bại"); }
    };

    const filtered = messages.filter(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (activeTab === 'inbox' ? m.senderName : m.receiverName).toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination Logic
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginatedMessages = filtered.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    return (
        <div className="max-w-[1080px] mx-auto pb-12 font-sans">
            {/* Header */}
            <div className="mb-8 flex items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Tin nhắn</h1>
                    <p className="text-gray-500 mt-1">Hộp thư đến và tin nhắn đã gửi.</p>
                </div>
                <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700 shadow-sm transition-all">
                            <Plus className="w-4 h-4 mr-2" /> Soạn tin mới
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader><DialogTitle>Soạn tin nhắn mới</DialogTitle></DialogHeader>
                        <ComposeForm currentUserId={currentUserId} onSent={() => { setComposeOpen(false); if (activeTab === 'sent') fetchMessages(); }} />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Alert Dialog for Delete */}
            <AlertDialog open={!!messageToDelete} onOpenChange={(open) => !open && setMessageToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xoá</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xoá tin nhắn này không? Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">Xoá</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Edit Dialog */}
            <Dialog open={!!editingMessage} onOpenChange={(open) => !open && setEditingMessage(null)}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Chỉnh sửa tin nhắn</DialogTitle></DialogHeader>
                    <div className="space-y-4 pt-2">
                        <Textarea value={editContent} onChange={e => setEditContent(e.target.value)} className="min-h-[150px]" />
                        <DialogFooter>
                            <Button onClick={handleSaveEdit}>Lưu thay đổi</Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <div className="flex justify-between items-center">
                    <TabsList className="bg-gray-100/50 p-1 rounded-lg inline-flex h-auto border border-gray-200/50">
                        <TabsTrigger value="inbox" className="px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm font-medium transition-all gap-2 text-sm">
                            <Inbox className="w-4 h-4" /> Tin nhắn đến
                        </TabsTrigger>
                        <TabsTrigger value="sent" className="px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm font-medium transition-all gap-2 text-sm">
                            <Send className="w-4 h-4" /> Tin nhắn đã gửi
                        </TabsTrigger>
                    </TabsList>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                        <Input placeholder="Tìm kiếm tin nhắn..." className="pl-9 bg-white w-64 border-gray-200 shadow-sm" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                    </div>
                </div>

                {/* Message Detail Dialog */}
                <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader><DialogTitle>Chi tiết tin nhắn</DialogTitle></DialogHeader>
                        {selectedMessage && (
                            <div className="space-y-4">
                                <div className="flex justify-between border-b pb-2">
                                    <div>
                                        <p className="text-sm text-gray-500">Người gửi: <span className="font-medium text-gray-900">{selectedMessage.senderName}</span></p>
                                        <p className="text-sm text-gray-500">Người nhận: <span className="font-medium text-gray-900">{selectedMessage.receiverName}</span></p>
                                    </div>
                                    <p className="text-sm text-gray-500">{new Date(selectedMessage.createdAt).toLocaleString("vi-VN")}</p>
                                </div>
                                <div className="min-h-[100px] whitespace-pre-wrap text-gray-800">{selectedMessage.content}</div>
                                <div className="flex justify-end gap-2 pt-4">
                                    {activeTab === 'inbox' && (
                                        <Dialog open={replyOpen} onOpenChange={setReplyOpen}>
                                            <DialogTrigger asChild><Button className="bg-blue-600 hover:bg-blue-700 text-white"><Send className="h-4 w-4 mr-2" /> Trả lời</Button></DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader><DialogTitle>Trả lời tin nhắn</DialogTitle></DialogHeader>
                                                {/* Simple inline reply form */}
                                                <div className="space-y-3 pt-2">
                                                    <p className="text-sm font-medium">Đến: {selectedMessage.senderName}</p>
                                                    <Textarea id="reply-box" placeholder="Nhập nội dung..." />
                                                    <Button onClick={async () => {
                                                        const val = (document.getElementById('reply-box') as HTMLTextAreaElement).value;
                                                        if (!val) return toast.error("Nhập nội dung");
                                                        try {
                                                            await chatService.sendMessage({ receiverId: selectedMessage.senderId, content: val });
                                                            toast.success("Đã gửi tin nhắn");
                                                            setReplyOpen(false);
                                                        } catch (e) { console.error(e); }
                                                    }} className="w-full bg-blue-600 hover:bg-blue-700 text-white">Gửi</Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* List View */}
                <div className="bg-white border rounded-lg shadow-sm overflow-hidden min-h-[400px]">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50/50">
                                <TableHead className="w-[200px]">{activeTab === 'sent' ? 'Người nhận' : 'Người gửi'}</TableHead>
                                <TableHead>Nội dung</TableHead>
                                {/* Removed Time Column as requested */}
                                <TableHead className="w-[100px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedMessages.length === 0 ? (
                                <TableRow className="hover:bg-transparent"><TableCell colSpan={3} className="h-32 text-center text-gray-500">Không có tin nhắn nào</TableCell></TableRow>
                            ) : (
                                paginatedMessages.map(msg => (
                                    <TableRow key={msg.id}
                                        className="cursor-pointer hover:bg-gray-50 bg-white"
                                        onClick={() => {
                                            setSelectedMessage(msg);
                                            if (!msg.isRead && activeTab === 'inbox') {
                                                chatService.markAsRead(msg.id);
                                                setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, isRead: true } : m));
                                            }
                                        }}
                                    >
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {!msg.isRead && activeTab === 'inbox' && (
                                                    <div className="w-2 h-2 bg-red-600 rounded-full shrink-0 animate-pulse" />
                                                )}
                                                <span>{activeTab === 'sent' ? msg.receiverName : msg.senderName}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell><div className="line-clamp-1 max-w-[500px] text-gray-600">{msg.content}</div></TableCell>
                                        {/* Removed Time Cell */}
                                        <TableCell>
                                            <div className="flex justify-end gap-1">
                                                {activeTab === 'sent' && (
                                                    <>
                                                        <Button variant="ghost" size="icon" onClick={(e) => handleEditClick(e, msg)}>
                                                            <Pencil className="h-4 w-4 text-gray-400 hover:text-blue-600" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" onClick={(e) => handleDeleteClick(e, msg.id)}>
                                                            <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-600" />
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <div className="mt-4 flex justify-end">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages || 1}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </Tabs>
        </div>
    );
}
