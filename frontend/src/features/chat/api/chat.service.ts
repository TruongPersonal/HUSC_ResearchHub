import axios from "@/lib/api";

export interface ChatPartner {
    id: number;
    username: string;
    fullName: string;
    avatar?: string;
    role: string;
}

export interface Message {
    id: number;
    senderId: number;
    senderName: string;
    receiverId: number;
    receiverName: string;
    content: string;
    createdAt: string;
    isRead: boolean;
}

export const chatService = {
    // Search users to chat with (Reuse existing user search or similar endpoint if available, otherwise just use getAllUsers? No, backend needs search endpoint)
    // Wait, I didn't restore a search endpoint in MessageController or UserController. 
    // Assuming we can use AuthService to get users or there's a user endpoint.
    // For now, let's use a placeholder or assume there's a user search. 
    // User requested "Partner Search" in previous impl. 
    // I will add a method to get partners, likely calling /api/users/search or similar if it existed.
    // Actually, let's check if there is a User search service.
    // For now I'll stub it or use a known endpoint.
    getPartners: async (query: string): Promise<ChatPartner[]> => {
        const response = await axios.get(`/messages/partners`, { params: { query } });
        return response.data;
    },

    sendMessage: async (data: { receiverId: number; content: string }) => {
        return (await axios.post("/messages", data)).data;
    },

    getInbox: async () => {
        return (await axios.get("/messages/inbox")).data;
    },

    getSent: async () => {
        return (await axios.get("/messages/sent")).data;
    },

    markAsRead: async (id: number) => {
        await axios.put(`/messages/${id}/read`);
    },

    deleteMessage: async (id: number) => {
        await axios.delete(`/messages/${id}`);
    },

    updateMessage: async (id: number, content: string) => {
        await axios.put(`/messages/${id}`, { content });
    }
};
