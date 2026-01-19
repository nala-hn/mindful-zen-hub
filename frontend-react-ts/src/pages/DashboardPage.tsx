import React, { useState } from 'react';
import ZenkichiAvatar from '../components/ZenkichiAvatar';
import CalendarStrip from '../components/CalendarStrip';
import { useAuthStore } from '../store/authStore';

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      <div className="md:col-span-8 space-y-6">
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 text-center">
          <ZenkichiAvatar status={user?.avatar_status || 'stable'} />
          <h2 className="mt-4 text-2xl font-black text-gray-800 tracking-tight">
            {user?.name}
          </h2>
          <p className="text-gray-400 text-sm font-medium">Mindful Explorer</p>
          
          <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-50">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Streak</p>
              <p className="text-xl font-bold text-orange-600">{user?.streak || 0}d</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Level</p>
              <p className="text-xl font-bold text-purple-600">Novice</p>
            </div>
          </div>
        </div>
      </div>

      <div className="md:col-span-8 space-y-6">
        <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
           <CalendarStrip selectedDate={selectedDate} onDateChange={setSelectedDate} />
        </section>
        
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 min-h-[300px]">
           <h3 className="text-lg font-bold text-gray-800 mb-6">Daily Habits</h3>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;