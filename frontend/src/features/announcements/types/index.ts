export interface Announcement {
    id: number
    title: string
    content: string
    publishDatetime: string
    departmentName?: string
}

export interface CreateAnnouncementRequest {
    title: string
    content: string
    departmentId?: number
    academicYearId?: number
}
