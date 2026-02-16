import { X, ChevronDown, Image } from 'lucide-react';
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

interface CashEntryPanelProps {
  bookId: string;
  type: 'in' | 'out';
  onClose: () => void;
  onSwitchType: (type: 'in' | 'out') => void;
}

const CashEntryPanel = ({ bookId, type, onClose, onSwitchType }: CashEntryPanelProps) => {
  const { addEntry } = useAppStore();
  const [amount, setAmount] = useState('');
  const [contactName, setContactName] = useState('');
  const [remarks, setRemarks] = useState('');
  const [category, setCategory] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash');

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  const handleSave = (addNew: boolean) => {
    if (!amount) return;
    addEntry(bookId, {
      date: dateStr,
      time: timeStr,
      details: contactName ? `(${contactName})` : remarks || '--',
      contactName,
      contactType: 'Customer',
      category: category || 'General',
      mode: paymentMode,
      bill: '',
      amount: parseFloat(amount) || 0,
      type,
      createdBy: 'You',
    });
    if (addNew) {
      setAmount('');
      setContactName('');
      setRemarks('');
      setCategory('');
    } else {
      onClose();
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-foreground/20 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-[380px] bg-card shadow-xl z-50 animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className={cn('text-lg font-semibold', type === 'in' ? 'text-cash-in' : 'text-cash-out')}>
            Add {type === 'in' ? 'Cash In' : 'Cash Out'} Entry
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Type toggle */}
        <div className="flex gap-2 p-4 pb-0">
          <button
            onClick={() => onSwitchType('in')}
            className={cn(
              'px-4 py-1.5 rounded-md text-sm font-medium',
              type === 'in' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            )}
          >
            Cash In
          </button>
          <button
            onClick={() => onSwitchType('out')}
            className={cn(
              'px-4 py-1.5 rounded-md text-sm font-medium',
              type === 'out' ? 'bg-destructive text-destructive-foreground' : 'bg-muted text-muted-foreground'
            )}
          >
            Cash Out
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-foreground">
                Date <span className="text-cash-out">*</span>
              </label>
              <div className="mt-1 border border-border rounded-md px-3 py-2 text-sm bg-card flex items-center gap-2">
                📅 {dateStr}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Time</label>
              <div className="mt-1 border border-border rounded-md px-3 py-2 text-sm bg-card flex items-center gap-2">
                🕐 {timeStr}
              </div>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="text-xs font-medium text-foreground">
              Amount <span className="text-cash-out">*</span>
            </label>
            <input
              type="text"
              placeholder="eg. 890 or 100 + 200*3"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 w-full border border-border rounded-md px-3 py-2 text-sm bg-card focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          {/* Contact Name */}
          <div>
            <label className="text-xs font-medium text-foreground">Contact Name</label>
            <div className="mt-1 flex items-center border border-border rounded-md">
              <input
                type="text"
                placeholder="Search or Select"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="flex-1 px-3 py-2 text-sm bg-transparent focus:outline-none"
              />
              <ChevronDown className="w-4 h-4 text-muted-foreground mr-2" />
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="text-xs font-medium text-foreground">Remarks</label>
            <input
              type="text"
              placeholder="e.g. Enter Details (Name, Bill No, Item Name, Quantity etc)"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="mt-1 w-full border border-border rounded-md px-3 py-2 text-sm bg-card focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          {/* Category & Payment Mode */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-foreground">Category</label>
              <div className="mt-1 flex items-center border border-border rounded-md">
                <input
                  type="text"
                  placeholder="Search or Select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm bg-transparent focus:outline-none"
                />
                <ChevronDown className="w-4 h-4 text-muted-foreground mr-2" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-foreground">Payment Mode</label>
              <div className="mt-1 flex items-center border border-border rounded-md">
                <input
                  type="text"
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm bg-transparent focus:outline-none"
                />
                <X className="w-3 h-3 text-muted-foreground mr-1 cursor-pointer" onClick={() => setPaymentMode('')} />
                <ChevronDown className="w-4 h-4 text-muted-foreground mr-2" />
              </div>
            </div>
          </div>

          {/* Attach Bills */}
          <div>
            <button className="flex items-center gap-2 border border-border rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent">
              <Image className="w-4 h-4" />
              Attach Bills
            </button>
            <p className="text-xs text-primary mt-1">Attach up to 4 images or PDF files</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex gap-2">
          <button
            onClick={() => handleSave(true)}
            className="flex-1 bg-primary text-primary-foreground rounded-md py-2 text-sm font-medium hover:opacity-90"
          >
            Save & Add New
          </button>
          <button
            onClick={() => handleSave(false)}
            className="px-6 border border-border rounded-md py-2 text-sm font-medium text-foreground hover:bg-accent"
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
};

export default CashEntryPanel;
