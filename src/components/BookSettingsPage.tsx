import { ArrowLeft, Pencil, Copy, Trash2, UserPlus, ChevronRight, Calendar, EyeOff, Eye, Loader2, Plus, Settings2, ShieldCheck, UserCog } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useCashbooks, useCashbook, useCashbookMembers } from '@/hooks/useCashbooks';
import { useWorkspaces } from '@/hooks/useWorkspaces';
import { useMetadata } from '@/hooks/useMetadata';
import { useContacts } from '@/hooks/useContacts';
import AddMemberPanel from './AddMemberPanel';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type SettingsTab = 'members' | 'entry-field' | 'data-operator';

const BookSettingsPage = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const { data: book, isLoading: isLoadingBook } = useCashbook(bookId || '');
  const { data: members, isLoading: isLoadingMembers } = useCashbookMembers(bookId || '');
  const { workspaces, isLoading: isLoadingWorkspaces } = useWorkspaces();
  const { updateCashbook, deleteCashbook, createCashbook } = useCashbooks(book?.workspaceId || '');

  const [activeTab, setActiveTab] = useState<SettingsTab>('members');
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showAddMemberPanel, setShowAddMemberPanel] = useState(false);
  const [newBookName, setNewBookName] = useState('');

  if (isLoadingBook || isLoadingWorkspaces || isLoadingMembers) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#fbfcfd]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#4361ee]" />
          <p className="text-[13px] text-slate-500 font-medium">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Book not found</p>
      </div>
    );
  }

  const handleRename = () => {
    if (newBookName.trim() && book) {
      updateCashbook({ id: book.id, name: newBookName.trim() }, {
        onSuccess: () => {
          toast.success('Book renamed');
          setRenameDialogOpen(false);
        },
        onError: () => toast.error('Failed to rename book')
      });
    }
  };

  const handleDuplicate = () => {
    if (!book) return;
    createCashbook(`${book.name} (Copy)`, {
      onSuccess: () => {
        toast.success('Book duplicated');
        navigate('/cashbooks');
      },
      onError: () => toast.error('Failed to duplicate book')
    });
  };

  const handleDelete = () => {
    if (!book) return;
    deleteCashbook(book.id, {
      onSuccess: () => {
        toast.success('Book deleted');
        navigate('/cashbooks');
      },
      onError: () => toast.error('Failed to delete book')
    });
  };

  const tabs: { id: SettingsTab; label: string; subtitle: string; badge?: boolean }[] = [
    { id: 'members', label: 'Members', subtitle: 'Add, Change role, Remove' },
    { id: 'entry-field', label: 'Entry Field', subtitle: 'Contact, Category, Payment mode & Custom Fields', badge: true },
    { id: 'data-operator', label: 'Edit Data Operator Role', subtitle: 'Make changes in role as per your need' },
  ];

  return (
    <div className="flex-1 flex flex-col ">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-white">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(`/cashbooks/${bookId}`)} className="text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-6 h-6 stroke-[2px]" />
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-[18px] font-semibold text-slate-700">Settings</h1>
            <span className="text-[14px] text-slate-500 font-medium">({book.name})</span>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <button onClick={() => { setNewBookName(book.name); setRenameDialogOpen(true); }} className="flex items-center gap-2 text-[14px] text-[#4361ee] font-bold hover:opacity-80 transition-all">
            <Pencil className="w-4 h-4 stroke-[2.5px]" />
            Rename Book
          </button>
          <button onClick={handleDuplicate} className="flex items-center gap-2 text-[14px] text-[#4361ee] font-bold hover:opacity-80 transition-all">
            <Copy className="w-4 h-4 stroke-[2.5px]" />
            Duplicate Book
          </button>
          <button onClick={() => setDeleteDialogOpen(true)} className="flex items-center gap-2 text-[14px] text-[#ef4444] font-bold hover:opacity-80 transition-all">
            <Trash2 className="w-4 h-4 stroke-[2.5px]" />
            Delete Book
          </button>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Settings sidebar */}
        <div className="w-[280px] border-r border-slate-100 bg-white p-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'w-full text-left px-6 py-5 border-b border-slate-100 transition-all duration-200',
                activeTab === tab.id ? 'bg-[#eef2ff] border-r-4 border-r-[#4361ee]' : 'hover:bg-slate-50'
              )}
            >
              <p className={cn(
                "text-[15px] font-bold mb-1 flex items-center justify-between",
                activeTab === tab.id ? "text-slate-800" : "text-slate-700"
              )}>
                {tab.label}
                {tab.badge && <span className="w-2 h-2 rounded-full bg-[#ef4444]" />}
              </p>
              <p className="text-[12px] text-slate-500 font-medium leading-relaxed">{tab.subtitle}</p>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'members' && (
            <MembersTab
              bookId={bookId || ''}
              members={members || []}
              onOpenAddMember={() => setShowAddMemberPanel(true)}
            />
          )}
          {activeTab === 'entry-field' && <EntryFieldTab workspaceId={book?.workspaceId || ''} />}
          {activeTab === 'data-operator' && <DataOperatorTab book={book} onUpdate={(data) => updateCashbook({ id: book.id, ...data })} />}
        </div>
      </div>

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Rename Book</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Book Name</label>
              <input
                value={newBookName}
                onChange={(e) => setNewBookName(e.target.value)}
                className="mt-1 w-full border border-border rounded-md px-3 py-2 text-sm bg-card focus:outline-none focus:ring-1 focus:ring-ring"
                autoFocus
              />
            </div>
            <div className="flex justify-end">
              <button onClick={handleRename} className="bg-primary text-primary-foreground rounded-md px-6 py-2 text-sm font-medium hover:opacity-90">
                Save
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Book</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{book.name}"? This action cannot be undone and all entries will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {showAddMemberPanel && (
        <AddMemberPanel
          businessName={workspaces.find(w => w.id === book.workspaceId)?.name || 'Business'}
          onClose={() => setShowAddMemberPanel(false)}
          onAddMember={(email) => {
            console.log('Add member:', email);
            setShowAddMemberPanel(false);
          }}
        />
      )}
    </div>
  );
};

