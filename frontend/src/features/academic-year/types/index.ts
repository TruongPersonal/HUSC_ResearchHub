export type AcademicYearStatus = "START" | "END";
// Status of a session for a specific department within an academic year
export type YearSessionStatus =
  | "ON_REGISTRATION"
  | "UNDER_REVIEW"
  | "IN_PROGRESS"
  | "COMPLETED";

export interface AcademicYear {
  id: number;
  year: number;
  status: AcademicYearStatus;
  isActive: boolean;
  topicCount?: number;
}

export interface CreateAcademicYearRequest {
  year: number;
  status: AcademicYearStatus;
  isActive: boolean;
}

export interface UpdateAcademicYearRequest {
  year?: number;
  status?: AcademicYearStatus;
  isActive?: boolean;
}

export interface YearSession {
  id: number;
  year: number;
  departmentName: string;
  departmentId: number;
  status: YearSessionStatus;
  academicYearId: number;
  academicYearStatus: AcademicYearStatus; // Backend populated
}

export interface CreateYearSessionRequest {
  academicYearId: number;
  departmentId: number;
  status?: YearSessionStatus;
}

export interface UpdateYearSessionRequest {
  status: YearSessionStatus;
}
