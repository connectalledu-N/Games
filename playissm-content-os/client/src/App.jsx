import React, { useState } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import { useData } from './DataContext.jsx';
import CalendarPage from './pages/CalendarPage.jsx';
import KanbanPage from './pages/KanbanPage.jsx';
import SequencesPage from './pages/SequencesPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import PlatformsPage from './pages/PlatformsPage.jsx';
import HashtagsPage from './pages/HashtagsPage.jsx';
import WikiPage from './pages/WikiPage.jsx';
import PostModal from './components/PostModal.jsx';
import { PostModalProvider } from './PostModalContext.jsx';

const NAV = [
  { to: '/', label: 'Calendar', end: true },
  { to: '/board', label: 'Board' },
  { to: '/sequences', label: 'Sequences' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/platforms', label: 'Platforms' },
  { to: '/hashtags', label: 'Hashtags' },
  { to: '/wiki', label: 'Reference' },
];

export default function App() {
  const { loading, error } = useData();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <PostModalProvider>
      <div className="flex h-screen overflow-hidden">
        <aside
          className={`${
            sidebarOpen ? 'w-56' : 'w-14'
          } shrink-0 border-r border-slate-200 bg-white flex flex-col transition-all duration-150`}
        >
          <div className="flex items-center justify-between px-3 py-4">
            {sidebarOpen && (
              <div>
                <div className="text-sm font-bold tracking-tight text-slate-900">PLAYISSM</div>
                <div className="text-xs text-slate-400">Content OS</div>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen((s) => !s)}
              className="text-slate-400 hover:text-slate-700 text-sm px-1"
              title="Toggle sidebar"
            >
              {sidebarOpen ? '«' : '»'}
            </button>
          </div>
          <nav className="flex-1 px-2 space-y-1">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `block rounded-md px-3 py-2 text-sm font-medium ${
                    isActive
                      ? 'bg-violet-100 text-violet-800'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
              >
                {sidebarOpen ? item.label : item.label[0]}
              </NavLink>
            ))}
          </nav>
          {sidebarOpen && (
            <div className="px-3 py-3 text-[11px] text-slate-400 border-t border-slate-200">
              Single-user planning tool for Neha.
            </div>
          )}
        </aside>

        <main className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex h-full items-center justify-center text-slate-400 text-sm">
              Loading content OS…
            </div>
          ) : error ? (
            <div className="flex h-full items-center justify-center text-red-500 text-sm px-6 text-center">
              Failed to load data: {error}. Is the API server running on port 4000?
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<CalendarPage />} />
              <Route path="/board" element={<KanbanPage />} />
              <Route path="/sequences" element={<SequencesPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/platforms" element={<PlatformsPage />} />
              <Route path="/hashtags" element={<HashtagsPage />} />
              <Route path="/wiki" element={<WikiPage />} />
            </Routes>
          )}
        </main>
      </div>
      <PostModal />
    </PostModalProvider>
  );
}
