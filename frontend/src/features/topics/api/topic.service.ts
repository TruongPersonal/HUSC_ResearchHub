import api from "@/lib/api";
import { PageResponse } from "@/types/common";
import { TopicRow, TopicStatus, TopicResponse } from "@/features/topics/types";

// Backend DTO matches

export const topicService = {
    getAll: async (keyword?: string, status?: TopicStatus, departmentId?: number, academicYearId?: number, page = 0, size = 10): Promise<PageResponse<TopicRow>> => {
        const params: Record<string, any> = { page, size };
        if (keyword) params.keyword = keyword;
        if (status) params.status = status;
        if (departmentId) params.departmentId = departmentId;
        if (academicYearId) params.academicYearId = academicYearId;

        const response = await api.get<PageResponse<TopicResponse>>("/topics", { params });

        // Map backend response to frontend model
        const mappedContent = response.data.content.map(mapToTopicRow);

        return {
            ...response.data,
            content: mappedContent
        };
    },

    getDetail: async (id: number): Promise<TopicRow> => {
        const response = await api.get<TopicResponse>(`/topics/${id}`);
        return mapToTopicRow(response.data);
    },

    update: async (id: number, data: Partial<TopicRow>): Promise<void> => {
        const payload = {
            name: data.title,
            description: data.short,
            target: data.objective,
            mainContent: data.content,
            budget: data.budget ? parseFloat(data.budget) : null,
            note: data.note,
            researchField: data.researchField,
            researchType: data.researchType
        };
        await api.put(`/topics/${id}`, payload);
    },

    updateStatus: async (id: number, status: TopicStatus, feedback?: string): Promise<void> => {
        await api.put(`/topics/${id}/status`, { status, feedback });
    },

    assignAdvisor: async (id: number, userId: number): Promise<void> => {
        await api.put(`/topics/${id}/assign-advisor`, { userId });
    },

    assignLeader: async (id: number, userId: number): Promise<void> => {
        await api.put(`/topics/${id}/assign-leader`, { userId });
    },

    approveMember: async (id: number, userId: number): Promise<void> => {
        await api.post(`/topics/${id}/members/approve`, { userId });
    },

    rejectMember: async (id: number, userId: number): Promise<void> => {
        await api.post(`/topics/${id}/members/reject`, { userId });
    },

    // Student methods
    propose: async (data: any): Promise<void> => {
        await api.post("/topics", data);
    },

    register: async (id: number): Promise<void> => {
        await api.post(`/topics/${id}/register`);
    },

    getMyTopics: async (): Promise<TopicRow[]> => {
        const response = await api.get<TopicResponse[]>("/topics/my-topics");
        return response.data.map(mapToTopicRow);
    }
};

function mapToTopicRow(dto: TopicResponse): TopicRow {
    return {
        id: dto.id,
        code: dto.code,
        prize: dto.prize,
        title: dto.title,
        short: dto.shortDescription,
        status: dto.status,
        approvedStatus: dto.approvedStatus,
        sessionStatus: dto.sessionStatus,
        researchField: dto.researchField,
        researchType: dto.researchType,
        studentLeader: dto.studentLeaderName,
        studentLeaderId: dto.studentLeaderId,
        studentLeaderEmail: dto.studentLeaderEmail,
        studentLeaderPhone: dto.studentLeaderPhone,
        advisor: dto.advisorName,
        advisorName: dto.advisorName,
        advisorUsername: dto.advisorUsername,
        advisorEmail: dto.advisorEmail,
        advisorPhone: dto.advisorPhone,
        advisorId: dto.advisorId,
        submittedAt: dto.createdAt,
        objective: dto.objective,
        content: dto.content,
        budget: dto.budget?.toString(),
        note: dto.note,
        pendingMembers: dto.pendingMembers,
        approvedMembers: dto.approvedMembers,
        rejectedMembers: dto.rejectedMembers,
        advisors: dto.advisors
    };
}
