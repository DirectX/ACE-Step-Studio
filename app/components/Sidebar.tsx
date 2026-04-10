import React, { useState, useEffect } from 'react';
import { Library, Disc, Search, LogIn, LogOut, Sun, Moon, GraduationCap, Newspaper, AudioLines } from 'lucide-react';
import { View } from '../types';
import { useI18n } from '../context/I18nContext';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  user?: { username: string; isAdmin?: boolean; avatar_url?: string } | null;
  onLogin?: () => void;
  onLogout?: () => void;
  onOpenSettings?: () => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

const SystemWidget: React.FC<{ isOpen?: boolean }> = ({ isOpen }) => {
  const [info, setInfo] = useState<any>({});
  const [hidden, setHidden] = useState(() => localStorage.getItem('hide-system-widget') === '1');

  useEffect(() => {
    const poll = async () => {
      try {
        const [sysRes, statusRes] = await Promise.all([
          fetch('/api/generate/system-info').catch(() => null),
          fetch('/api/generate/model-status').catch(() => null),
        ]);
        const sys = sysRes?.ok ? await sysRes.json() : {};
        const status = statusRes?.ok ? await statusRes.json() : {};
        setInfo({ ...sys, ...status });
      } catch {}
    };
    poll();
    const id = setInterval(poll, 3000);
    return () => clearInterval(id);
  }, []);

  const vramPct = info.vram_total > 0 ? Math.round((info.vram_used / info.vram_total) * 100) : 0;
  const ramPct = info.ram_total > 0 ? Math.round((info.ram_used / info.ram_total) * 100) : 0;
  const modelShort = (info.activeModel || '').replace('acestep-v15-', '').replace('marcorez8/', '');

  if (!isOpen) {
    return (
      <button onClick={() => { setHidden(!hidden); localStorage.setItem('hide-system-widget', hidden ? '0' : '1'); }}
        className="flex flex-col items-center gap-1 py-2 w-full hover:bg-white/5 rounded-lg transition-colors"
        title={`${info.gpu || 'GPU'} | VRAM ${vramPct}% | ${modelShort}`}>
        <div className={`w-2 h-2 rounded-full ${info.connected ? 'bg-zinc-500' : 'bg-red-500/60'}`}></div>
        <div className="w-6 h-1 bg-zinc-700 rounded-full overflow-hidden">
          <div className="h-full bg-zinc-500 rounded-full" style={{ width: `${vramPct}%` }}></div>
        </div>
      </button>
    );
  }

  if (hidden) {
    return (
      <button onClick={() => { setHidden(false); localStorage.setItem('hide-system-widget', '0'); }}
        className="px-3 py-1.5 text-[9px] text-zinc-600 hover:text-zinc-400 transition-colors">
        Мониторинг
      </button>
    );
  }

  const Bar = ({ value }: { value: number }) => (
    <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
      <div className="h-full bg-zinc-500 rounded-full transition-all duration-500" style={{ width: `${value}%` }}></div>
    </div>
  );

  return (
    <div className="px-3 py-2 rounded-xl bg-zinc-900/50 text-[10px] space-y-1.5">
      {/* GPU */}
      <div className="flex items-center justify-between text-zinc-500">
        <span className="truncate">{(info.gpu || 'GPU').replace('NVIDIA GeForce ', '')}</span>
        {info.gpu_temp > 0 && <span className="tabular-nums">{info.gpu_temp}°C</span>}
      </div>

      {/* VRAM */}
      <div className="flex items-center gap-2 text-zinc-600">
        <span className="w-8">VRAM</span>
        <Bar value={vramPct} />
        <span className="tabular-nums text-zinc-500 w-14 text-right">{(info.vram_used || 0).toFixed(1)}/{(info.vram_total || 0).toFixed(0)}</span>
      </div>

      {/* RAM */}
      <div className="flex items-center gap-2 text-zinc-600">
        <span className="w-8">RAM</span>
        <Bar value={ramPct} />
        <span className="tabular-nums text-zinc-500 w-14 text-right">{(info.ram_used || 0).toFixed(0)}/{(info.ram_total || 0).toFixed(0)}</span>
      </div>

      {/* GPU Load */}
      <div className="flex items-center gap-2 text-zinc-600">
        <span className="w-8">GPU</span>
        <Bar value={info.gpu_util || 0} />
        <span className="tabular-nums text-zinc-500 w-14 text-right">{info.gpu_util || 0}%</span>
      </div>

      {/* CPU Load */}
      <div className="flex items-center gap-2 text-zinc-600">
        <span className="w-8">CPU</span>
        <Bar value={info.cpu_util || 0} />
        <span className="tabular-nums text-zinc-500 w-14 text-right">{info.cpu_util || 0}%</span>
      </div>

      {/* Connection + Model */}
      <div className="flex items-center justify-between text-zinc-600 pt-1 border-t border-zinc-800">
        <span className="flex items-center gap-1">
          <span className={`w-1.5 h-1.5 rounded-full ${info.connected ? 'bg-green-600' : 'bg-red-500/60 animate-pulse'}`}></span>
          <span className="text-[9px]">{info.connected ? 'подключён' : 'отключён'}</span>
        </span>
        <span className="truncate text-zinc-500">{modelShort || '—'}</span>
      </div>

      {/* Hide button */}
      <button onClick={() => { setHidden(true); localStorage.setItem('hide-system-widget', '1'); }}
        className="w-full text-center text-[8px] text-zinc-700 hover:text-zinc-500 transition-colors pt-0.5 opacity-50 hover:opacity-100">
        скрыть
      </button>
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  theme,
  onToggleTheme,
  user,
  onLogin,
  onLogout,
  onOpenSettings,
  isOpen = true,
  onToggle,
}) => {
  const { t } = useI18n();

  return (
    <>
      {/* Backdrop for mobile - only when expanded */}
      {isOpen && onToggle && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        flex flex-col h-full bg-white dark:bg-suno-sidebar border-r border-zinc-200 dark:border-white/5 flex-shrink-0 py-4 overflow-y-auto scrollbar-hide transition-all duration-300
        fixed left-0 top-0 z-50 md:relative
        ${isOpen ? 'w-[200px]' : 'w-[72px]'}
      `}>
      {/* Logo & Brand */}
      <div className="px-3 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 transition-transform flex-shrink-0"
            onClick={() => onNavigate('create')}
            title={t('aceStepUI')}
          >
            <AudioLines size={22} className="text-white" />
          </div>
          {isOpen && (
            <span className="text-sm font-bold text-zinc-900 dark:text-white whitespace-nowrap">ACE Step 1.5 XL</span>
          )}
        </div>
        {/* Collapse/Expand Button */}
        {onToggle && (
          <button
            onClick={onToggle}
            className="w-8 h-8 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/10 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors flex-shrink-0"
            title={isOpen ? t('collapseSidebar') : t('expandSidebar')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              )}
            </svg>
          </button>
        )}
      </div>

      <nav className="flex-1 flex flex-col gap-2 w-full px-3">
        <NavItem
          icon={<Disc size={20} />}
          label={t('create')}
          active={currentView === 'create'}
          onClick={() => onNavigate('create')}
          isExpanded={isOpen}
        />
        <NavItem
          icon={<Library size={20} />}
          label={t('library')}
          active={currentView === 'library'}
          onClick={() => onNavigate('library')}
          isExpanded={isOpen}
        />
        <NavItem
          icon={<Search size={20} />}
          label={t('search')}
          active={currentView === 'search'}
          onClick={() => onNavigate('search')}
          isExpanded={isOpen}
        />
        <NavItem
          icon={<GraduationCap size={20} />}
          label={t('training')}
          active={currentView === 'training'}
          onClick={() => onNavigate('training')}
          isExpanded={isOpen}
        />
        <NavItem
          icon={<Newspaper size={20} />}
          label={t('news')}
          active={currentView === 'news'}
          onClick={() => onNavigate('news')}
          isExpanded={isOpen}
        />

        <div className="mt-auto flex flex-col gap-2">
          {/* System Status Widget */}
          <SystemWidget isOpen={isOpen} />

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className={`
              w-full rounded-xl flex items-center gap-3 transition-all duration-200 text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5
              ${isOpen ? 'px-3 py-2.5 justify-start' : 'aspect-square justify-center'}
            `}
            title={theme === 'dark' ? t('lightMode') : t('darkMode')}
          >
            <div className="flex-shrink-0">{theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}</div>
            {isOpen && (
              <span className="text-sm font-medium whitespace-nowrap">
                {theme === 'dark' ? t('lightMode') : t('darkMode')}
              </span>
            )}
          </button>

          {user ? (
            <>
              {/* User Settings */}
              <button
                onClick={onOpenSettings}
                className={`
                  w-full rounded-xl flex items-center gap-3 transition-all duration-200 text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5
                  ${isOpen ? 'px-3 py-2.5 justify-start' : 'aspect-square justify-center'}
                `}
                title={`${user.username} - ${t('settings')}`}
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold border border-white/20 overflow-hidden flex-shrink-0">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
                  ) : (
                    user.username.charAt(0).toUpperCase()
                  )}
                </div>
                {isOpen && (
                  <span className="text-sm font-medium whitespace-nowrap truncate flex-1 text-left">
                    {user.username}
                  </span>
                )}
              </button>
              {/* Logout */}
              <button
                onClick={onLogout}
                className={`
                  w-full rounded-xl flex items-center gap-3 transition-all duration-200 text-zinc-500 hover:text-red-500 hover:bg-red-500/10
                  ${isOpen ? 'px-3 py-2.5 justify-start' : 'aspect-square justify-center'}
                `}
                title={t('signOut')}
              >
                <div className="flex-shrink-0"><LogOut size={20} /></div>
                {isOpen && (
                  <span className="text-sm font-medium whitespace-nowrap">{t('signOut')}</span>
                )}
              </button>
            </>
          ) : (
            <button
              onClick={onLogin}
              className={`
                w-full rounded-xl flex items-center gap-3 transition-all duration-200 text-zinc-500 dark:text-zinc-400 hover:text-pink-500 hover:bg-zinc-100 dark:hover:bg-white/5
                ${isOpen ? 'px-3 py-2.5 justify-start' : 'aspect-square justify-center'}
              `}
              title={t('signIn')}
            >
              <div className="flex-shrink-0"><LogIn size={20} /></div>
              {isOpen && (
                <span className="text-sm font-medium whitespace-nowrap">{t('signIn')}</span>
              )}
            </button>
          )}
        </div>
      </nav>
      </div>
    </>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
  isExpanded?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick, isExpanded }) => (
  <button
    onClick={onClick}
    className={`
      w-full rounded-xl flex items-center gap-3 transition-all duration-200 group relative overflow-hidden
      ${isExpanded ? 'px-3 py-2.5 justify-start' : 'aspect-square justify-center'}
      ${active ? 'bg-zinc-100 dark:bg-white/10 text-black dark:text-white' : 'text-zinc-500 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5'}
    `}
    title={label}
  >
    {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-pink-500 rounded-r-full"></div>}
    <div className="flex-shrink-0">{icon}</div>
    {isExpanded && (
      <span className="text-sm font-medium whitespace-nowrap">{label}</span>
    )}
  </button>
);
