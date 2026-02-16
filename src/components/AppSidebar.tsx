import { BookText, Users, Settings, Lightbulb, HelpCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Manage sections state if they are intended to be collapsible
  const [openSections, setOpenSections] = useState({
    bookKeeping: true,
    settings: true,
    others: true
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = {
    bookKeeping: [
      { label: 'Cashbooks', path: '/cashbooks', icon: BookText }
    ],
    settings: [
      { label: 'Team', path: '/team', icon: Users },
      { label: 'Business Settings', path: '/settings', icon: Settings }
    ],
    others: [
      { label: "What's New", path: '/whats-new', icon: Lightbulb, badge: 'New' },
      { label: 'Help & Support', path: '/help', icon: HelpCircle }
    ]
  };

  return (
    <aside className="w-[260px] min-w-[260px] border-r border-slate-100 bg-white flex flex-col h-full">
      <nav className="flex-1 py-8 px-4">
        {/* Book Keeping Section */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('bookKeeping')}
            className="flex items-center justify-between w-full px-3 py-2 text-[14px] font-bold text-slate-800 hover:text-slate-600 transition-colors"
          >
            Book Keeping
            <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", !openSections.bookKeeping && "-rotate-90")} />
          </button>
          {openSections.bookKeeping && (
            <div className="mt-1 space-y-1">
              {navItems.bookKeeping.map((item) => (
                <NavItem
                  key={item.path}
                  {...item}
                  active={isActive(item.path)}
                  onClick={() => navigate(item.path)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Settings Section */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('settings')}
            className="flex items-center justify-between w-full px-3 py-2 text-[14px] font-bold text-slate-800 hover:text-slate-600 transition-colors"
          >
            Settings
            <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", !openSections.settings && "-rotate-90")} />
          </button>
          {openSections.settings && (
            <div className="mt-1 space-y-1">
              {navItems.settings.map((item) => (
                <NavItem
                  key={item.path}
                  {...item}
                  active={isActive(item.path)}
                  onClick={() => navigate(item.path)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Others Section */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('others')}
            className="flex items-center justify-between w-full px-3 py-2 text-[14px] font-bold text-slate-800 hover:text-slate-600 transition-colors"
          >
            Others
            <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", !openSections.others && "-rotate-90")} />
          </button>
          {openSections.others && (
            <div className="mt-1 space-y-1">
              {navItems.others.map((item) => (
                <NavItem
                  key={item.path}
                  {...item}
                  active={isActive(item.path)}
                  onClick={() => item.path && navigate(item.path)}
                />
              ))}
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
};

const NavItem = ({ label, icon: Icon, active, onClick, badge }: {
  label: string,
  icon: any,
  active: boolean,
  onClick: () => void,
  badge?: string
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 w-full px-4 py-2.5 text-[13px] font-semibold transition-all duration-200 rounded group',
        active
          ? 'bg-[#4a69bd] text-white'
          : 'text-slate-700 hover:bg-slate-50'
      )}
    >
      <Icon className={cn(
        "w-[20px] h-[20px] stroke-[2px]",
        active ? "text-white" : "text-slate-500 group-hover:text-slate-700"
      )} />
      <span className="flex-1 text-left">{label}</span>
      {badge && (
        <span className="bg-[#10b981] text-white text-[11px] font-bold px-2 py-0.5 rounded transition-transform group-hover:scale-105">
          {badge}
        </span>
      )}
    </button>
  );
};

export default AppSidebar;
