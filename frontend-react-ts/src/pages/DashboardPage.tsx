import React, { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { HiPlus, HiCheckCircle, HiOutlineXCircle, HiChevronRight, HiTrash } from 'react-icons/hi';
import CalendarStrip from '../components/CalendarStrip';
import HabitModal from '../components/HabitModal';
import ZenkichiAvatar from '../components/ZenkichiAvatar';
import { useAuthStore } from '../store/authStore';
import { apiService } from '../api/endpoints';

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchHabits = useCallback(async () => {
    setLoading(true);
    try {
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      const response = await apiService.getHabitsByDate(dateString);
      setHabits(response.data.data || []);
    } catch (err) {
      console.error("Gagal mengambil habits:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const handleToggleHabit = async (habit: any) => {
    try {
      const updatedPayload = {
        ...habit,
        complete: !habit.complete
      };

      await apiService.updateHabitStatus(habit.id, updatedPayload);

      fetchHabits();
    } catch (err) {
      console.error("Gagal update status habit:", err);
    }
  };

  const [swipedHabitId, setSwipedHabitId] = useState<string | null>(null);

  const handleDeleteHabit = async (habit: any) => {
    // Safety check tambahan
    if (habit.complete) return;

    if (window.confirm(`Yakin ingin menghapus habit "${habit.title}"?`)) {
      try {
        await apiService.deleteHabit(habit.id);
        fetchHabits();
      } catch (err) {
        console.error("Gagal menghapus habit:", err);
      } finally {
        setSwipedHabitId(null);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      <div className="md:col-span-8">
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 text-center sticky top-8">
          <ZenkichiAvatar status={user?.avatar_status || 'stable'} size="lg" />
          <h2 className="mt-6 text-2xl font-black text-gray-800 tracking-tight">{user?.name}</h2>
          <div className="mt-8 pt-8 border-t border-gray-50 grid grid-cols-2 gap-4">
            <div className="bg-orange-50 p-3 rounded-2xl">
              <p className="text-[10px] font-bold text-orange-400 uppercase">Streak</p>
              <p className="text-xl font-black text-orange-600">{user?.streak || 0}</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-2xl">
              <p className="text-[10px] font-bold text-purple-400 uppercase">Habits</p>
              <p className="text-xl font-black text-purple-600">{habits.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="md:col-span-8 space-y-6">
        <section className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100">
          <CalendarStrip selectedDate={selectedDate} onDateChange={setSelectedDate} />
        </section>

        <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 min-h-[400px]">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-black text-gray-800">Daily Habits</h3>
              <p className="text-sm text-gray-400 font-medium">{format(selectedDate, 'eeee, dd MMM')}</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl transition-all shadow-lg shadow-purple-100"
            >
              <HiPlus className="text-xl" />
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : habits.length > 0 ? (
            <div className="grid gap-4">
              {habits.map((habit: any) => (
                <div key={habit.id} className="relative overflow-hidden rounded-[1.5rem]">

                  {!habit.complete && (
                    <div className="absolute inset-0 flex items-center justify-start pl-6 rounded-[2rem] bg-red-500">
                      <button
                        onClick={() => handleDeleteHabit(habit)}
                        className="flex items-center gap-2 text-white font-black text-xs tracking-widest"
                      >
                        <HiTrash className="text-xl" />
                        DELETE
                      </button>
                    </div>
                  )}

                  <div
                    className={`
                      relative flex items-center justify-between p-5 rounded-[1.5rem] border transition-all duration-300 ease-in-out
                      ${habit.complete
                        ? 'bg-green-50/50 border-green-100 cursor-default'
                        : 'bg-white border-gray-100 cursor-pointer'
                      } 
                      ${swipedHabitId === habit.id && !habit.complete ? 'translate-x-28' : 'translate-x-0'}
                    `}
                    onClick={() => {
                      if (!habit.complete) {
                        setSwipedHabitId(swipedHabitId === habit.id ? null : habit.id);
                      }
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleHabit(habit);
                        }}
                        className="text-3xl focus:outline-none transition-transform active:scale-90"
                      >
                        {habit.complete ? (
                          <HiCheckCircle className="text-green-500" />
                        ) : (
                          <HiOutlineXCircle className="text-gray-300 hover:text-purple-400" />
                        )}
                      </button>

                      <div className="flex flex-col">
                        <span className={`font-bold tracking-tight ${habit.complete ? 'text-green-700/50 line-through' : 'text-gray-700'}`}>
                          {habit.title}
                        </span>
                        {!habit.complete && (
                          <span className="text-[10px] text-gray-400 font-medium flex items-center gap-0.5">
                            <HiChevronRight /> Geser untuk hapus
                          </span>
                        )}
                      </div>
                    </div>

                    {habit.current_streak > 0 && (
                      <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg shadow-sm border border-orange-50">
                        <span className="text-[10px] font-black text-orange-600">🔥 {habit.current_streak}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-medium">Belum ada habit untuk tanggal ini.</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 text-purple-600 font-bold text-sm hover:underline"
              >
                + Buat Habit Pertama
              </button>
            </div>
          )}
        </section>
      </div>

      <HabitModal
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchHabits}
      />
    </div>
  );
};

export default DashboardPage;