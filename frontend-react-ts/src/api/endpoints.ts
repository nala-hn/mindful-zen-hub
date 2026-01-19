import api from './axiosInstance';

export interface UserData {
  id: string;
  email: string;
  name: string;
  role: string;
  streak: number;
  avatar_status: string;
}

export const apiService = {
  login: (formData: URLSearchParams) => 
    api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }),

  getUserDetail: (userId: string) => 
    api.get(`/users/browse-detail/${userId}`),

  createHabit: (title: string) => 
  api.post('/habits/create', {
    title: title,
    is_from_library: null
  }),

  getHabitsByDate: (date: string) => 
  api.get(`/habits/browse?filter_date=${date}`),

  updateHabitStatus: (habitId: string, payload: any) => 
  api.put(`/habits/update/${habitId}`, payload),

  getHabitLogs: (userId: string, date: string) => 
    api.get(`/habit-logs/browse-date/${userId}?date=${date}`),

  checkHabit: (habitId: string, userId: string, date: string) =>
    api.post('/habit-logs/create', {
      habit_id: habitId,
      user_id: userId,
      log_date: date,
      is_completed: true
    }),

  getGratitude: (userId: string, date: string) =>
    api.get(`/gratitude/browse-date/${userId}?date=${date}`),

  createGratitude: (data: { user_id: string; content: string; date: string }) =>
    api.post('/gratitude/create', data),

  startFocusSession: (data: { user_id: string; duration: number; task_name: string }) =>
    api.post('/focus/create', data),

  getDailyQuote: () => 
    api.get('/cms/browse-all'),
};