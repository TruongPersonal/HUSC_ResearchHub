export type ProposalFormState = {
    studentLeader: string;
    members: string;
    advisor: string;
    title: string;
    description: string; // Added description
    objective: string;
    content: string;
    budget: string;
    note: string;
};

export type Teacher = {
    id: number;
    fullName: string;
    department?: string;
};
