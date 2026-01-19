import React, { useEffect } from 'react';
import { Sidebar, SidebarItems, SidebarItemGroup, SidebarItem } from 'flowbite-react';
import { HiChartPie, HiClock, HiUser, HiLogout, HiViewGridAdd } from 'react-icons/hi';
import { useAuthStore } from '../store/authStore';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { apiService } from '../api/endpoints';

const UserLayout: React.FC = () => {
  const { user, setAuth, logout } = useAuthStore(); 
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchLatestUserData = async () => {
      if (user?.id) {
        try {
          const response = await apiService.getUserDetail(user.id);
          const latestData = response.data.data;
          const token = localStorage.getItem('access_token') || '';
          setAuth(latestData, token); 
          
          console.log("User data synced:", latestData);
        } catch (err) {
          console.error("Gagal sinkronisasi data user di Layout:", err);
        }
      }
    };

    fetchLatestUserData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar aria-label="Zen Sidebar" className="w-64 border-r border-gray-100 shadow-sm bg-white">
        <div className="px-4 py-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-200">
             <HiViewGridAdd className="text-xl" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-800">
            ZenHub
          </span>
        </div>
        
        <SidebarItems className="mt-4">
          <SidebarItemGroup>
            <SidebarItem 
              icon={HiChartPie} 
              active={isActive('/dashboard')}
              className={`cursor-pointer transition-all duration-200 ${isActive('/dashboard') ? 'bg-purple-50 text-purple-700' : 'text-gray-600'}`}
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </SidebarItem>
            <SidebarItem 
              icon={HiClock} 
              active={isActive('/focus')}
              className={`cursor-pointer transition-all duration-200 ${isActive('/focus') ? 'bg-purple-50 text-purple-700' : 'text-gray-600'}`}
              onClick={() => navigate('/focus')}
            >
              Focus Timer
            </SidebarItem>
            <SidebarItem 
              icon={HiUser} 
              active={isActive('/profile')}
              className={`cursor-pointer transition-all duration-200 ${isActive('/profile') ? 'bg-purple-50 text-purple-700' : 'text-gray-600'}`}
              onClick={() => navigate('/profile')}
            >
              Profil Saya
            </SidebarItem>
          </SidebarItemGroup>

          <SidebarItemGroup className="border-t border-gray-100 mt-4 pt-4">
            <SidebarItem 
              icon={HiLogout} 
              className="cursor-pointer text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              onClick={handleLogout}
            >
              Keluar
            </SidebarItem>
          </SidebarItemGroup>
        </SidebarItems>
      </Sidebar>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 flex justify-between items-center z-10">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-0.5">Mindful Zen Hub</p>
            <h1 className="text-xl font-bold text-gray-800 italic">
              Halo, {user?.name || 'Teman'}! 🧘‍♂️
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-orange-500 uppercase tracking-tighter">Current Streak</span>
              <div className="flex items-center gap-1.5 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                <span className="text-lg">🔥</span>
                <span className="font-bold text-orange-700">{user?.streak ?? 0} Hari</span>
              </div>
            </div>
            
            <div className="w-10 h-10 rounded-full bg-purple-100 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
               <img src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=A855F7&color=fff`} alt="avatar" />
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserLayout;