
export interface Track {
  id: string;
  programName: string;
  code: string;
  supervisor: string;
  deputySupervisor?: string;
  studentsCount: number;
  studentCoordinator?: string;
  teamsLink?: string;
  assignmentFolder?: string;
  gradeSheet?: string;
  attendanceForm?: string;
  telegramGeneralGroup?: string;
  telegramCourseGroup?: string;
  createdAt: string;
  updatedAt: string;
}
