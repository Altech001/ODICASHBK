import { X, ChevronDown, Image, Loader2, Calendar as CalendarIcon, Clock, Info, Settings, Search, Plus, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useEntries } from '@/hooks/useEntries';
import { useMetadata } from '@/hooks/useMetadata';
import { useContacts } from '@/hooks/useContacts';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface CashEntryPanelProps {
  bookId: string;
  workspaceId: string;
  type: 'in' | 'out';
  onClose: () => void;
  onSwitchType: (type: 'in' | 'out') => void;
}

const CashEntryPanel = ({ bookId, workspaceId, type, onClose, onSwitchType }: CashEntryPanelProps) => {
  const { categories, paymentModes, createCategory, createPaymentMode } = useMetadata(workspaceId);
  const { contacts, createContact } = useContacts(workspaceId);
  const { createEntry, isCreating } = useEntries(bookId);

  const [amount, setAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [paymentModeId, setPaymentModeId] = useState('');
  const [contactId, setContactId] = useState('');
  const now = new Date();
  const [entryDate, setEntryDate] = useState(now.toISOString().split('T')[0]);
  const [hour, setHour] = useState((now.getHours() % 12 || 12).toString().padStart(2, '0'));
  const [minute, setMinute] = useState(now.getMinutes().toString().padStart(2, '0'));
  const [period, setPeriod] = useState(now.getHours() >= 12 ? 'PM' : 'AM');
  const [attachments, setAttachments] = useState<File[]>([]);

  // Dropdown states
  const [showContactDropdown, setShowContactDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Dialog states
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');

  const contactRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const paymentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contactRef.current && !contactRef.current.contains(event.target as Node)) setShowContactDropdown(false);
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) setShowCategoryDropdown(false);
      if (paymentRef.current && !paymentRef.current.contains(event.target as Node)) setShowPaymentDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSave = (addNew: boolean) => {
    if (!amount) {
      toast.error('Please enter an amount');
      return;
    }

    const h = parseInt(hour);
    const militaryHour = period === 'PM' ? (h === 12 ? 12 : h + 12) : (h === 12 ? 0 : h);
    const entryTimeStr = `${militaryHour.toString().padStart(2, '0')}:${minute}`;
    const fullDate = new Date(`${entryDate}T${entryTimeStr}`);

    const evaluatedAmount = evaluateMath(amount);
    if (evaluatedAmount === null) {
      toast.error('Invalid amount or calculation');
      return;
    }

    const entryData = {
      type: type === 'in' ? 'INCOME' : 'EXPENSE',
      amount: evaluatedAmount.toString(),
      description: remarks || 'No description',
      entryDate: fullDate.toISOString(),
      categoryId: categoryId || undefined,
      paymentModeId: paymentModeId || undefined,
      contactId: contactId || undefined,
    };

    createEntry(entryData, {
      onSuccess: () => {
        toast.success('Entry saved successfully');
        if (addNew) {
          setAmount('');
          setRemarks('');
          setCategoryId('');
          setPaymentModeId('');
          setContactId('');
          setAttachments([]);
        } else {
          onClose();
        }
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to save entry');
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (attachments.length + newFiles.length > 4) {
        toast.error('Maximum 4 attachments allowed');
        return;
      }
      setAttachments([...attachments, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const evaluateMath = (input: string): number | null => {
    try {
      // Only allow numbers and basic operators
      if (!/^[0-9+\-*/.() ]+$/.test(input)) return null;
      // eslint-disable-next-line no-new-func
      const result = new Function(`return ${input}`)();
      return typeof result === 'number' && isFinite(result) ? result : null;
    } catch {
      return null;
    }
  };

  const handleCreateSuggestion = (name: string, typeVal: 'CATEGORY' | 'PAYMENT' | 'CONTACT') => {
    if (typeVal === 'CATEGORY') {
      const existing = categories.find(c => c.name.toLowerCase() === name.toLowerCase());
      if (existing) {
        setCategoryId(existing.id);
        setShowCategoryDropdown(false);
        return;
      }
      createCategory({ name, type: type === 'in' ? 'INCOME' : 'EXPENSE' }, {
        onSuccess: (newC) => { setCategoryId(newC.id); setShowCategoryDropdown(false); }
      });
    } else if (typeVal === 'PAYMENT') {
      const existing = paymentModes.find(p => p.name.toLowerCase() === name.toLowerCase());
      if (existing) {
        setPaymentModeId(existing.id);
        setShowPaymentDropdown(false);
        return;
      }
      createPaymentMode({ name }, {
        onSuccess: (newP) => { setPaymentModeId(newP.id); setShowPaymentDropdown(false); }
      });
    }
  };

  const INCOME_SUGGESTIONS = ["Sale", "Salary", "Bonus"];
  const EXPENSE_SUGGESTIONS = ["Food", "Transport", "Rent"];
  const PAYMENT_SUGGESTIONS = ["Online", "Debit Card", "Bank"];

  // Helper to get names for display
  const selectedContact = contacts.find(c => c.id === contactId);
  const selectedCategory = categories.find(c => c.id === categoryId);
  const selectedPaymentMode = paymentModes.find(p => p.id === paymentModeId);

  const filteredContacts = contacts.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredPaymentModes = paymentModes.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <>
      <div className="fixed inset-0 bg-foreground/20 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-[480px] bg-white shadow-xl z-50 animate-slide-in-right flex flex-col font-sans">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h2 className={cn('text-[17px] font-bold', type === 'in' ? 'text-emerald-600' : 'text-red-600')}>
            Add {type === 'in' ? 'Cash In' : 'Cash Out'} Entry
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Type toggle */}
        <div className="flex gap-2 p-4 pb-2">
          <button
            onClick={() => onSwitchType('in')}
            className={cn(
              'px-4 py-1.5 rounded-2xl text-sm font-bold transition-all',
              type === 'in' ? 'bg-emerald-600 text-white ' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
            )}
          >
            Cash In
          </button>
          <button
            onClick={() => onSwitchType('out')}
            className={cn(
              'px-4 py-1.5 rounded-2xl text-sm font-bold transition-all',
              type === 'out' ? 'bg-red-600 text-white ' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
            )}
          >
            Cash Out
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin scrollbar-thumb-slate-200">

          {/* Date & Time Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-slate-500 flex items-center gap-1">
                Date <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="w-full flex items-center gap-2.5 px-3 py-2.5 border border-slate-200 rounded text-[14px] font-bold text-slate-700 hover:border-slate-300 transition-all cursor-pointer bg-white">
                      <CalendarIcon className="w-4 h-4 text-[#4361ee]" />
                      <span>{entryDate ? format(new Date(entryDate), 'dd MMM, yyyy') : 'Select date'}</span>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-none shadow-2xl rounded-xl z-[70]" align="start">
                    <Calendar
                      mode="single"
                      selected={entryDate ? new Date(entryDate + 'T00:00:00') : undefined}
                      onSelect={(date) => date && setEntryDate(format(date, 'yyyy-MM-dd'))}
                      initialFocus
                      className="rounded-xl border border-slate-100 bg-white"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-slate-500">
                Time <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-1">
                <select
                  value={hour}
                  onChange={(e) => setHour(e.target.value)}
                  className="w-full px-2 py-2.5 border border-slate-200 rounded text-[14px] font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#4361ee]/30 bg-white"
                >
                  {Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0')).map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
                <select
                  value={minute}
                  onChange={(e) => setMinute(e.target.value)}
                  className="w-full px-2 py-2.5 border border-slate-200 rounded text-[14px] font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#4361ee]/30 bg-white"
                >
                  {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')).map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full px-2 py-2.5 border border-slate-200 rounded text-[14px] font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#4361ee]/30 bg-white"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[12px] font-bold text-slate-500">
                Amount <span className="text-red-500">*</span>
              </label>
              {amount && /[+\-*/]/.test(amount) && evaluateMath(amount) !== null && (
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded animate-in fade-in zoom-in-95">
                  Result: {evaluateMath(amount)}
                </span>
              )}
              <Info className="w-4 h-4 text-slate-300 cursor-help" />
            </div>
            <input
              type="text"
              placeholder="eg. 890 or 100 + 200*3"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded text-[14px] font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#4361ee]/30 transition-all"
            />
          </div>

          {/* Contact Name Custom Select */}
          <div className="space-y-1.5" ref={contactRef}>
            <div className="flex items-center justify-between">
              <label className="text-[12px] font-bold text-slate-500">Contact Name</label>
              <Settings className="w-4 h-4 text-[#4361ee]/70 cursor-pointer" />
            </div>
            <div className="relative">
              <div
                onClick={() => { setShowContactDropdown(!showContactDropdown); setSearchQuery(''); }}
                className="w-full flex items-center justify-between px-4 py-2.5 border border-slate-200 rounded cursor-pointer hover:border-slate-300 transition-all bg-white"
              >
                <span className={cn('text-[14px] font-bold', contactId ? 'text-slate-800' : 'text-slate-300')}>
                  {selectedContact?.name || 'Search or Select'}
                </span>
                <ChevronDown className={cn('w-4 h-4 text-slate-400 transition-transform', showContactDropdown && 'rotate-180')} />
              </div>

              {showContactDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-100 shadow-xl rounded-lg z-[60] py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-3 pb-2 border-b border-slate-50">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
                      <input
                        className="w-full pl-8 pr-3 py-1.5 text-[13px] border border-slate-100 rounded focus:outline-none bg-slate-50"
                        placeholder="Search contacts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="max-h-[220px] overflow-y-auto py-1">
                    {filteredContacts.length > 0 ? (
                      filteredContacts.map(c => (
                        <div
                          key={c.id}
                          className="px-4 py-2.5 text-[14px] font-bold text-slate-700 hover:bg-[#eef2ff] hover:text-[#4361ee] cursor-pointer flex items-center gap-2"
                          onClick={() => { setContactId(c.id); setShowContactDropdown(false); }}
                        >
                          <div className="w-2 h-2 rounded-full border border-slate-300" />
                          {c.name}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-4 text-center text-slate-400 text-xs font-bold">No contacts found</div>
                    )}
                  </div>
                  <div className="p-2 border-t border-slate-50">
                    <button
                      onClick={() => {
                        setNewItemName(searchQuery.trim());
                        setIsContactDialogOpen(true);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-[13px] font-bold text-[#4361ee] hover:bg-blue-50 rounded transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add New Contact
                    </button>
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-[13px] font-bold text-emerald-600 hover:bg-emerald-50 rounded transition-colors mt-1">
                      <Loader2 className="w-4 h-4 rotate-45" /> {/* Use as CSV icon for now */}
                      Import Bulk contacts from CSV
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Remarks */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-slate-500">Remarks</label>
            <input
              type="text"
              placeholder="e.g. Enter Details (Name, Bill No, Item Name, Quantity etc)"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded text-[14px] font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#4361ee]/30 transition-all"
            />
          </div>

          {/* Category & Payment Mode Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div className="space-y-1.5" ref={categoryRef}>
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-bold text-slate-500">
                  Category <span className="text-red-500">*</span>
                </label>
                <Settings className="w-3.5 h-3.5 text-[#4361ee]/70 cursor-pointer" />
              </div>
              <div className="relative">
                <div
                  onClick={() => { setShowCategoryDropdown(!showCategoryDropdown); setSearchQuery(''); }}
                  className="w-full flex items-center justify-between px-3 py-2.5 border border-slate-200 rounded cursor-pointer hover:border-slate-300 transition-all bg-white"
                >
                  <span className={cn('text-[13px] font-bold truncate', categoryId ? 'text-slate-800' : 'text-slate-300')}>
                    {selectedCategory?.name || 'Search or Select'}
                  </span>
                  <ChevronDown className={cn('w-4 h-4 text-slate-400 transition-transform flex-shrink-0', showCategoryDropdown && 'rotate-180')} />
                </div>
                {showCategoryDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-100 shadow-xl rounded-lg z-[60] py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-3 pb-2 border-b border-slate-50">
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
                        <input
                          className="w-full pl-8 pr-3 py-1.5 text-[12px] border border-slate-100 rounded focus:outline-none bg-slate-50"
                          placeholder="Search..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          autoFocus
                        />
                      </div>
                    </div>
                    <div className="max-h-[180px] overflow-y-auto py-1">
                      <p className="px-4 py-1 text-[10px] uppercase tracking-wider text-slate-300 font-black">In This Book</p>
                      {filteredCategories.map(c => (
                        <div
                          key={c.id}
                          className="px-4 py-2 text-[13px] font-bold text-slate-700 hover:bg-[#eef2ff] hover:text-[#4361ee] cursor-pointer flex items-center gap-2"
                          onClick={() => { setCategoryId(c.id); setShowCategoryDropdown(false); }}
                        >
                          <div className={cn("w-2 h-2 rounded-full border border-slate-300", categoryId === c.id && "bg-[#4361ee] border-[#4361ee]")} />
                          {c.name}
                        </div>
                      ))}

                      {searchQuery === '' && (
                        <>
                          <p className="px-4 py-1 mt-2 text-[10px] uppercase tracking-wider text-slate-300 font-black">Suggestions</p>
                          {(type === 'in' ? INCOME_SUGGESTIONS : EXPENSE_SUGGESTIONS).map(s => (
                            <div
                              key={s}
                              className="px-4 py-2 text-[13px] font-bold text-slate-400 hover:bg-[#eef2ff] hover:text-[#4361ee] cursor-pointer flex items-center gap-2 group"
                              onClick={() => handleCreateSuggestion(s, 'CATEGORY')}
                            >
                              <Plus className="w-3 h-3 opacity-30 group-hover:opacity-100" />
                              {s}
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                    <div className="p-2 border-t border-slate-50">
                      <button
                        onClick={() => {
                          setNewItemName(searchQuery.trim());
                          setIsCategoryDialogOpen(true);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-bold text-[#4361ee] hover:bg-blue-50 rounded transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add New Category
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Mode */}
            <div className="space-y-1.5" ref={paymentRef}>
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-bold text-slate-500">
                  Payment Mode <span className="text-red-500">*</span>
                </label>
                <Settings className="w-3.5 h-3.5 text-[#4361ee]/70 cursor-pointer" />
              </div>
              <div className="relative">
                <div
                  onClick={() => { setShowPaymentDropdown(!showPaymentDropdown); setSearchQuery(''); }}
                  className="w-full flex items-center justify-between px-3 py-2.5 border border-slate-200 rounded cursor-pointer hover:border-slate-300 transition-all bg-white"
                >
                  <div className="flex items-center gap-1 min-w-0">
                    <span className={cn('text-[13px] font-bold truncate', paymentModeId ? 'text-slate-800' : 'text-slate-300')}>
                      {selectedPaymentMode?.name || 'Search or Select'}
                    </span>
                    {paymentModeId && (
                      <X
                        className="w-3 h-3 text-slate-300 hover:text-slate-600 flex-shrink-0"
                        onClick={(e) => { e.stopPropagation(); setPaymentModeId(''); }}
                      />
                    )}
                  </div>
                  <div className="flex items-center border-l border-slate-100 pl-2 ml-1">
                    <ChevronDown className={cn('w-4 h-4 text-slate-400 transition-transform flex-shrink-0', showPaymentDropdown && 'rotate-180')} />
                  </div>
                </div>
                {showPaymentDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-100 shadow-xl rounded-lg z-[60] py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-3 pb-2 border-b border-slate-50">
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
                        <input
                          className="w-full pl-8 pr-3 py-1.5 text-[12px] border border-slate-100 rounded focus:outline-none bg-slate-50"
                          placeholder="Search..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          autoFocus
                        />
                      </div>
                    </div>
                    <div className="max-h-[180px] overflow-y-auto py-1">
                      <p className="px-4 py-1 text-[10px] uppercase tracking-wider text-slate-300 font-black">In This Book</p>
                      {filteredPaymentModes.map(p => (
                        <div
                          key={p.id}
                          className="px-4 py-2 text-[13px] font-bold text-slate-700 hover:bg-[#eef2ff] hover:text-[#4361ee] cursor-pointer flex items-center gap-2"
                          onClick={() => { setPaymentModeId(p.id); setShowPaymentDropdown(false); }}
                        >
                          <div className={cn("w-3 h-3 rounded-full border border-slate-300 flex items-center justify-center", paymentModeId === p.id && "bg-[#4361ee] border-[#4361ee]")}>
                            {paymentModeId === p.id && <div className="w-1 h-1 bg-white rounded-full" />}
                          </div>
                          {p.name}
                        </div>
                      ))}

                      {searchQuery === '' && (
                        <>
                          <p className="px-4 py-1 mt-2 text-[10px] uppercase tracking-wider text-slate-300 font-black">Suggestions</p>
                          {PAYMENT_SUGGESTIONS.map(s => (
                            <div
                              key={s}
                              className="px-4 py-2 text-[13px] font-bold text-slate-400 hover:bg-[#eef2ff] hover:text-[#4361ee] cursor-pointer flex items-center gap-2 group"
                              onClick={() => handleCreateSuggestion(s, 'PAYMENT')}
                            >
                              <Plus className="w-3 h-3 opacity-30 group-hover:opacity-100" />
                              {s}
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                    <div className="p-2 border-t border-slate-50">
                      <button
                        onClick={() => {
                          setNewItemName(searchQuery.trim());
                          setIsPaymentDialogOpen(true);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-bold text-[#4361ee] hover:bg-blue-50 rounded transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add New Payment Mode
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div className="space-y-3 pt-2">
            <div className="relative">
              <input
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center gap-2 border border-[#4361ee] rounded px-4 py-2 text-[13px] text-[#4361ee] font-bold hover:bg-blue-50 transition-colors bg-white cursor-pointer w-fit"
              >
                <Loader2 className="w-4 h-4 rotate-45" /> {/* Use as attachment/clip icon */}
                Attach Bills
              </label>
            </div>

            {attachments.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {attachments.map((file, index) => (
                  <div key={index} className="relative group aspect-square rounded-lg border border-slate-100 overflow-hidden bg-slate-50">
                    {file.type.startsWith('image/') ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] font-black p-1 text-slate-400">PDF</div>
                    )}
                    <button
                      onClick={() => removeAttachment(index)}
                      className="absolute top-1 right-1 bg-white/90 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <p className="text-[12px] text-emerald-600 font-bold">
              Attach up to 4 images or PDF files
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex gap-2">
          <button
            onClick={() => handleSave(true)}
            disabled={isCreating}
            className="flex-1 bg-white border border-[#4361ee] text-[#4361ee] rounded py-2.5 text-[14px] font-bold hover:bg-blue-50 transition-all shadow-sm flex items-center justify-center disabled:opacity-50"
          >
            {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save & Add New'}
          </button>
          <button
            onClick={() => handleSave(false)}
            disabled={isCreating}
            className="flex-1 bg-[#4361ee] text-white rounded py-2.5 text-[14px] font-bold hover:opacity-90 transition-all shadow-md shadow-blue-200 flex items-center justify-center disabled:opacity-50"
          >
            {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
          </button>
        </div>
      </div>

      {/* Dialogs */}
      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-800">Add New Contact</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="contact-name" className="text-sm font-bold text-slate-500">Contact Name</Label>
              <Input
                id="contact-name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Enter contact name"
                className="font-bold"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsContactDialogOpen(false)} className="font-bold border-slate-200">Cancel</Button>
            <Button onClick={() => {
              if (newItemName) {
                createContact({ name: newItemName }, {
                  onSuccess: (newC) => {
                    setContactId(newC.id);
                    setIsContactDialogOpen(false);
                    setShowContactDropdown(false);
                    setNewItemName('');
                    toast.success('Contact created');
                  }
                });
              }
            }} className="bg-[#4361ee] hover:bg-[#4361ee]/90 font-bold">Add Contact</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-800">Add New Category</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category-name" className="text-sm font-bold text-slate-500">Category Name</Label>
              <Input
                id="category-name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Enter category name"
                className="font-bold"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)} className="font-bold border-slate-200">Cancel</Button>
            <Button onClick={() => {
              if (newItemName) {
                createCategory({ name: newItemName, type: type === 'in' ? 'INCOME' : 'EXPENSE' }, {
                  onSuccess: (newC) => {
                    setCategoryId(newC.id);
                    setIsCategoryDialogOpen(false);
                    setShowCategoryDropdown(false);
                    setNewItemName('');
                    toast.success('Category created');
                  }
                });
              }
            }} className="bg-[#4361ee] hover:bg-[#4361ee]/90 font-bold">Add Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-800">Add Payment Mode</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="payment-name" className="text-sm font-bold text-slate-500">Mode Name</Label>
              <Input
                id="payment-name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="e.g. UPI, Bank Transfer"
                className="font-bold"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)} className="font-bold border-slate-200">Cancel</Button>
            <Button onClick={() => {
              if (newItemName) {
                createPaymentMode({ name: newItemName }, {
                  onSuccess: (newP) => {
                    setPaymentModeId(newP.id);
                    setIsPaymentDialogOpen(false);
                    setShowPaymentDropdown(false);
                    setNewItemName('');
                    toast.success('Payment mode created');
                  }
                });
              }
            }} className="bg-[#4361ee] hover:bg-[#4361ee]/90 font-bold">Add Payment Mode</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CashEntryPanel;
