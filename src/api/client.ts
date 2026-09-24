import { API_BASE_URL } from "../config/api";
import { supabase } from "../lib/supabase";
import type { ClassItem, HabitData, TaskData, TimetableSlot } from "../types";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const {data} = await supabase.auth.getSession();
  const token = data.session?.access_token;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", 
      ...(token ? {Authorization: `Bearer ${token}`}: {}),
      ...options?.headers },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} `);
  }

  return response.json() as Promise<T>;
}

export interface HomeData {
  user: {
    name: string;
    email: string;
    initials: string;
    streak: number;
    semester: string;
    greeting: string;
  };
  streakDays: {
    label: string;
    letter: string;
    state: "done" | "today" | "empty";
  }[];
  classes: ClassItem[];
  deadlines: TaskData[];
  quote: { text: string; author: string };
  dailyGoal: {
    current: number;
    target: number;
    percent: number;
    hint: string;
  };
}

export interface ScheduleData {
  weekDays: string[];
  timetableHours: string[];
  slots: TimetableSlot[];
  slotAtHour: (number | null)[];
}

export interface AnalyticsData {
  stats: { value: string; label: string }[];
  weeklyBars: { height: number; label: string }[];
  subjectBreakDowns: { name: string; percent: number; color: string }[];
  insight: string;
}

export interface PomodoroData {
  secondsLeft: number;
  isRunning: boolean;
  sessionCount: number;
  focusedTime: number;
  breakCount: number;
  focusLabel: string;
}

export interface ProfileData {
  name: string;
  email: string;
  initials: string;
  streak: number;
  onTimePercent: number;
  taskDone: number;
  notifyTasks: boolean;
  notifyClasses: boolean;
  notifyHabits: boolean;
  notifySchedule: boolean;
  darkMode: boolean;
}

export interface ChatMessage{
  role: "user" | "assistant"
  content: string
}

export const api = {
  getHome: () => request<HomeData>("/home"),
  getTasks: (section?: "today" | "upcoming") =>
    request<TaskData[]>(section ? `/tasks?section=${section}` : `/tasks`),
  toggleTask: (id: string) =>
    request<TaskData>(`/tasks/${id}/toggle`, { method: "PATCH" }),
  deleteTask: (id: string) => 
    request<{ok: boolean}>(`/tasks/${id}`,{method: "DELETE"}),
  createTask: (body: {
    title: string;
    subtitle: string;
    tag?: string;
    section?: string;
    dueDate?: string
  }) =>
    request<TaskData>("/tasks", { method: "POST", body: JSON.stringify(body) }),
  getSchedule: (day?: string) => request<ScheduleData>(`/schedule${day ? `?day=${encodeURIComponent(day)}` : ""}`),
  createClass: (body: {
    name: string
    time: string
    color?: string
    dayOfWeek: number
    hourIndex: number
    category: "personal" | "school"
  }) => request<ClassItem>("/class", {method: "POST", body: JSON.stringify(body)}),
  deleteClass:(id: string)=> 
    request<{ok: boolean}>(`/class/${id}`, {method: "DELETE"}),

  getHabits: () => request<HabitData[]>("/habits"),
  toggleHabit: (id: string) =>
    request<HabitData>(`/habits/${id}/toggle`, { method: "PATCH" }),
  getAnalytics: () => request<AnalyticsData>(`/analytics`),
  getPomodoro: () => request<PomodoroData>(`/pomodoro`),
  updatePomodoro: (body: {
    secondsLeft?: number;
    isRunning?: boolean;
    reset?: boolean;
  }) =>
    request<PomodoroData>(`/pomodoro`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  getProfile: () => request<ProfileData>("/profile"),
  updateProfileSettings: (body: {
    notifyTasks?: boolean;
    notifyClasses?: boolean;
    notifyHabits?: boolean;
    notifySchedule?: boolean;
    darkMode?: boolean;
  }) =>
    request<{ 
      notifyTasks: boolean;
      notifyClasses: boolean;
      notifyHabits: boolean;
      notifySchedule: boolean;
      darkMode: boolean 
    }>(
      "/profile/settings",
      { method: "PATCH", body: JSON.stringify(body) },
    ),
  
  updateDailyGoal:(target: number)=> request<{target: number}>("/profile/goal",{
    method: "PATCH",
    body: JSON.stringify({target})
  }),

  sendChatMessage: (messages: ChatMessage[]) => request<{reply: string}>("/ai/chat", {
    method: "POST", 
    body: JSON.stringify({messages}),  }),
  deleteAccount: () => request<{ok: boolean}>("/account", {method: "DELETE"}),
  deleteTasks: (id: string) => request<{ok: boolean}>(`/tasks/${id}`, {method: "DELETE"})
  
};
