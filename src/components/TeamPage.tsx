import { Search, UserPlus, ChevronRight, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import AddMemberPanel from './AddMemberPanel';
import RolesPermissionsPanel from './RolesPermissionsPanel';
import MemberInfoPage from './MemberInfoPage';
import { useMembers, Member } from '@/hooks/useMembers';
import { useWorkspaces } from '@/hooks/useWorkspaces';
import { useCashbooks } from '@/hooks/useCashbooks';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

const TeamPage = () => {
  const { workspaces } = useWorkspaces();
  const { activeWorkspaceId } = useAuthStore();
  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId) || workspaces[0];
  const { members, isLoading, inviteMember } = useMembers(activeWorkspace?.id || '');
  const { cashbooks } = useCashbooks(activeWorkspace?.id);

  const [activeTab, setActiveTab] = useState('All');
  const [showRolesPanel, setShowRolesPanel] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  const selectedMember = members.find(m => m.userId === selectedMemberId);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (selectedMember) {
    return (
      <MemberInfoPage
        member={{
          id: selectedMember.userId,
          name: `${selectedMember.user.firstName} ${selectedMember.user.lastName}`,
          email: selectedMember.user.email,
          role: selectedMember.role as any,
          avatar: selectedMember.user.firstName[0],
          joinedAt: (selectedMember as any).joinedAt
        }}
        books={cashbooks as any}
        onBack={() => setSelectedMemberId(null)}
      />
    );
  }

  const tabs = ['All', 'Admins', 'Members', 'Pending Invites'];

  const filteredMembers = members.filter(member => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Admins') return member.role === 'OWNER' || member.role === 'ADMIN';
    if (activeTab === 'Members') return member.role === 'MEMBER';
    if (activeTab === 'Pending Invites') return false; // Backend doesn't return pending yet
    return true;
  });

  const roleColors: Record<string, string> = {
    'OWNER': 'text-[#10b981] bg-[#ecfdf5] border-[#d1fae5]',
    'ADMIN': 'text-[#f59e0b] bg-[#fff7ed] border-[#ffedd5]',
    'MEMBER': 'text-slate-500 bg-slate-50 border-slate-200',
  };

  return (
    <div className="flex-1 flex bg-white min-h-screen relative overflow-hidden">
      <div className="flex-1 p-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-[16px] font-bold text-slate-800">Total Members ({members.length})</h1>
            <p className="text-[12px] text-slate-400">Manage your team for {activeWorkspace?.name}</p>
          </div>
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
              placeholder="Search by name, email..."
              className="w-full pl-10 pr-10 py-2 border border-slate-200 rounded-md text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-[#4361ee] transition-all placeholder:text-slate-400"
            />
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
                {activeTab} ({filteredMembers.length})
              </p>
            </div>
            <div className="divide-y divide-slate-100">
              {filteredMembers.map((member) => (
                <div
                  key={member.userId}
                  onClick={() => setSelectedMemberId(member.userId)}
                  className="flex items-center justify-between px-6 py-5 hover:bg-slate-50/50 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-5">
                    <div className={cn(
                      'w-14 h-14 rounded-full flex items-center justify-center text-[18px] font-bold border-2 transition-transform group-hover:scale-105 bg-[#f1f5f9] text-[#64748b] border-[#e2e8f0]'
                    )}>
                      {member.user.firstName[0]}
                    </div>
                    <div>
                      <p className="text-[15px] font-bold text-slate-800">{member.user.firstName} {member.user.lastName}</p>
                      <p className="text-[13px] text-slate-500 font-medium mt-0.5">{member.user.email}</p>
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
          businessName={activeWorkspace?.name || 'Workspace'}
          onClose={() => setShowAddMember(false)}
          onAddMember={(email) => {
            inviteMember({ email, role: 'MEMBER' }, {
              onSuccess: () => {
                toast.success('Invitation sent successfully');
                setShowAddMember(false);
              },
              onError: (error: any) => {
                toast.error(error.response?.data?.message || 'Failed to send invitation');
              }
            });
          }}
        />
      )}
    </div>
  );
};

export default TeamPage;
