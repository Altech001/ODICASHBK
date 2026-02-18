import { ArrowLeft, Settings, Search, ChevronDown, Plus, Minus, CloudUpload, Equal, ChevronLeft, ChevronRight, FileDown, Users2, Loader2, Info } from 'lucide-react';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CashEntryPanel from './CashEntryPanel';
import EntryDetailPanel from './EntryDetailPanel';
import { cn } from '@/lib/utils';
import { useEntries } from '@/hooks/useEntries';
import { useCashbooks, useCashbook, useCashbookMembers } from '@/hooks/useCashbooks';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const BookDetailPage = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const { data: book, isLoading: isLoadingBook } = useCashbook(bookId || '');
  const { entries, isLoading: isLoadingEntries } = useEntries(bookId || '');
  const { data: members, isLoading: isLoadingMembers } = useCashbookMembers(bookId || '');

  const [showEntryPanel, setShowEntryPanel] = useState(false);
  const [entryType, setEntryType] = useState<'in' | 'out'>('in');
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [isMembersOpen, setIsMembersOpen] = useState(false);

  if (isLoadingBook || isLoadingEntries || isLoadingMembers) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#fbfcfd]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#4361ee]" />
          <p className="text-[13px] text-slate-500 font-medium">Loading details...</p>
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

  let runningBalance = 0;
  const selectedEntry = entries.find((e) => e.id === selectedEntryId);

  return (
    <div className="flex-1 p-6 relative h-full bg-white overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b border-slate-100 py-5">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/cashbooks')} className="text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-5 h-5 stroke-[2.5px]" />
          </button>
          <div className="flex items-center gap-4">
            <h1 className="text-[20px] font-black text-slate-800 tracking-tight">{book.name}</h1>
            <div className="flex items-center gap-1">
              <button
                onClick={() => navigate(`/cashbooks/${bookId}/settings`)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-all text-slate-400 hover:text-[#4361ee]"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsMembersOpen(true)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-all text-slate-400 hover:text-[#4361ee]"
              >
                <Users2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-[13px] text-blue-600 font-bold hover:bg-blue-50/50 px-3 py-1.5 rounded-md transition-colors">
            <CloudUpload className="w-5 h-5" />
            Add Bulk Entries
          </button>
          <button className="flex items-center gap-2 text-[13px] text-blue-600 font-bold border border-slate-200 rounded-md px-4 py-2 hover:bg-slate-50 transition-colors text-primary bg-white">
            <FileDown className="w-4 h-4" />
            Reports
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-0 bg-white border border-slate-100 rounded-lg mb-10 divide-x divide-slate-100 overflow-hidden">
        <div className="p-6 flex items-center gap-5">
          <div className="w-10 h-10 rounded bg-emerald-50 flex items-center justify-center border border-emerald-100">
            <Plus className="w-5 h-5 text-emerald-600 stroke-[3px]" />
          </div>
          <div>
            <p className="text-[11px] font-black text-slate-400  mb-1">Cash In</p>
            <p className="text-2xl font-bold text-slate-800 tracking-tight leading-none">
              {parseFloat(book.totalIncome).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="p-6 flex items-center gap-5">
          <div className="w-10 h-10 rounded bg-red-50 flex items-center justify-center border border-red-100">
            <Minus className="w-5 h-5 text-red-600 stroke-[3px]" />
          </div>
          <div>
            <p className="text-[11px] font-black text-slate-400 mb-1">Cash Out</p>
            <p className="text-2xl font-bold text-slate-800 tracking-tight leading-none">
              {parseFloat(book.totalExpense).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="p-6 flex items-center gap-5">
          <div className="w-10 h-10 rounded-xl bg-[#4361ee]/10 flex items-center justify-center border border-[#4361ee]/20">
            <Equal className="w-5 h-5 text-[#4361ee] stroke-[3px]" />
          </div>
          <div>
            <p className="text-[11px] font-black text-slate-400 mb-1">Net Balance</p>
            <p className="text-2xl font-bold text-slate-800 tracking-tight leading-none">
              {parseFloat(book.balance).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Search + Action Buttons */}
      <div className="flex items-center justify-between mb-8">
        <div className="relative w-full max-w-[420px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by remark or amount..."
            className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-md text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => { setEntryType('in'); setShowEntryPanel(true); }}
            className="flex items-center gap-2 bg-[#059669] text-white rounded-md px-8 py-2.5 text-sm font-bold hover:opacity-90 transition-all text-primary"
          >
            <Plus className="w-4 h-4 stroke-[3px]" />
            Cash In
          </button>
          <button
            onClick={() => { setEntryType('out'); setShowEntryPanel(true); }}
            className="flex items-center gap-2 bg-[#b91c1c] text-white rounded-md px-8 py-2.5 text-sm font-bold hover:opacity-90 transition-all text-primary"
          >
            <Minus className="w-4 h-4 stroke-[3px]" />
            Cash Out
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-50/50 rounded-lg overflow-hidden border-t border-slate-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="p-4 w-10">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              </th>
              <th className="text-left py-4 px-3 text-[13px] font-bold text-slate-500">Date & Time</th>
              <th className="text-left py-4 px-3 text-[13px] font-bold text-slate-500">Details</th>
              <th className="text-left py-4 px-3 text-[13px] font-bold text-slate-500">Mode</th>
              <th className="text-left py-4 px-3 text-[13px] font-bold text-slate-500">Bill</th>
              <th className="text-right py-4 px-3 text-[13px] font-bold text-slate-500">Amount</th>
              <th className="text-right py-4 px-3 text-[13px] font-bold text-slate-500">Balance</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {entries.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-20 text-slate-400 font-medium">No entries yet</td>
              </tr>
            ) : (
              entries.map((entry) => {
                const amount = parseFloat(entry.amount);
                runningBalance += entry.type === 'INCOME' ? amount : -amount;
                const isIn = entry.type === 'INCOME';
                return (
                  <tr
                    key={entry.id}
                    className="border-b border-slate-50 last:border-b-0 hover:bg-slate-50/80 cursor-pointer transition-colors"
                    onClick={() => setSelectedEntryId(entry.id)}
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td className="py-5 px-3">
                      <p className="text-[13px] font-bold text-slate-700">{new Date(entry.entryDate).toLocaleDateString()}</p>
                      <p className="text-[11px] font-medium text-slate-400 mt-1 uppercase">{new Date(entry.entryDate).toLocaleTimeString()}</p>
                    </td>
                    <td className="py-5 px-3">
                      <p className="text-[13px] font-bold text-slate-800">
                        <span className="text-slate-900">{entry.description}</span>
                        {entry.contact && <span className="text-slate-400 font-medium ml-1">({entry.contact.name})</span>}
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium mt-1">by {entry.createdBy?.firstName || 'Unknown'}</p>
                    </td>
                    <td className="py-5 px-3 font-bold text-slate-700 text-[13px]">{entry.paymentMode?.name || 'Cash'}</td>
                    <td className="py-5 px-3 text-slate-400"></td>
                    <td className={cn(
                      "py-5 px-3 text-[14px] font-bold text-right",
                      isIn ? "text-emerald-600" : "text-slate-800"
                    )}>
                      {amount.toLocaleString()}
                    </td>
                    <td className={cn(
                      "py-5 px-3 text-[14px] font-bold text-right",
                      isIn ? "text-slate-700" : "text-slate-800"
                    )}>
                      {runningBalance.toLocaleString()}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Entry Panel */}
      {showEntryPanel && (
        <CashEntryPanel
          bookId={book.id}
          workspaceId={book.workspaceId}
          type={entryType}
          onClose={() => setShowEntryPanel(false)}
          onSwitchType={setEntryType}
        />
      )}

      {/* Entry Detail Panel */}
      {selectedEntry && (
        <EntryDetailPanel
          entry={selectedEntry as any}
          bookId={book.id}
          onClose={() => setSelectedEntryId(null)}
        />
      )}

      {/* Members Dialog */}
      <Dialog open={isMembersOpen} onOpenChange={setIsMembersOpen}>
        <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
          <DialogHeader className="p-6 pb-4 bg-slate-50/50 border-b border-slate-100">
            <DialogTitle className="text-[18px] font-black text-slate-800 tracking-tight">Book Members</DialogTitle>
            <DialogDescription className="text-[13px] font-medium text-slate-500">
              Users who have access to "{book.name}"
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 space-y-5 max-h-[400px] overflow-y-auto">
            {members && members.length > 0 ? (
              members.map((m: any) => (
                <div key={m.id} className="flex items-center gap-4 group">
                  <Avatar className="w-10 h-10 border-2 border-slate-100">
                    <AvatarFallback className="bg-[#4361ee]/10 text-[#4361ee] font-black text-[12px]">
                      {m.user?.firstName?.[0]}{m.user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-bold text-slate-800 truncate">
                      {m.user?.firstName} {m.user?.lastName}
                    </p>
                    <p className="text-[12px] text-slate-500 font-medium truncate">{m.user?.email}</p>
                  </div>
                  <Badge variant="outline" className={cn(
                    "text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded",
                    m.role === 'OWNER' ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-blue-50 text-[#4361ee] border-blue-100"
                  )}>
                    {m.role}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Info className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                <p className="text-[13px] text-slate-500 font-medium">No members found besides you.</p>
              </div>
            )}
          </div>
          <div className="p-4 bg-slate-50/50 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
              Manage these members in book settings
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookDetailPage;
