import './App.css'

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import { useAuthStore } from './store/authStore';

function App() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isLoggedIn ? <LoginPage /> : <Navigate to="/dashboard" />} />
        
        <Route path="/dashboard" element={isLoggedIn ? <div>Dashboard User</div> : <Navigate to="/login" />} />
        <Route path="/admin/dashboard" element={isLoggedIn ? <div>Dashboard Admin</div> : <Navigate to="/login" />} />

        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;