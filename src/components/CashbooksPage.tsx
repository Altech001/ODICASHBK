import { Search, Plus, Pencil, Copy, UserPlus, Trash2, ChevronDown, Library, Users, Loader2, Briefcase } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useCashbooks, Cashbook } from '@/hooks/useCashbooks';
import { useWorkspaces } from '@/hooks/useWorkspaces';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CashbooksPage = () => {
  const { user, activeWorkspaceId, setWorkspaceId } = useAuthStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);

  const { workspaces, isLoading: isLoadingWorkspaces } = useWorkspaces();

  // If activeWorkspaceId is not in workspaces (e.g. initial load or deleted), fallback to first
  const currentWorkspaceId = activeWorkspaceId || workspaces?.[0]?.id;

  const activeWorkspace = useMemo(() =>
    workspaces?.find(w => w.id === currentWorkspaceId),
    [workspaces, currentWorkspaceId]
  );

  const { cashbooks, isLoading: isLoadingCashbooks, createCashbook, updateCashbook, deleteCashbook } = useCashbooks(currentWorkspaceId);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDuplicateOpen, setIsDuplicateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Cashbook | null>(null);
  const [bookName, setBookName] = useState('');

  const filteredBooks = cashbooks.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateBook = () => {
    if (!bookName.trim()) return;
    createCashbook(bookName, {
      onSuccess: () => {
        toast.success('Cashbook created successfully');
        setIsCreateOpen(false);
        setBookName('');
      },
      onError: () => toast.error('Failed to create cashbook')
    });
  };

  const handleRenameBook = () => {
    if (!selectedBook || !bookName.trim()) return;
    updateCashbook({ id: selectedBook.id, name: bookName }, {
      onSuccess: () => {
        toast.success('Cashbook renamed successfully');
        setIsRenameOpen(false);
        setBookName('');
        setSelectedBook(null);
      },
      onError: () => toast.error('Failed to rename cashbook')
    });
  };

  const handleDuplicateBook = () => {
    if (!selectedBook || !bookName.trim()) return;
    createCashbook(bookName, {
      onSuccess: () => {
        toast.success('Cashbook duplicated successfully');
        setIsDuplicateOpen(false);
        setBookName('');
        setSelectedBook(null);
      },
      onError: () => toast.error('Failed to duplicate cashbook')
    });
  };

  const handleDeleteBook = () => {
    if (!selectedBook) return;
    deleteCashbook(selectedBook.id, {
      onSuccess: () => {
        toast.success('Cashbook deleted');
        setIsDeleteOpen(false);
        setSelectedBook(null);
      },
      onError: () => toast.error('Failed to delete cashbook')
    });
  };

  const quickBooks = ['February Expenses', 'Cash Journal', 'Payable Book', 'Project Book'];

  if (isLoadingWorkspaces || isLoadingCashbooks) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex bg-white">
      <div className="flex-1 p-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-slate-800">
              {activeWorkspace?.name || "Workspaces"}
            </h1>
            <div className="relative">
              <button
                onClick={() => setWorkspaceDropdownOpen(!workspaceDropdownOpen)}
                className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold hover:opacity-70 transition-all"
              >
                Switch Workspace <ChevronDown className={cn("w-3 h-3 transition-transform", workspaceDropdownOpen && "rotate-180")} />
              </button>

              {workspaceDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-xl z-50 py-1 overflow-hidden">
                  <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-100 mb-1">
                    Your Workspaces
                  </div>
                  {workspaces?.map((ws) => (
                    <button
                      key={ws.id}
                      onClick={() => {
                        setWorkspaceId(ws.id);
                        setWorkspaceDropdownOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-slate-50 transition-colors",
                        currentWorkspaceId === ws.id ? "text-blue-600 bg-blue-50/50 font-bold" : "text-slate-700"
                      )}
                    >
                      {ws.type === 'PERSONAL' ? <Users className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
                      <span className="truncate">{ws.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => navigate('/team')}
            className="flex items-center gap-2 border border-slate-200 rounded-md px-3 py-1.5 text-sm text-blue-600 font-semibold hover:bg-slate-50 transition-colors bg-white"
          >
            <Users className="w-4 h-4" />
            Manage Team
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center mb-10">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative w-full max-w-[340px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by book name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-slate-200 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-400"
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-sm text-slate-700 border border-slate-200 rounded-md px-4 py-2 bg-white hover:bg-slate-50 transition-colors">
                Sort By: Name (A to Z)
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              setBookName('');
              setIsCreateOpen(true);
            }}
            className="flex items-center gap-2 bg-[#4361ee] text-white rounded-md px-6 py-2.5 text-sm font-bold hover:opacity-90 shadow-sm transition-all ml-4"
          >
            <Plus className="w-5 h-5 stroke-[2.5px]" />
            Add New Book
          </button>
        </div>

        {/* Book List */}
        <div className="space-y-0 border-t border-slate-100">
          {filteredBooks.length === 0 ? (
            <div className="py-10 text-center text-slate-500">
              No cashbooks found. Create your first one!
            </div>
          ) : (
            filteredBooks.map((book) => (
              <div
                key={book.id}
                className="flex items-center justify-between py-5 border-b border-slate-100 group hover:bg-slate-50/50 cursor-pointer px-2 -mx-2 rounded transition-colors"
                onClick={() => navigate(`/cashbooks/${book.id}`)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-slate-800">{book.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {book._count?.members || 1} members • Updated {new Date(book.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className={cn(
                      "text-[15px] font-bold",
                      Number(book.balance) >= 0 ? "text-emerald-600" : "text-rose-600"
                    )}>
                      {Number(book.balance).toLocaleString()}
                    </p>
                    {/* <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Net Balance</p> */}
                  </div>

                  <div className="flex items-center gap-4 text-blue-600">
                    <Pencil
                      className="w-4 h-4 cursor-pointer hover:opacity-70 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBook(book);
                        setBookName(book.name);
                        setIsRenameOpen(true);
                      }}
                    />
                    <Copy
                      className="w-4 h-4 cursor-pointer hover:opacity-70 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBook(book);
                        setBookName(`${book.name} (Copy)`);
                        setIsDuplicateOpen(true);
                      }}
                    />
                    <UserPlus className="w-4 h-4 cursor-pointer hover:opacity-70 transition-opacity" onClick={(e) => { e.stopPropagation(); }} />
                    <Trash2
                      className="w-4 h-4 cursor-pointer text-[#ef4444] hover:opacity-70 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBook(book);
                        setIsDeleteOpen(true);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Add Section */}
        <div className="mt-8 p-6 bg-white border border-slate-100 rounded">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center border border-blue-100">
              <Library className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-[15px] font-medium text-slate-800">Add New Book</p>
              <p className="text-sm text-slate-500">Click to quickly add books for</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {quickBooks.map((name) => (
              <button
                key={name}
                onClick={() => {
                  setBookName(name);
                  setIsCreateOpen(true);
                }}
                className="text-xs font-medium text-blue-600 rounded-full px-4 py-2 hover:bg-blue-100 border border-blue-100 transition-colors"
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Book</DialogTitle>
            <DialogDescription>
              Enter a name for your new cashbook to start tracking your finances.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="create-name">Book Name</Label>
              <Input
                id="create-name"
                value={bookName}
                onChange={(e) => setBookName(e.target.value)}
                placeholder="e.g. Monthly Expenses"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateBook} disabled={!bookName.trim()}>Create Book</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rename Book</DialogTitle>
            <DialogDescription>
              Enter a new name for your cashbook.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="rename-name">New Name</Label>
              <Input
                id="rename-name"
                value={bookName}
                onChange={(e) => setBookName(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameOpen(false)}>Cancel</Button>
            <Button onClick={handleRenameBook} disabled={!bookName.trim()}>Rename Book</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDuplicateOpen} onOpenChange={setIsDuplicateOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Duplicate Book</DialogTitle>
            <DialogDescription>
              Create a copy of this cashbook.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="duplicate-name">Copies Name</Label>
              <Input
                id="duplicate-name"
                value={bookName}
                onChange={(e) => setBookName(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDuplicateOpen(false)}>Cancel</Button>
            <Button onClick={handleDuplicateBook} disabled={!bookName.trim()}>Duplicate Book</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              cashbook "{selectedBook?.name}" and all its records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBook}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CashbooksPage;
