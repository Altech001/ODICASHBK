import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import { BookOpenText, ChevronDown, Plus, Search, LogOut, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiClient } from '@/api/client';
import { toast } from 'sonner';
import { useWorkspaces } from '@/hooks/useWorkspaces';

const TabBar = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200">
    {children}
  </div>
);

interface TabButtonProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

const TabButton = ({ children, active, onClick }: TabButtonProps) => (
  <button
    onClick={onClick}
    className={cn(
      "px-6 py-1.5 text-xs font-medium rounded-md transition-all duration-200",
      active
        ? "bg-white text-primary shadow-sm border border-gray-200"
        : "text-muted-foreground hover:text-foreground hover:bg-white/50"
    )}
  >
    {children}
  </button>
);

const AppHeader = () => {
  const { user, logout, activeWorkspaceId, setWorkspaceId } = useAuthStore();
  const { workspaces, createWorkspace } = useWorkspaces();
  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if we are viewing a PERSONAL or BUSINESS workspace
  const currentWorkspaceType = activeWorkspace?.type || 'PERSONAL';

  useEffect(() => {
    if (workspaces.length > 0 && !activeWorkspaceId) {
      // Find personal workspace first, otherwise first available
      const personal = workspaces.find(w => w.type === 'PERSONAL');
      setWorkspaceId(personal?.id || workspaces[0].id);
    }
  }, [workspaces, activeWorkspaceId, setWorkspaceId]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) setUserDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filteredWorkspaces = workspaces.filter((w) =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddWorkspace = () => {
    const name = searchQuery.trim() || 'New Business';
    createWorkspace(name, {
      onSuccess: (data) => {
        setWorkspaceId(data.id);
        setSearchQuery('');
        setDropdownOpen(false);
        toast.success('Workspace created successfully');
      }
    });
  };

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout');
      logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      logout();
      navigate('/login');
    }
  };

  const switchToWorkspaceType = (type: 'PERSONAL' | 'BUSINESS') => {
    const target = workspaces.find(w => w.type === type);
    if (target) {
      setWorkspaceId(target.id);
      navigate('/cashbooks');
    } else if (type === 'BUSINESS') {
      // If no business workspace exists, prompt to create one or just navigate
      navigate('/cashbooks');
    }
  };

  return (
    <header className="h-16 bg-white shadow-sm border-b border-border flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-primary-foreground/20 rounded flex items-center justify-center text-primary text-xs font-bold">
          <BookOpenText className="w-4 h-4" />
        </div>
        <span className="text-primary font-semibold text-sm tracking-wide">ODIBOOK</span>
      </div>

      {/* Workspace Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-1 bg-primary-foreground/10 rounded-md border border-gray-400 px-3 py-1.5 min-w-[260px]"
        >
          <div className="w-4 h-4 bg-primary-foreground/20 rounded flex items-center justify-center">
            <span className="text-[8px] text-primary">{activeWorkspace?.type === 'PERSONAL' ? '�' : '🏢'}</span>
          </div>
          <span className="text-primary text-sm ml-1 truncate max-w-[180px]">{activeWorkspace?.name || 'Select Workspace'}</span>
          <ChevronDown className="w-3 h-3 text-primary ml-auto" />
        </button>

        {dropdownOpen && (
          <div className="absolute top-full left-0 mt-1 w-[260px] bg-card border border-border rounded-lg shadow-lg z-50">
            <div className="p-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search Workspace"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-sm border border-border rounded-md bg-card focus:outline-none focus:ring-1 focus:ring-ring"
                  autoFocus
                />
              </div>
            </div>
            <div className="max-h-[200px] overflow-y-auto">
              {filteredWorkspaces.map((w) => (
                <button
                  key={w.id}
                  onClick={() => { setWorkspaceId(w.id); setDropdownOpen(false); }}
                  className={cn(
                    'w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-accent text-left',
                    w.id === activeWorkspaceId && 'text-primary font-medium'
                  )}
                >
                  <div className={cn(
                    'w-3 h-3 rounded-full border-2',
                    w.id === activeWorkspaceId ? 'border-primary bg-primary' : 'border-muted-foreground'
                  )} />
                  <div className="flex flex-col">
                    <span className="truncate">{w.name}</span>
                    <span className="text-[10px] text-muted-foreground capitalize">{w.type.toLowerCase()}</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="border-t border-border p-2">
              <button
                onClick={handleAddWorkspace}
                className="w-full flex items-center gap-2 bg-primary text-primary-foreground rounded-md px-4 py-2.5 text-sm font-medium hover:opacity-90"
              >
                <Plus className="w-4 h-4" />
                Add New Workspace
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User area */}
      <div className="flex items-center gap-6">
        <TabBar>
          <TabButton
            active={currentWorkspaceType === 'BUSINESS'}
            onClick={() => switchToWorkspaceType('BUSINESS')}
          >
            Business
          </TabButton>
          <TabButton
            active={currentWorkspaceType === 'PERSONAL'}
            onClick={() => switchToWorkspaceType('PERSONAL')}
          >
            Personal
          </TabButton>
        </TabBar>

        <div className="relative" ref={userDropdownRef}>
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded-md transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
              {user?.firstName?.[0] || 'U'}
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {userDropdownOpen && (
            <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-border rounded-lg shadow-lg z-50 py-1">
              <div className="px-4 py-2 border-b border-border">
                <p className="text-sm font-bold text-slate-800">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => { navigate('/settings'); setUserDropdownOpen(false); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 text-left"
              >
                <User className="w-4 h-4" />
                Profile Settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
