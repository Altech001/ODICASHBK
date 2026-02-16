import { X, Plus, Minus, Trash2, Pencil, ChevronDown, ChevronUp, ArrowRightLeft, Copy } from 'lucide-react';
import { useAppStore, CashEntry } from '@/store/useAppStore';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EntryDetailPanelProps {
  entry: CashEntry;
  bookId: string;
  onClose: () => void;
}

const EntryDetailPanel = ({ entry, bookId, onClose }: EntryDetailPanelProps) => {
  const { deleteEntry, books, moveEntry, copyEntry, copyOppositeEntry } = useAppStore();
  const [moreActionsOpen, setMoreActionsOpen] = useState(false);
  const [transferType, setTransferType] = useState<'move' | 'copy' | 'opposite' | null>(null);
  const [targetBookId, setTargetBookId] = useState('');

  const otherBooks = books.filter((b) => b.id !== bookId);

  const handleTransfer = () => {
    if (!targetBookId || !transferType) return;
    if (transferType === 'move') moveEntry(bookId, targetBookId, entry.id);
    if (transferType === 'copy') copyEntry(bookId, targetBookId, entry.id);
    if (transferType === 'opposite') copyOppositeEntry(bookId, targetBookId, entry.id);
    setTransferType(null);
    setTargetBookId('');
    setMoreActionsOpen(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-foreground/10 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-[360px] bg-card shadow-xl z-50 animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Entry Details</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Amount card */}
          <div className="border-b border-border pb-4 mb-4">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                {entry.type === 'in' ? (
                  <Plus className="w-4 h-4 text-cash-in" />
                ) : (
                  <Minus className="w-4 h-4 text-cash-out" />
                )}
                <span className={cn('text-sm font-medium', entry.type === 'in' ? 'text-cash-in' : 'text-cash-out')}>
                  Cash {entry.type === 'in' ? 'In' : 'Out'}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">On {entry.date}, {entry.time}</span>
            </div>
            <p className={cn('text-2xl font-bold', entry.type === 'in' ? 'text-cash-in' : 'text-cash-out')}>
              {entry.amount.toLocaleString()}
            </p>
          </div>

          {/* Contact info */}
          <div className="border-b border-border pb-4 mb-4">
            <p className="text-xs text-muted-foreground mb-1">Contact Name</p>
            <p className="text-sm font-medium text-foreground">
              {entry.contactName} <span className="text-muted-foreground">({entry.contactType.toLowerCase()})</span>
            </p>
            <div className="flex gap-2 mt-2">
              <span className="text-xs border border-primary/30 text-primary rounded px-2 py-0.5">{entry.category}</span>
              <span className="text-xs border border-primary/30 text-primary rounded px-2 py-0.5">{entry.mode}</span>
            </div>
          </div>

          {/* Activities */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Activities</h3>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center mt-0.5">
                <Plus className="w-3 h-3 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-foreground">Created by <span className="font-medium">{entry.createdBy}</span></p>
                <p className="text-xs text-muted-foreground">On {entry.date}, {entry.time}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-border flex items-center gap-2">
          <button
            onClick={() => { deleteEntry(bookId, entry.id); onClose(); }}
            className="flex items-center gap-1 text-sm text-cash-out hover:bg-accent rounded-md px-3 py-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
          <button
            onClick={() => setMoreActionsOpen(true)}
            className="flex items-center gap-1 text-sm text-foreground border border-border hover:bg-accent rounded-md px-3 py-2 ml-auto"
          >
            More Actions
            <ChevronUp className="w-3 h-3" />
          </button>
          <button className="flex items-center gap-1 text-sm bg-primary text-primary-foreground rounded-md px-4 py-2 font-medium hover:opacity-90">
            <Pencil className="w-4 h-4" />
            Edit
          </button>
        </div>
      </div>

      {/* More Actions Dialog */}
      <Dialog open={moreActionsOpen} onOpenChange={setMoreActionsOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>More Actions</DialogTitle>
          </DialogHeader>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground px-2 py-2 bg-muted rounded-md mb-2">Transfer Entry</p>

            <button
              onClick={() => setTransferType('move')}
              className={cn('w-full flex items-start gap-3 p-3 rounded-md hover:bg-accent text-left', transferType === 'move' && 'bg-accent')}
            >
              <ArrowRightLeft className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Move Entry</p>
                <p className="text-xs text-muted-foreground">Entry will be moved to the other selected book</p>
              </div>
            </button>

            <button
              onClick={() => setTransferType('copy')}
              className={cn('w-full flex items-start gap-3 p-3 rounded-md hover:bg-accent text-left', transferType === 'copy' && 'bg-accent')}
            >
              <Copy className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Copy Entry</p>
                <p className="text-xs text-muted-foreground">Entry will stay in both books</p>
              </div>
            </button>

            <button
              onClick={() => setTransferType('opposite')}
              className={cn('w-full flex items-start gap-3 p-3 rounded-md hover:bg-accent text-left', transferType === 'opposite' && 'bg-accent')}
            >
              <Plus className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Copy Opposite Entry</p>
                <p className="text-xs text-muted-foreground">Cash In entry will be added as Cash out entry in other book and vice versa</p>
              </div>
            </button>

            {transferType && otherBooks.length > 0 && (
              <div className="pt-3 space-y-2">
                <Select value={targetBookId} onValueChange={setTargetBookId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target book" />
                  </SelectTrigger>
                  <SelectContent>
                    {otherBooks.map((b) => (
                      <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <button
                  onClick={handleTransfer}
                  disabled={!targetBookId}
                  className="w-full bg-primary text-primary-foreground rounded-md py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50"
                >
                  Confirm
                </button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EntryDetailPanel;
