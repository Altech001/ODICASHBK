import { ArrowLeft, Mail, IdCard, Phone, ChevronDown, ChevronUp, Info, Check, BookText, Users } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Cashbook } from '@/hooks/useCashbooks';

interface MemberInfoPageProps {
    member: {
        id: string;
        name: string;
        email: string;
        role: string;
        avatar: string;
        joinedAt?: string;
    };
    books: Cashbook[];
    onBack: () => void;
}

const MemberInfoPage = ({ member, books, onBack }: MemberInfoPageProps) => {
    const [permissionsOpen, setPermissionsOpen] = useState(false);
    const [booksOpen, setBooksOpen] = useState(false);

    // Map backend roles to UI roles
    const displayRole = member.role === 'OWNER' ? 'Primary Admin' :
        member.role === 'ADMIN' ? 'Admin' : 'Employee';

    // Mocked role data based on RolesPermissionsPanel
    const roleData = {
        'Primary Admin': {
            info: 'Each business can have only one Primary Admin',
            permissions: [
                'Full access to all books of this business',
                'Full access to business settings',
                'Add/remove members in business'
            ],
            color: '#10b981',
            bgColor: '#ecfdf5'
        },
        'Admin': {
            info: '',
            permissions: [
                'Full access to all books of this business',
                'Full access to business settings',
                'Add/remove members in business'
            ],
            color: '#f59e0b',
            bgColor: '#fff7ed'
        },
        'Employee': {
            info: '',
            permissions: [
                'Limited access to selected books',
                'Primary Admin/Admin can assign Book Admin, Viewer or Operator role to Employee in any book',
                'Can leave business from business settings'
            ],
            color: '#4361ee',
            bgColor: '#eef2ff'
        }
    };

    const currentRole = roleData[displayRole] || roleData['Employee'];

    const formattedJoinedDate = member.joinedAt
        ? new Date(member.joinedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        : 'Recently';

    return (
        <div className="flex-1 bg-white min-h-screen flex flex-col">
            {/* Top Header */}
            <div className="flex items-center gap-4 px-6 py-4 bg-white border-b border-slate-100 sticky top-0 z-10">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-slate-50 rounded-full transition-colors order-first"
                >
                    <ArrowLeft className="w-5 h-5 text-slate-600 stroke-[2.5px]" />
                </button>
                <h1 className="text-[12px] font-medium text-slate-800">{displayRole} Info</h1>
            </div>

            <div className="p-6 max-w-2xl space-y-4">
                {/* Main Info Card */}
                <div className="bg-white border border-slate-200 rounded-lg p-4 ">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-6">
                            <div className={cn(
                                'w-12 h-12 rounded-full flex items-center justify-center text-[20px] font-bold border-2',
                                member.avatar === 'A' ? 'bg-[#f1f5f9] text-[#64748b] border-[#e2e8f0]' : 'bg-[#fff1f2] text-[#e11d48] border-[#ffe4e6]'
                            )}>
                                {member.avatar}
                            </div>
                            <div>
                                <h2 className="text-[14px] font-bold text-slate-800">{member.name}</h2>
                                <p className="text-[12px] text-slate-400 font-medium mt-1">Member since {formattedJoinedDate}</p>
                            </div>
                        </div>
                        <span className={cn(
                            'text-[10px] font-bold px-3 py-1 rounded border uppercase tracking-wider',
                            member.role === 'OWNER' ? 'text-[#10b981] bg-[#ecfdf5] border-[#d1fae5]' :
                                member.role === 'ADMIN' ? 'text-[#f59e0b] bg-[#fff7ed] border-[#ffedd5]' :
                                    'text-[#4361ee] bg-[#eef2ff] border-[#e0e7ff]'
                        )}>
                            {displayRole}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-y-8 border-t border-slate-50 pt-8">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                                <Mail className="w-5 h-5 text-slate-400" />
                            </div>
                            <div>
                                <p className="text-[12px] text-slate-400  uppercase font-bold mb-1">Email Address</p>
                                <p className="text-[14px] text-slate-700 font-medium">{member.email}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 border-l border-slate-100 pl-8">
                            <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                                <IdCard className="w-5 h-5 text-slate-400" />
                            </div>
                            <div>
                                <p className="text-[12px] text-slate-400  uppercase font-bold mb-1">Employee ID</p>
                                <button className="text-[14px] text-[#4361ee] font-medium hover:underline">Add Employee ID</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Permissions Section */}
                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden ">
                    <button
                        onClick={() => setPermissionsOpen(!permissionsOpen)}
                        className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50/50 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
                                <Users className="w-5 h-5 text-[#4361ee]" />
                            </div>
                            <div>
                                <h3 className="text-[15px] font-bold text-slate-800">{displayRole} Permission</h3>
                                <p className="text-[12px] text-slate-400 font-medium mt-0.5">List of actions {displayRole} can take</p>
                            </div>
                        </div>
                        {permissionsOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                    </button>

                    {permissionsOpen && (
                        <div className="p-6 pt-0 space-y-6">
                            <div className="h-[1px] bg-slate-100 mb-6" />

                            {currentRole.info && (
                                <div className="bg-[#eef2ff] border border-[#e0e7ff] rounded-lg p-4 flex items-start gap-4 mb-6">
                                    <div className="w-5 h-5 rounded-full bg-[#4361ee] flex items-center justify-center shrink-0 mt-0.5">
                                        <Info className="w-3 h-3 text-white" />
                                    </div>
                                    <p className="text-[13px] text-slate-600 font-medium leading-relaxed">{currentRole.info}</p>
                                </div>
                            )}

                            <div className="space-y-4">
                                <h4 className="text-[12px] text-slate-400  uppercase  mb-4">Permissions</h4>
                                {currentRole.permissions.map((perm, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-[#10b981] flex items-center justify-center shrink-0">
                                            <Check className="w-3 h-3 text-white stroke-[4px]" />
                                        </div>
                                        <p className="text-[14px] text-slate-700 ">{perm}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Books Section */}
                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden ">
                    <button
                        onClick={() => setBooksOpen(!booksOpen)}
                        className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50/50 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
                                <BookText className="w-5 h-5 text-[#4361ee]" />
                            </div>
                            <div>
                                <h3 className="text-[15px] font-bold text-slate-800">Books ({books.length})</h3>
                                <p className="text-[12px] text-slate-400 font-medium mt-0.5">List of assigned books</p>
                            </div>
                        </div>
                        {booksOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                    </button>

                    {booksOpen && (
                        <div className="p-6 pt-0 divide-y divide-slate-50">
                            <div className="h-[1px] bg-slate-100 mb-2" />
                            {books.length > 0 ? (
                                books.map((book) => (
                                    <div key={book.id} className="flex items-center gap-4 py-4 first:pt-2">
                                        <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center">
                                            <BookText className="w-5 h-5 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-[15px] font-bold text-slate-800">{book.name}</p>
                                            <p className="text-[12px] text-slate-400 font-medium">
                                                {displayRole === 'Primary Admin' || displayRole === 'Admin' ? 'Full Access' : 'View & Manage'}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="py-8 text-center text-[13px] text-slate-400 italic font-medium">No books assigned to this member yet.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MemberInfoPage;
