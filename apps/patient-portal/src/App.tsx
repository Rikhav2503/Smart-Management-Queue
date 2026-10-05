import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Calendar, QrCode, FileText, User as UserIcon } from 'lucide-react';
import { usePatientStore } from './stores/usePatientStore';
import { ThemeToggle } from '@careflow/shared';

const BottomNav = () => {
  const { pathname } = useLocation();
  const tabs = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Book', path: '/book', icon: Calendar },
    { name: 'Queue', path: '/queue', icon: QrCode },
    { name: 'Records', path: '/records', icon: FileText },
    { name: 'Profile', path: '/profile', icon: UserIcon },
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-safe">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => (
          <Link key={tab.path} to={tab.path} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${pathname === tab.path ? 'text-teal-600 dark:text-teal-400' : 'text-slate-500 dark:text-slate-400'}`}>
            <tab.icon size={20} className={pathname === tab.path ? 'stroke-[2.5px]' : ''} />
            <span className="text-[10px] font-medium">{tab.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

const Layout = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-16">
      <header className="sticky top-0 z-10 flex items-center justify-between px-4 h-14 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="font-bold text-lg text-teal-600">CareFlow</div>
        <ThemeToggle />
      </header>
      <main className="p-4">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

import { HomePage } from './pages/HomePage';
import { BookPage } from './pages/BookPage';
import { QueuePage } from './pages/QueuePage';
import { RecordsPage } from './pages/RecordsPage';
import { ProfilePage } from './pages/ProfilePage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = usePatientStore((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const Login = () => {
  const login = usePatientStore((s) => s.login);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-50 dark:bg-slate-950">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold text-teal-600 mb-2">CareFlow</h1>
        <p className="text-slate-500 mb-8">Patient Portal</p>
        <button
          onClick={() => login({ id: 'u_patient', role: 'PATIENT', name: 'Demo Patient', phone: '1234567890', email: 'patient@demo.com', passwordHash: 'Demo@1234' })}
          className="w-full bg-teal-600 text-white rounded-xl py-3 font-medium hover:bg-teal-700 transition-colors"
        >
          Login as Demo Patient
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<HomePage />} />
          <Route path="book" element={<BookPage />} />
          <Route path="queue" element={<QueuePage />} />
          <Route path="records" element={<RecordsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
