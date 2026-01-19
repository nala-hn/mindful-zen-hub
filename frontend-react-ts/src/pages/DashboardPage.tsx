import React, { useState, useEffect } from 'react';
import CalendarStrip from '../components/CalendarStrip';
import { apiService } from '../api/endpoints';
import { useAuthStore } from '../store/authStore';
import { format } from 'date-fns';

const DashboardPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuthStore();

  const syncUserData = async () => {
    if (user?.id) {
      try {
        const response = await apiService.getUserDetail(user.id);
      } catch (err) {
        console.error("Gagal sinkronisasi user:", err);
      }
    }
  };

  const fetchDailyHabits = async (date: Date) => {
    if (!user?.id) return;
    
    setLoading(true);
    const formattedDate = format(date, 'yyyy-MM-dd');
    
    try {
      const response = await apiService.getHabitLogs(user.id, formattedDate);
      setHabits(response.data.data || []);
    } catch (err) {
      console.error("Gagal ambil habits:", err);
      setHabits([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncUserData();
    fetchDailyHabits(selectedDate);
  }, [selectedDate]);

  return (
    <div className="space-y-8">
      <section>
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-lg font-bold text-gray-800">Progress Harian</h2>
          <span className="text-sm text-purple-600 font-medium bg-purple-50 px-3 py-1 rounded-full">
            {format(selectedDate, 'dd MMMM yyyy')}
          </span>
        </div>
        <CalendarStrip
          selectedDate={selectedDate}
          onDateChange={(date) => setSelectedDate(date)}
        />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
            ✅ Habit Tracker
          </h3>
          
          {loading ? (
            <p className="text-center py-10 text-gray-400">Memuat data...</p>
          ) : habits.length > 0 ? (
            <div className="space-y-3">
              {habits.map((habit: any) => (
                <div key={habit.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                  <input 
                    type="checkbox" 
                    checked={habit.is_completed}
                    className="w-5 h-5 rounded-md text-purple-600 focus:ring-purple-500"
                    onChange={() => {}}
                  />
                  <span className={habit.is_completed ? 'line-through text-gray-400' : 'text-gray-700 font-medium'}>
                    {habit.habit_name}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-400 text-sm italic">Belum ada habit yang diset atau tercatat hari ini.</p>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-3xl border border-indigo-100 shadow-sm">
           <h3 className="font-bold text-indigo-800 mb-2 flex items-center gap-2">
            🙏 Jurnal Syukur
          </h3>
          <p className="text-xs text-indigo-600/70 mb-4 italic italic">Apa yang membuatmu bersyukur hari ini?</p>
          <textarea 
            className="w-full h-32 p-4 rounded-2xl border-none focus:ring-2 focus:ring-indigo-300 text-sm placeholder:italic shadow-inner"
            placeholder="Tuliskan di sini..."
          />
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;