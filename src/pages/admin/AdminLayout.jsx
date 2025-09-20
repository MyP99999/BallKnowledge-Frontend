// src/pages/admin/AdminLayout.jsx
import { NavLink, Outlet } from "react-router-dom";

export default function AdminLayout() {
  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-md transition ${
      isActive
        ? "bg-yellow-500 text-black font-bold"
        : "text-white hover:bg-green-800"
    }`;

  return (
    <div className="flex min-h-screen bg-green-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-green-950 p-4 flex flex-col gap-2">
        <h1 className="text-xl font-bold mb-6">⚽ Admin Panel</h1>
        <NavLink to="/admin/users" className={linkClass}>
          👥 Users & Stats
        </NavLink>
        <NavLink to="/admin/questions" className={linkClass}>
          ❓ Add Questions
        </NavLink>
        <NavLink to="/admin/daily" className={linkClass}>
          📅 Daily Challenge
        </NavLink>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-green-800/30 py-20">
        <Outlet />
      </main>
    </div>
  );
}
