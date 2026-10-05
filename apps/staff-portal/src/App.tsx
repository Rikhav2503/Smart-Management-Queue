import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useStaffStore } from './stores/useStaffStore';
import { ReceptionWorkspace } from './pages/ReceptionWorkspace';
import { DoctorWorkspace } from './pages/DoctorWorkspace';
import { ThemeToggle } from '@careflow/shared';

const ProtectedRoute = ({ role, children }: { role: string, children: React.ReactNode }) => {
  const user = useStaffStore((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const Login = () => {
  const { user, login } = useStaffStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'RECEPTIONIST') navigate('/reception');
    if (user?.role === 'DOCTOR') navigate('/doctor');
  }, [user, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-50 dark:bg-slate-950">
      <div className="absolute top-4 right-4"><ThemeToggle /></div>
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 w-full max-w-sm text-center space-y-4">
        <h1 className="text-2xl font-bold text-teal-600 mb-2">CareFlow Staff</h1>
        <button
          onClick={() => login({ id: 'u_reception', role: 'RECEPTIONIST', name: 'Demo Receptionist', phone: '1234567891', email: 'reception@demo.com', passwordHash: 'Demo@1234' })}
          className="w-full bg-slate-800 text-white rounded-xl py-3 font-medium hover:bg-slate-700 transition-colors"
        >
          Login as Receptionist
        </button>
        <button
          onClick={() => login({ id: 'u_doctor', role: 'DOCTOR', name: 'Dr. Demo', phone: '1234567892', email: 'doctor@demo.com', passwordHash: 'Demo@1234' })}
          className="w-full bg-teal-600 text-white rounded-xl py-3 font-medium hover:bg-teal-700 transition-colors"
        >
          Login as Doctor
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/reception" element={<ProtectedRoute role="RECEPTIONIST"><ReceptionWorkspace /></ProtectedRoute>} />
          <Route path="/doctor" element={<ProtectedRoute role="DOCTOR"><DoctorWorkspace /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
