import { ArrowLeft, Settings, UserPlus, Search, ChevronDown, Plus, Minus, Download, CloudUpload, Equal, ChevronLeft, ChevronRight, FileDown, Users2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CashEntryPanel from './CashEntryPanel';
import EntryDetailPanel from './EntryDetailPanel';
import { cn } from '@/lib/utils';

const BookDetailPage = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const { books, selectedEntryId, setSelectedEntryId } = useAppStore();
  const book = books.find((b) => b.id === bookId);
  const [showEntryPanel, setShowEntryPanel] = useState(false);
  const [entryType, setEntryType] = useState<'in' | 'out'>('in');

  if (!book) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Book not found</p>
      </div>
    );
  }

  const cashIn = book.entries.filter((e) => e.type === 'in').reduce((s, e) => s + e.amount, 0);
  const cashOut = book.entries.filter((e) => e.type === 'out').reduce((s, e) => s + e.amount, 0);

  let runningBalance = 0;
  const selectedEntry = book.entries.find((e) => e.id === selectedEntryId);

  return (
    <div className="flex-1 p-6 relative h-full bg-white overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b border-slate-100 py-5">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/cashbooks')} className="text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-5 h-5 stroke-[2.5px]" />
          </button>
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-slate-800">{book.name}</h1>
            <div className="flex items-center gap-3">
              <div className="relative cursor-pointer hover:bg-slate-100 p-1 rounded transition-colors" onClick={() => navigate(`/cashbooks/${bookId}/settings`)}>
                <Settings className="w-5 h-5 text-blue-900 fill-blue-900/10" />
              </div>
              <div className="p-1 hover:bg-slate-100 rounded cursor-pointer transition-colors">
                <Users2 className="w-5 h-5 text-blue-900/80" />
              </div>
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

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        {['Duration: All Time', 'Types: All', 'Contacts: All', 'Members: All', 'Payment Modes: All'].map((f) => (
          <button key={f} className="flex items-center gap-2 text-xs font-medium border border-slate-200 rounded-md px-3 py-1.5 text-slate-600 bg-white hover:bg-slate-50 transition-colors text-primary">
            {f}
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
        ))}
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
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-300 border border-slate-100 rounded px-1.5 py-0.5">/</span>
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

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-0 bg-white border border-slate-100 rounded-lg mb-10 divide-x divide-slate-100">
        <div className="p-5 flex items-center gap-4">
          <div className="w-7 h-7 rounded-sm bg-emerald-50 flex items-center justify-center border border-emerald-100">
            <Plus className="w-4 h-4 text-emerald-600 stroke-[3px]" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Cash In</p>
            <p className="text-xl font-black text-slate-800 tracking-tight">{cashIn.toLocaleString()}</p>
          </div>
        </div>
        <div className="p-5 flex items-center gap-4">
          <div className="w-7 h-7 rounded-sm bg-red-50 flex items-center justify-center border border-red-100">
            <Minus className="w-4 h-4 text-red-600 stroke-[3px]" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Cash Out</p>
            <p className="text-xl font-black text-slate-800 tracking-tight">{cashOut.toLocaleString()}</p>
          </div>
        </div>
        <div className="p-5 flex items-center gap-4">
          <div className="w-7 h-7 rounded-sm bg-blue-50 flex items-center justify-center border border-blue-100">
            <Equal className="w-4 h-4 text-blue-600 stroke-[3px]" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Net Balance</p>
            <p className="text-xl font-black text-slate-800 tracking-tight">{(cashIn - cashOut).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Pagination & Row Info */}
      <div className="flex items-center justify-between mb-3 px-2">
        <p className="text-[13px] text-slate-400 font-medium">
          Showing 1 - {book.entries.length} of {book.entries.length} {book.entries.length === 1 ? 'entry' : 'entries'}
        </p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border border-slate-200 rounded-md px-3 py-1 bg-white cursor-pointer hover:bg-slate-50 transition-colors text-primary">
            <span className="text-[13px] text-slate-700 font-medium whitespace-nowrap">Page 1</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
            <span className="text-[13px] text-slate-400 font-medium ml-2">of 1</span>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-300 hover:text-slate-600 transition-colors text-primary cursor-not-allowed">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-400 hover:text-slate-600 transition-colors text-primary">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
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
            {book.entries.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-20 text-slate-400 font-medium">No entries yet</td>
              </tr>
            ) : (
              book.entries.map((entry) => {
                runningBalance += entry.type === 'in' ? entry.amount : -entry.amount;
                const isIn = entry.type === 'in';
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
                      <p className="text-[13px] font-bold text-slate-700">{entry.date}</p>
                      <p className="text-[11px] font-medium text-slate-400 mt-1 uppercase">{entry.time}</p>
                    </td>
                    <td className="py-5 px-3">
                      <p className="text-[13px] font-bold text-slate-800">
                        <span className="text-slate-900">({entry.contactName})</span>
                        <span className="text-slate-400 font-medium ml-1">({entry.contactType})</span>
                      </p>
                      <p className="text-[13px] text-slate-400 font-medium mt-0.5">--</p>
                      <p className="text-[11px] text-slate-400 font-medium mt-1">by {entry.createdBy}</p>
                    </td>
                    <td className="py-5 px-3 font-bold text-slate-700 text-[13px]">{entry.mode}</td>
                    <td className="py-5 px-3 text-slate-400"></td>
                    <td className={cn(
                      "py-5 px-3 text-[14px] font-bold text-right",
                      isIn ? "text-emerald-600" : "text-slate-800"
                    )}>
                      {entry.amount.toLocaleString()}
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
          type={entryType}
          onClose={() => setShowEntryPanel(false)}
          onSwitchType={setEntryType}
        />
      )}

      {/* Entry Detail Panel */}
      {selectedEntry && (
        <EntryDetailPanel
          entry={selectedEntry}
          bookId={book.id}
          onClose={() => setSelectedEntryId(null)}
        />
      )}
    </div>
  );
};

export default BookDetailPage;
