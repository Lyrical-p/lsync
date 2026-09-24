export type StreakDay = "done" | "today" | "empty";
export type TaskTag =
  | "Urgent"
  | "Exam"
  | "Done"
  | "Medium"
  | "Normal"
  | "Later";
export type ColorKey = "purple" | "blue" | "green" | "orange" | "red";

export interface ClassItem {
  id: string;
  name: string;
  meta: string;
  time: string;
  color: string;
  dayOfWeek: number;
  category: "personal" | "school"
}

export interface TaskData {
  id: string;
  title: string;
  subtitle: string;
  tag: TaskTag;
  done: boolean;
  subtitleColor?: string;
  dueDate?: string;
}
export interface TimetableSlot {
  id: string;
  classId: string | null;
  name: string;
  detail: string;
  colorKey: ColorKey;
  category: "personal" | "school";
}

export interface HabitData {
  id: string;
  name: string;
  description: string;
  doneToday: boolean;
  week: boolean[];
  colorKey: "purple" | "green";
}


