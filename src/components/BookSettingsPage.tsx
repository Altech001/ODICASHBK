import { ArrowLeft, Pencil, Copy, Trash2, UserPlus, ChevronRight, Calendar, EyeOff, Eye } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import AddMemberPanel from './AddMemberPanel';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
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
  const { books, teamMembers, renameBook, duplicateBook, deleteBook, updateEntryFields, updateDataOperatorRole, businesses, activeBusinessId } = useAppStore();
  const book = books.find((b) => b.id === bookId);
  const business = businesses.find((b) => b.id === activeBusinessId);

  const [activeTab, setActiveTab] = useState<SettingsTab>('members');
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showAddMemberPanel, setShowAddMemberPanel] = useState(false);
  const [newBookName, setNewBookName] = useState(book?.name || '');

  if (!book) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Book not found</p>
      </div>
    );
  }

  const handleRename = () => {
    if (newBookName.trim()) {
      renameBook(book.id, newBookName.trim());
      setRenameDialogOpen(false);
    }
  };

  const handleDuplicate = () => {
    duplicateBook(book.id);
    navigate('/cashbooks');
  };

  const handleDelete = () => {
    deleteBook(book.id);
    navigate('/cashbooks');
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
        <div className="flex-1 p-6">
          {activeTab === 'members' && (
            <MembersTab
              bookName={book.name}
              teamMembers={teamMembers}
              onOpenAddMember={() => setShowAddMemberPanel(true)}
            />
          )}
          {activeTab === 'entry-field' && <EntryFieldTab book={book} updateEntryFields={updateEntryFields} />}
          {activeTab === 'data-operator' && <DataOperatorTab book={book} updateDataOperatorRole={updateDataOperatorRole} />}
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
          businessName={business?.name || 'Business'}
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
const MembersTab = ({ bookName, teamMembers, onOpenAddMember }: { bookName: string; teamMembers: any[]; onOpenAddMember: () => void }) => {
  const roleColors: Record<string, string> = {
    'Primary Admin': 'text-[#10b981] bg-[#ecfdf5]',
    Admin: 'text-[#f59e0b] bg-[#fff7ed]',
    Employee: 'text-slate-500 bg-slate-50',
  };

  return (
    <div className="max-w-3xl">
      {/* Add Members card */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 mb-8 flex items-center justify-between ">
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

      {/* Members list header */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-[14px] font-bold text-slate-800">Total Members ({teamMembers.length})</h3>
        <button className="text-[12px] text-[#4361ee] font-bold flex items-center gap-1 px-2 py-1 hover:bg-blue-50 rounded transition-all">
          View roles & permissions <ChevronRight className="w-4 h-4 stroke-[2.5px]" />
        </button>
      </div>

      <p className="text-[12px] text-slate-400 font-bold mb-2">Members in this book</p>

      <div className="space-y-6">
        {teamMembers.map((member) => (
          <div key={member.id} className="flex items-center gap-4 py-4 border-b border-slate-300 last:border-b-0 hover:bg-slate-50/50 -mx-2 px-2 rounded-none transition-colors">
            <div className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center text-[16px] font-bold border-2',
              member.avatar === 'A' ? 'bg-[#f1f5f9] text-[#64748b] border-green-200' : 'bg-[#fff1f2] text-[#e11d48] border-white'
            )}>
              {member.avatar}
            </div>
            <div className="flex-1">
              <p className="text-[15px] font-bold text-slate-800">{member.name === 'You' ? 'You' : member.name}</p>
              <p className="text-[13px] text-slate-500 font-medium mt-1">{member.email}</p>
            </div>
            <span className={cn('text-[12px] font-bold px-3 py-1 rounded border ', roleColors[member.role])}>
              {member.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* Entry Field Tab */
const EntryFieldTab = ({ book, updateEntryFields }: { book: any; updateEntryFields: any }) => {
  const fields = [
    { key: 'contact', label: 'Contact field', desc: 'Rename, delete, reorder, add new or hide' },
    { key: 'category', label: 'Category field', desc: 'Rename, delete, reorder, add new or hide', isNew: true },
    { key: 'paymentMode', label: 'Payment Mode field', desc: 'Rename, delete, reorder, add new or hide', isNew: true },
    { key: 'customFields', label: 'Custom fields', desc: 'Edit, delete and add new' },
  ];

  return (
    <div className="max-w-3xl">
      <h3 className="text-[12px] text-slate-400 font-semibold mb-2">Entry Field</h3>
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.key} className="bg-white border border-slate-200 rounded-lg p-6 flex items-center justify-between hover:border-blue-200 transition-colors ">
            <div>
              <p className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
                {field.label}
                {field.isNew && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#10b981] text-white font-bold uppercase tracking-[0.05em]">New</span>
                )}
              </p>
              <p className="text-[13px] text-slate-500 font-medium mt-1">{field.desc}</p>
            </div>
            <span className={cn(
              'text-[11px] font-black px-4 py-1.5 rounded transition-all w-14 text-center cursor-pointer',
              book.entryFields[field.key as keyof typeof book.entryFields] ? 'text-[#4361ee] bg-[#eef2ff]' : 'text-slate-400 bg-slate-100'
            )}>
              {book.entryFields[field.key as keyof typeof book.entryFields] ? 'ON' : 'OFF'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* Data Operator Role Tab */
const DataOperatorTab = ({ book, updateDataOperatorRole }: { book: any; updateDataOperatorRole: any }) => {
  const role = book.dataOperatorRole;

  return (
    <div className="max-w-3xl">
      <h3 className="text-[20px] font-bold text-slate-800 mb-2">Data Operator Role</h3>
      <p className="text-[14px] text-slate-500 font-medium mb-10 leading-relaxed">Here are the customizations available for the Data Operator role.</p>

      {/* Backdated entries */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-5 px-1">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
            <Calendar className="w-5 h-5 text-[#4361ee]" />
          </div>
          <span className="text-[15px] font-bold text-slate-800">Allow backdated entries</span>
        </div>
        <div className="space-y-3">
          {([
            { value: 'always', label: 'Always', desc: 'Can add entry on any past date' },
            { value: 'never', label: 'Never', desc: 'Cannot add entries on any past date' },
            { value: 'one_day', label: 'One day before', desc: 'Can add entry on today and day before' },
          ] as const).map((option) => (
            <button
              key={option.value}
              onClick={() => updateDataOperatorRole(book.id, { backdatedEntries: option.value })}
              className={cn(
                'w-full flex items-start gap-4 p-5 rounded-lg border transition-all duration-200 group',
                role.backdatedEntries === option.value ? 'border-[#4361ee] bg-[#eef2ff]' : 'border-slate-200 bg-white hover:border-slate-300'
              )}
            >
              <div className={cn(
                'w-5 h-5 rounded border-2 mt-0.5 flex items-center justify-center transition-colors',
                role.backdatedEntries === option.value ? 'border-[#4361ee] bg-[#4361ee]' : 'border-slate-300 bg-white'
              )}>
                {role.backdatedEntries === option.value && (
                  <div className="w-2.5 h-2.5 bg-white rounded-sm" />
                )}
              </div>
              <div>
                <p className={cn(
                  "text-[15px] font-bold mb-1",
                  role.backdatedEntries === option.value ? "text-slate-800" : "text-slate-700"
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
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 transition-colors group-hover:bg-slate-100">
                <Icon className="w-5 h-5 text-slate-500" />
              </div>
              <div>
                <p className="text-[15px] font-bold text-slate-800 mb-1">{label}</p>
                <p className="text-[13px] text-slate-500 font-medium leading-relaxed">{desc}</p>
              </div>
            </div>
            <button
              onClick={() => updateDataOperatorRole(book.id, { [key]: !role[key as keyof typeof role] })}
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
