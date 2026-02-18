import { X, Plus, Minus, Trash2, Pencil, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { toast } from 'sonner';
import { Entry } from '@/hooks/useEntries';

interface EntryDetailPanelProps {
  entry: Entry;
  bookId: string;
  onClose: () => void;
}

const EntryDetailPanel = ({ entry, bookId, onClose }: EntryDetailPanelProps) => {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      // Backend requires a reason for deletion
      return await apiClient.delete(`/entries/${entry.id}/cashbook/${bookId}`, {
        data: { reason: 'User requested deletion' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries', bookId] });
      toast.success('Entry deleted successfully');
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete entry');
      setIsDeleting(false);
    }
  });

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setIsDeleting(true);
      deleteMutation.mutate();
    }
  };

  const amount = parseFloat(entry.amount);
  const isIn = entry.type === 'INCOME';

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
                {isIn ? (
                  <Plus className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Minus className="w-4 h-4 text-red-600" />
                )}
                <span className={cn('text-sm font-medium', isIn ? 'text-emerald-600' : 'text-red-600')}>
                  Cash {isIn ? 'In' : 'Out'}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(entry.entryDate).toLocaleString()}
              </span>
            </div>
            <p className={cn('text-2xl font-bold', isIn ? 'text-emerald-600' : 'text-slate-800')}>
              {amount.toLocaleString()}
            </p>
          </div>

          {/* Details */}
          <div className="border-b border-border pb-4 mb-4">
            <p className="text-xs text-muted-foreground mb-1">Description</p>
            <p className="text-sm font-medium text-foreground">{entry.description}</p>

            {entry.contact && (
              <div className="mt-3">
                <p className="text-xs text-muted-foreground mb-1">Contact</p>
                <p className="text-sm font-medium text-foreground">{entry.contact.name}</p>
              </div>
            )}

            <div className="flex gap-2 mt-4">
              {entry.category && (
                <span className="text-xs border border-primary/30 text-primary rounded px-2 py-0.5">{entry.category.name}</span>
              )}
              {entry.paymentMode && (
                <span className="text-xs border border-primary/30 text-primary rounded px-2 py-0.5">{entry.paymentMode.name}</span>
              )}
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
                <p className="text-sm text-foreground">Created by <span className="font-medium">{entry.createdBy?.firstName || 'Unknown'} {entry.createdBy?.lastName || ''}</span></p>
                <p className="text-xs text-muted-foreground">{new Date(entry.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-border flex items-center gap-2">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-1 text-sm text-red-600 hover:bg-red-50 rounded-md px-3 py-2"
          >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
          <button
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
    </>
  );
};

export default EntryDetailPanel;
