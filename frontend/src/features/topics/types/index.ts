export type TopicStatus = "PENDING" | "NEEDS_UPDATE" | "REJECTED" | "APPROVED" | "CANCELLED" | "CANCELED";

export interface TopicRow {
    id: number;
    code?: string;
    prize?: string;
    title: string;
    short?: string;
    status: TopicStatus;
    approvedStatus?: "IN_PROGRESS" | "COMPLETED" | "NOT_COMPLETED" | "CANCELED" | "CANCELLED";
    sessionStatus?: "ON_REGISTRATION" | "UNDER_REVIEW" | "IN_PROGRESS" | "COMPLETED";
    researchField?: string;
    researchType?: string;
    studentLeader?: string; // Name
    studentLeaderId?: number;
    studentLeaderEmail?: string;
    studentLeaderPhone?: string;
    advisor?: string;       // Name
    advisorName?: string;   // Alternative from backend
    advisorUsername?: string;
    advisorEmail?: string;
    advisorPhone?: string;
    advisorId?: number;
    submittedAt: string;    // ISO
    objective?: string;
    content?: string;
    budget?: string;
    note?: string;
    pendingMembers?: { id: number; name: string; email?: string; username?: string; phone?: string }[];
    approvedMembers?: { id: number; name: string; email?: string; username?: string; phone?: string }[];
    rejectedMembers?: { id: number; name: string; email?: string; username?: string; phone?: string }[];
    advisors?: { id: number; name: string; email?: string; username?: string; phone?: string }[];
}

export interface TopicResponse {
    id: number;
    code?: string;
    prize?: string;
    title: string;
    shortDescription?: string;
    objective?: string;
    content?: string;
    budget?: number;
    note?: string;
    status: TopicStatus;
    approvedStatus?: "IN_PROGRESS" | "COMPLETED" | "NOT_COMPLETED" | "CANCELED" | "CANCELLED";
    sessionStatus?: "ON_REGISTRATION" | "UNDER_REVIEW" | "IN_PROGRESS" | "COMPLETED";
    researchField?: string;
    researchType?: string;
    createdAt: string;
    advisorId?: number;
    advisorName?: string;
    advisorUsername?: string;
    advisorEmail?: string;
    advisorPhone?: string;
    studentLeaderId?: number;
    studentLeaderName?: string;
    studentLeaderEmail?: string;
    studentLeaderPhone?: string;
    pendingMembers?: { id: number; name: string; email?: string; username?: string; phone?: string }[];
    approvedMembers?: { id: number; name: string; email?: string; username?: string; phone?: string }[];
    rejectedMembers?: { id: number; name: string; email?: string; username?: string; phone?: string }[];
    advisors?: { id: number; name: string; email?: string; username?: string; phone?: string }[];
}

export type ProposalStatus = "PENDING" | "NEEDS_UPDATE" | "REJECTED" | "APPROVED" | "CANCELLED" | "CANCELED";

export interface Topic {
    id: number;
    code?: string;
    name: string;
    description?: string;
    lecturer: {
        id: number;
        name: string;
        username?: string;
        avatar?: string;
    };
    status: TopicStatus;
    createdAt: string;
    students?: {
        id: string;
        code: string;
        name: string;
        isLeader?: boolean;
    }[];
    isPending?: boolean;
    isApproved?: boolean;
    isRejected?: boolean;
}

export interface MyTopic {
    id: string;
    code?: string;
    prize?: string;
    name: string;
    status: any;
    sessionStatus?: string;
    researchField?: string;
    researchType?: string;
    createdAt: string;
    type: "TOPIC" | "PROPOSAL";
    role: "LEADER" | "MEMBER" | "ADVISOR" | "PENDING";
    lecturer: {
        name: string;
        username: string;
        email?: string;
        phone?: string;
    };
    students: {
        id: string;
        code: string;
        name: string;
        email?: string;
        phone?: string;
        isLeader: boolean;
    }[];
    objective?: string;
    content?: string;
    budget: number;
    note?: string;
    description?: string;
    isLocked?: boolean;
}

export enum ApprovedTopicStatus {
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    NOT_COMPLETED = "NOT_COMPLETED",
    CANCELED = "CANCELED",
    CANCELLED = "CANCELED" // Alias for frontend safety
}

export type DocumentType = "MIDTERM_REPORT" | "SUMMARY_REPORT" | "SCIENTIFIC_ARTICLE" | "SCIENTIFIC_PRESENTATION";

export interface ApprovedTopicDocumentResponse {
    id: number;
    documentType: DocumentType;
    fileUrl: string;
    scientificArticleSummary?: string;
    uploadedAt: string;
}

export interface ApprovedTopicResponse {
    id: number;
    topic: TopicResponse;
    code: string;
    prize?: string;
    fieldResearch?: string;
    typeResearch?: string;
    status: ApprovedTopicStatus;
    createdAt: string;
}
