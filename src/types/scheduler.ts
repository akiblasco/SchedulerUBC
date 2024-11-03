export interface Course {
  id: string;
  code: string;
  name: string;
  studentCount: number;
  duration: number; // in minutes
  preferredTime?: string;
  constraints?: string[];
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  features: string[];
  availability: boolean;
}

export interface ExamSlot {
  date: string;
  startTime: string;
  endTime: string;
  courseId: string;
  roomId: string;
}

export interface ScheduleState {
  courses: Course[];
  rooms: Room[];
  slots: ExamSlot[];
  conflicts: string[];
}