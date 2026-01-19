export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  streak: number;
  avatar_status: string;
  created_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  title: string;
  is_from_library: boolean;
  streak: number;
}

export interface HabitLog {
  id: number;
  habit_id: string;
  status: boolean;
  logged_at: string;
}

export interface CMSContent {
  id: string;
  content_type: string;
  text_body: string;
  mood_category: string;
  scheduled_date: string;
}

export interface FocusSession {
  id: string;
  user_id: string;
  duration_minutes: number;
  session_type: string;
  status: 'START' | 'PAUSE' | 'FINISHED';
  created_at: string;
}

export interface GratitudeEntry {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
}