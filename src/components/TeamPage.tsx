import { Search, UserPlus, ChevronRight } from 'lucide-react';
import { useAppStore, TeamMember } from '@/store/useAppStore';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import AddMemberPanel from './AddMemberPanel';
import RolesPermissionsPanel from './RolesPermissionsPanel';
import MemberInfoPage from './MemberInfoPage';

const TeamPage = () => {
  const { teamMembers, businesses, activeBusinessId, books } = useAppStore();
  const business = businesses.find((b) => b.id === activeBusinessId);
  const [activeTab, setActiveTab] = useState('All');
  const [showRolesPanel, setShowRolesPanel] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  const selectedMember = teamMembers.find(m => m.id === selectedMemberId);

  if (selectedMember) {
    return (
      <MemberInfoPage
        member={selectedMember}
        books={books}
        onBack={() => setSelectedMemberId(null)}
      />
    );
  }

  const tabs = ['All', 'Pending Invites', 'Primary Admin/Admin', 'Employee'];

  const filteredMembers = teamMembers.filter(member => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Primary Admin/Admin') return member.role === 'Primary Admin' || member.role === 'Admin';
    if (activeTab === 'Employee') return member.role === 'Employee';
    if (activeTab === 'Pending Invites') return false; // Mocked for now
    return true;
  });

  const roleColors: Record<string, string> = {
    'Primary Admin': 'text-[#10b981] bg-[#ecfdf5] border-[#d1fae5]',
    'Admin': 'text-[#f59e0b] bg-[#fff7ed] border-[#ffedd5]',
    'Employee': 'text-slate-500 bg-slate-50 border-slate-200',
  };

  return (
    <div className="flex-1 flex bg-white min-h-screen relative overflow-hidden">
      <div className="flex-1 p-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-[16px] font-bold text-slate-800">Total Members ({teamMembers.length})</h1>
          <button
            onClick={() => setShowRolesPanel(true)}
            className="text-[12px] text-[#4361ee] font-semibold flex items-center gap-1 hover:underline underline-offset-4"
          >
            View roles & permissions <ChevronRight className="w-4 h-4 stroke-[2.5px]" />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <div className="relative w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, number, employee id..."
              className="w-full pl-10 pr-10 py-2 border border-slate-200 rounded-md text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-[#4361ee] transition-all placeholder:text-slate-400"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 border border-slate-100 rounded px-1.5 py-0.5 font-medium bg-slate-50">/</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-slate-100 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'pb-4 text-[12px] font-semibold transition-all relative',
                activeTab === tab
                  ? 'text-[#4361ee]'
                  : 'text-slate-400 hover:text-slate-600'
              )}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#4361ee] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Members list */}
        {filteredMembers.length > 0 ? (
          <div className="bg-white border border-slate-100 rounded-lg overflow-hidden ">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30">
              <p className="text-[12px] text-slate-500 font-semibold">
                {activeTab === 'All' ? 'Primary Admin/ Admin' : activeTab} ({filteredMembers.length})
              </p>
            </div>
            <div className="divide-y divide-slate-100">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  onClick={() => setSelectedMemberId(member.id)}
                  className="flex items-center justify-between px-6 py-5 hover:bg-slate-50/50 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-5">
                    <div className={cn(
                      'w-14 h-14 rounded-full flex items-center justify-center text-[18px] font-bold border-2 transition-transform group-hover:scale-105',
                      member.avatar === 'A' ? 'bg-[#f1f5f9] text-[#64748b] border-[#e2e8f0]' : 'bg-[#fff1f2] text-[#e11d48] border-[#ffe4e6]'
                    )}>
                      {member.avatar}
                    </div>
                    <div>
                      <p className="text-[15px] font-bold text-slate-800">{member.name}</p>
                      <p className="text-[13px] text-slate-500 font-medium mt-0.5">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className={cn(
                      'text-[11px] font-bold px-3 py-1 rounded border uppercase tracking-wider',
                      roleColors[member.role]
                    )}>
                      {member.role}
                    </span>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24">
            <p className="text-[18px] text-slate-400 ">No members found!</p>
          </div>
        )}
      </div>

      {/* Right side static card */}
      <div className="w-[340px] p-8 border-l border-slate-50">
        <div className="bg-white border border-slate-200 rounded p-8 ">
          <p className="text-[12px] text-slate-600 font-medium leading-relaxed mb-8">
            Add your business Admins or Employees to this business and manage cashflow together.
          </p>
          <button
            onClick={() => setShowAddMember(true)}
            className="w-full flex items-center justify-center gap-2 bg-[#4361ee] text-white rounded px-6 py-3 text-[14px] font-semibold hover:opacity-90 transition-all"
          >
            <UserPlus className="w-5 h-5 stroke-[2px]" />
            Add team member
          </button>
        </div>
      </div>

      {/* Roles & Permissions Panel */}
      {showRolesPanel && (
        <RolesPermissionsPanel onClose={() => setShowRolesPanel(false)} />
      )}

      {/* Add Member Panel */}
      {showAddMember && (
        <AddMemberPanel
          businessName={business?.name || 'Business'}
          onClose={() => setShowAddMember(false)}
          onAddMember={(email) => {
            console.log('Adding business member:', email);
            setShowAddMember(false);
          }}
        />
      )}
    </div>
  );
};

export default TeamPage;

