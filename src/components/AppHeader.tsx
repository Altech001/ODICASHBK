import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import { BookOpenText, ChevronDown, Plus, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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
  const { businesses, activeBusinessId, setActiveBusinessId, addBusiness } = useAppStore();
  const activeBusiness = businesses.find((b) => b.id === activeBusinessId);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isBusiness = location.pathname.startsWith('/cashbooks');
  const isTeam = location.pathname.startsWith('/team');

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) setUserDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filteredBusinesses = businesses.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddBusiness = () => {
    const name = searchQuery.trim() || 'New Business';
    addBusiness(name);
    setSearchQuery('');
    setDropdownOpen(false);
  };

  return (
    <header className="h-16 bg-white shadow-sm border-b border-border flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-primary-foreground/20 rounded flex items-center justify-center text-primary text-xs font-bold">
          <BookOpenText />
        </div>
        <span className="text-primary font-semibold text-sm tracking-wide">ODIBOOK</span>
      </div>

      {/* Business Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-1 bg-primary-foreground/10 rounded-md border border-gray-400 px-3 py-1.5 min-w-[260px]"
        >
          <div className="w-4 h-4 bg-primary-foreground/20 rounded flex items-center justify-center">
            <span className="text-[8px] text-primary">📊</span>
          </div>
          <span className="text-primary text-sm ml-1">{activeBusiness?.name}</span>
          <ChevronDown className="w-3 h-3 text-primary ml-auto" />
        </button>

        {dropdownOpen && (
          <div className="absolute top-full left-0 mt-1 w-[260px] bg-card border border-border rounded-lg shadow-lg z-50">
            <div className="p-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search Business"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-sm border border-border rounded-md bg-card focus:outline-none focus:ring-1 focus:ring-ring"
                  autoFocus
                />
              </div>
            </div>
            <div className="max-h-[200px] overflow-y-auto">
              {filteredBusinesses.map((biz) => (
                <button
                  key={biz.id}
                  onClick={() => { setActiveBusinessId(biz.id); setDropdownOpen(false); }}
                  className={cn(
                    'w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-accent text-left',
                    biz.id === activeBusinessId && 'text-primary font-medium'
                  )}
                >
                  <div className={cn(
                    'w-3 h-3 rounded-full border-2',
                    biz.id === activeBusinessId ? 'border-primary bg-primary' : 'border-muted-foreground'
                  )} />
                  {biz.name}
                </button>
              ))}
            </div>
            <div className="border-t border-border p-2">
              <button
                onClick={handleAddBusiness}
                className="w-full flex items-center gap-2 bg-primary text-primary-foreground rounded-md px-4 py-2.5 text-sm font-medium hover:opacity-90"
              >
                <Plus className="w-4 h-4" />
                Add New Business
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User area */}
      <div className="flex items-center gap-3">

        <TabBar>
          <TabButton
            active={isBusiness}
            onClick={() => navigate('/cashbooks')}
          >
            Business
          </TabButton>
          <TabButton
            active={isTeam}
            onClick={() => navigate('/team')}
          >
            Personal
          </TabButton>
        </TabBar>
      </div>
    </header>
  );
};

export default AppHeader;
