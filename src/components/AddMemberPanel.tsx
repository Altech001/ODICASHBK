import { X, Search, UserPlus, Info, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AddMemberPanelProps {
    businessName: string;
    onClose: () => void;
    onAddMember: (email: string) => void;
}

const AddMemberPanel = ({ businessName, onClose, onAddMember }: AddMemberPanelProps) => {
    const [step, setStep] = useState<'select' | 'email'>('select');
    const [email, setEmail] = useState('');

    const handleNext = () => {
        if (email) {
            onAddMember(email);
            onClose();
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[60]" onClick={onClose} />
            <div className="fixed right-0 top-0 h-full w-[440px] bg-white shadow-2xl z-[70] animate-slide-in-right flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                    <h2 className="text-[18px] font-bold text-slate-800">
                        {step === 'select' ? `Add from ${businessName}` : 'Add New Member'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-500 stroke-[2.5px]" />
                    </button>
                </div>

                {step === 'select' ? (
                    <div className="flex-1 flex flex-col">
                        {/* Info Message */}
                        <div className="m-4 mt-6 p-3 bg-[#eef2ff] border border-blue-50 rounded-lg flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-[#4361ee] flex items-center justify-center shrink-0 mt-0.5">
                                <Info className="w-3 h-3 text-white fill-white" />
                            </div>
                            <p className="text-[13px] text-slate-600 font-medium leading-relaxed">
                                You can add members to this book from the staff of "{businessName}"
                            </p>
                        </div>

                        {/* Search */}
                        <div className="px-6 mb-8 mt-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name or number..."
                                    className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-md text-[14px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-400"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-300 border border-slate-100 rounded px-1.5 py-0.5">/</span>
                            </div>
                        </div>

                        {/* Add New Member Button */}
                        <div
                            onClick={() => setStep('email')}
                            className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 cursor-pointer transition-colors group"
                        >
                            <div className="w-12 h-12 rounded-full bg-[#eef2ff] flex items-center justify-center transition-colors group-hover:bg-[#e0e7ff]">
                                <UserPlus className="w-5 h-5 text-[#4361ee]" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[15px] font-bold text-slate-800">Add New Member</p>
                                <p className="text-[12px] text-slate-400 font-medium mt-0.5">Invite members who are not part of your business yet</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                        </div>

                        {/* Business Staff List Label */}
                        <div className="px-6 mt-8 mb-6">
                            <h3 className="text-[13px] text-slate-400 font-bold uppercase tracking-wider">Members of {businessName}</h3>
                        </div>

                        {/* Empty State */}
                        <div className="flex-1 px-6 flex flex-col items-center justify-start pt-10">
                            <p className="text-[14px] text-slate-400 font-medium italic">There are no staff members in business!</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col">
                        <div className="p-8 pb-0">
                            <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                                Add Email
                            </label>
                            <input
                                type="email"
                                placeholder="eg. xyz123@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoFocus
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg text-[15px] focus:outline-none focus:ring-2 focus:ring-[#4361ee]/20 focus:border-[#4361ee] transition-all"
                            />
                        </div>

                        {/* Footer */}
                        <div className="mt-auto p-6 border-t border-slate-100 flex items-center justify-end gap-4">
                            <button
                                onClick={() => onClose()}
                                className="text-[14px] text-[#4361ee] font-bold hover:bg-slate-50 px-6 py-2.5 rounded-md transition-all border border-slate-200 bg-white"
                            >
                                Add With Mobile Number
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={!email}
                                className={cn(
                                    "px-12 py-2.5 rounded-md text-[14px] font-bold transition-all shadow-md shadow-blue-500/10",
                                    email
                                        ? "bg-[#4361ee] text-white hover:opacity-90"
                                        : "bg-slate-200/50 text-slate-400 cursor-not-allowed"
                                )}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default AddMemberPanel;
