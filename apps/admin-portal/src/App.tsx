import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAdminStore } from './stores/useAdminStore';
import { ThemeToggle, Button } from '@careflow/shared';
import { LayoutDashboard, CalendarDays, LineChart, ShieldCheck, ClipboardList, TrendingUp } from 'lucide-react';

// Placeholder Pages
import { Overview } from './pages/Overview';
import { Roster } from './pages/Roster';
import { Overbooking } from './pages/Overbooking';
import { Insights } from './pages/Insights';
import { Policies } from './pages/Policies';
import { Audit } from './pages/Audit';

const Sidebar = () => {
  const { pathname } = useLocation();
  const { logout } = useAdminStore();
  const links = [
    { name: 'Overview', path: '/', icon: LayoutDashboard },
    { name: 'Roster', path: '/roster', icon: CalendarDays },
    { name: 'Overbooking', path: '/overbooking', icon: TrendingUp },
    { name: 'Insights', path: '/insights', icon: LineChart },
    { name: 'Policies', path: '/policies', icon: ShieldCheck },
    { name: 'Audit', path: '/audit', icon: ClipboardList },
  ];

  return (
    <div className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-teal-600">CareFlow Admin</h1>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {links.map(l => (
          <Link key={l.path} to={l.path} className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${pathname === l.path ? 'bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400 font-medium' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'}`}>
            <l.icon size={20} />
            <span>{l.name}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <ThemeToggle />
        <Button variant="ghost" size="sm" onClick={logout}>Logout</Button>
      </div>
    </div>
  );
};

const Layout = () => (
  <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
    <Sidebar />
    <main className="flex-1 overflow-auto p-8">
      <Outlet />
    </main>
  </div>
);

const Login = () => {
  const login = useAdminStore(s => s.login);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-50 dark:bg-slate-950">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold text-teal-600 mb-2">CareFlow Admin</h1>
        <button
          onClick={() => login({ id: 'u_admin', role: 'ADMIN', name: 'Admin User', phone: '1234567893', email: 'admin@demo.com', passwordHash: 'Demo@1234' })}
          className="w-full mt-4 bg-teal-600 text-white rounded-xl py-3 font-medium hover:bg-teal-700 transition-colors"
        >
          Login as Admin
        </button>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAdminStore((s) => s.user);
  if (!user || user.role !== 'ADMIN') return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Overview />} />
          <Route path="roster" element={<Roster />} />
          <Route path="overbooking" element={<Overbooking />} />
          <Route path="insights" element={<Insights />} />
          <Route path="policies" element={<Policies />} />
          <Route path="audit" element={<Audit />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