/* Members Tab */
const MembersTab = ({ bookId, members, onOpenAddMember }: { bookId: string; members: any[]; onOpenAddMember: () => void }) => {
  const { updateMemberRole, removeMember } = useCashbooks();

  const roleColors: Record<string, string> = {
    'PRIMARY_ADMIN': 'text-[#10b981] bg-[#ecfdf5] border-[#d1fae5]',
    'ADMIN': 'text-[#f59e0b] bg-[#fff7ed] border-[#ffedd5]',
    'BOOK_ADMIN': 'text-[#4361ee] bg-[#eef2ff] border-[#e0e7ff]',
    'DATA_OPERATOR': 'text-slate-500 bg-slate-50 border-slate-200',
    'VIEWER': 'text-slate-400 bg-slate-50 border-slate-100',
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    updateMemberRole({ id: bookId, userId, role: newRole }, {
      onSuccess: () => toast.success('Role updated'),
      onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to update role')
    });
  };

  const handleRemoveMember = (userId: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from this book?`)) return;
    removeMember({ id: bookId, userId }, {
      onSuccess: () => toast.success('Member removed'),
      onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to remove member')
    });
  };

  return (
    <div className="max-w-3xl">
      {/* Add Members card */}
      <div className="bg-white border border-slate-200 rounded p-6 mb-8 flex items-center justify-between">
        <div className="max-w-[320px]">
          <h3 className="text-[15px] font-semibold text-slate-800 mb-2">Add Members</h3>
          <p className="text-[12px] text-slate-500 leading-relaxed font-medium">Manage your cashflow together with your business admins, family or friends by adding them as members</p>
        </div>
        <button
          onClick={onOpenAddMember}
          className="flex items-center gap-2 bg-[#4361ee] text-white rounded px-6 py-2.5 text-sm font-bold hover:opacity-90 transition-all">
          <UserPlus className="w-5 h-5" />
          Add member
        </button>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h3 className="text-[14px] font-bold text-slate-800">Total Members ({members.length})</h3>
        <button className="text-[12px] text-[#4361ee] font-bold flex items-center gap-1 px-2 py-1 hover:bg-blue-50 rounded transition-all">
          View roles & permissions <ChevronRight className="w-4 h-4 stroke-[2.5px]" />
        </button>
      </div>

      <p className="text-[12px] text-slate-400 font-bold mb-4 uppercase tracking-wider flex items-center gap-2">
        <ShieldCheck className="w-4 h-4" />
        Members in this book
      </p>

      <div className="space-y-4">
        {members.map((member) => (
          <div key={member.userId} className="flex items-center gap-4 py-4 border-b border-slate-100 last:border-b-0 group">
            <Avatar className="w-11 h-11 border-2 border-white shadow-sm">
              <AvatarFallback className="bg-slate-100 text-slate-500 font-bold uppercase">
                {member.user?.firstName?.[0]}{member.user?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-[15px] font-bold text-slate-800">{member.user?.firstName} {member.user?.lastName}</p>
              <p className="text-[13px] text-slate-500 font-medium mt-0.5">{member.user?.email}</p>
            </div>

            <div className="flex items-center gap-3">
              {member.role === 'PRIMARY_ADMIN' ? (
                <span className={cn('text-[10px] font-black px-3 py-1 rounded border uppercase tracking-widest', roleColors[member.role])}>
                  PRIMARY ADMIN
                </span>
              ) : (
                <select
                  value={member.role}
                  onChange={(e) => handleRoleChange(member.userId, e.target.value)}
                  className={cn(
                    'text-[10px] font-black px-3 py-1 rounded border uppercase tracking-widest bg-transparent cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-100',
                    roleColors[member.role]
                  )}
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="BOOK_ADMIN">BOOK ADMIN</option>
                  <option value="DATA_OPERATOR">DATA OPERATOR</option>
                  <option value="VIEWER">VIEWER</option>
                </select>
              )}

              {member.role !== 'PRIMARY_ADMIN' && (
                <button
                  onClick={() => handleRemoveMember(member.userId, `${member.user?.firstName} ${member.user?.lastName}`)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* Entry Field Tab */
const EntryFieldTab = ({ workspaceId }: { workspaceId: string }) => {
  const { categories, paymentModes, deleteCategory, deletePaymentMode, createCategory, createPaymentMode } = useMetadata(workspaceId);
  const { contacts, deleteContact, createContact } = useContacts(workspaceId);

  const [activeSection, setActiveSection] = useState<string | null>(null);

  const sections = [
    { id: 'categories', label: 'Categories', icon: Settings2, count: categories.length, items: categories },
    { id: 'payment-modes', label: 'Payment Modes', icon: Calendar, count: paymentModes.length, items: paymentModes },
    { id: 'contacts', label: 'Contacts', icon: UserCog, count: contacts.length, items: contacts },
  ];

  const handleAdd = (sectionId: string) => {
    const name = prompt(`Enter new ${sectionId.slice(0, -1)} name:`);
    if (!name) return;

    if (sectionId === 'categories') {
      createCategory({ name, type: 'BOTH' });
    } else if (sectionId === 'payment-modes') {
      createPaymentMode({ name });
    } else if (sectionId === 'contacts') {
      createContact({ name });
    }
  };

  const handleDelete = (sectionId: string, itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    if (sectionId === 'categories') {
      deleteCategory(itemId);
    } else if (sectionId === 'payment-modes') {
      deletePaymentMode(itemId);
    } else if (sectionId === 'contacts') {
      deleteContact(itemId);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[20px] font-bold text-slate-800">Entry Fields</h3>
          <p className="text-[14px] text-slate-500 font-medium">Manage your categories, payment modes and contacts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <div key={section.id} className="bg-white border border-slate-200 rounded overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-white flex items-center justify-center">
                  <section.icon className="w-5 h-5 text-[#4361ee]" />
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-slate-800">{section.label}</h4>
                  <p className="text-[11px] text-slate-400 font-bold">{section.count} items</p>
                </div>
              </div>
              <button
                onClick={() => handleAdd(section.id)}
                className="w-8 h-8   text-white flex items-center justify-center hover:opacity-90 transition-all"
              >
                <Plus className="w-5 h-5 text-[#4361ee]" />
              </button>
            </div>

            <div className="flex-1 max-h-[300px] overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-100">
              {section.items.length > 0 ? (
                section.items.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded hover:bg-slate-50 group transition-all border border-transparent hover:border-slate-100">
                    <span className="text-[14px] font-bold text-slate-700 truncate">{item.name}</span>
                    <button
                      onClick={() => handleDelete(section.id, item.id)}
                      className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-slate-300">
                  <section.icon className="w-10 h-10 mb-2 opacity-20" />
                  <p className="text-xs font-bold">No items found</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* Data Operator Role Tab */
const DataOperatorTab = ({ book, onUpdate }: { book: any; onUpdate: (data: any) => void }) => {
  const role = {
    backdatedEntries: book.allowBackdate ? 'always' : 'never',
    entryEditPermission: true,
    hideNetBalance: false,
    hideEntriesByOthers: false
  };

  return (
    <div className="max-w-3xl">
      <h3 className="text-[20px] font-bold text-slate-800 mb-2">Data Operator Role</h3>
      <p className="text-[14px] text-slate-500 font-medium mb-10 leading-relaxed">Here are the customizations available for the Data Operator role.</p>

      {/* Backdated entries */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-5 px-1">
          <div className="w-10 h-10 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-[#4361ee]" />
          </div>
          <span className="text-[14px] font-semibold text-slate-800">Allow backdated entries</span>
        </div>
        <div className="space-y-3">
          {([
            { value: 'always', label: 'Always', desc: 'Can add entry on any past date' },
            { value: 'never', label: 'Never', desc: 'Cannot add entries on any past date' },
          ] as const).map((option) => (
            <button
              key={option.value}
              onClick={() => onUpdate({ allowBackdate: option.value === 'always' })}
              className={cn(
                'w-full flex items-start gap-4 p-5 rounded border transition-all duration-200 group',
                role.backdatedEntries === option.value ? 'border-[#4361ee] bg-[#eef2ff]' : 'border-slate-200 bg-white hover:border-slate-300'
              )}
            >
              <div className={cn(
                'w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center transition-colors',
                role.backdatedEntries === option.value ? 'border-[#4361ee] bg-[#4361ee]' : 'border-slate-300 bg-white'
              )}>
                {role.backdatedEntries === option.value && (
                  <div className="w-2.5 h-2.5 bg-white rounded-full" />
                )}
              </div>
              <div className="text-left">
                <p className={cn(
                  "text-[15px] font-bold mb-1",
                  role.backdatedEntries === option.value ? "text-[#4361ee]" : "text-slate-800"
                )}>{option.label}</p>
                <p className="text-[13px] text-slate-500 font-medium leading-relaxed">{option.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Toggle options */}
      <div className="space-y-8 pt-4">
        {[
          { key: 'entryEditPermission', icon: Pencil, label: 'Entry edit permission', desc: 'Data Operators can edit their own entries.' },
          { key: 'hideNetBalance', icon: EyeOff, label: 'Hide net balance & reports', desc: 'Data Operators will not be able to see net balance and download reports.' },
          { key: 'hideEntriesByOthers', icon: Eye, label: 'Hide entries by other members', desc: 'Data Operators will not be able to see entries done by other members.' },
        ].map(({ key, icon: Icon, label, desc }) => (
          <div key={key} className="flex items-center justify-between group px-1">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 transition-colors group-hover:bg-slate-100 group-hover:border-slate-200">
                <Icon className="w-5 h-5 text-slate-500" />
              </div>
              <div>
                <p className="text-[15px] font-bold text-slate-800 mb-1">{label}</p>
                <p className="text-[13px] text-slate-500 font-medium leading-relaxed">{desc}</p>
              </div>
            </div>
            <button
              onClick={() => { }}
              className={cn(
                'w-11 h-6 rounded-full relative transition-all duration-300 focus:outline-none',
                role[key as keyof typeof role] ? 'bg-[#4361ee]' : 'bg-slate-200'
              )}
            >
              <div className={cn(
                'w-5 h-5 rounded-full bg-white absolute top-0.5  transition-all duration-300 transform',
                role[key as keyof typeof role] ? 'translate-x-5' : 'translate-x-0.5'
              )} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookSettingsPage;
