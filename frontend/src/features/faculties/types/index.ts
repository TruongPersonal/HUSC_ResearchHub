export interface Faculty {
    id: number
    code: string
    name: string
    userCount?: number
}

export type CreateFacultyRequest = {
    code: string
    name: string
}

export type UpdateFacultyRequest = CreateFacultyRequest
