export interface Enrollment {
  id?: number;
  studentId: number;
  courseId: number;
  enrollmentDate: string;
  progress?: number;
  status?: string;
  watched?:boolean;
  done?:boolean;
  rating?:number|null;
  lastWatchedPosition?:number|null;
}
