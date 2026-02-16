import { X, Info, Check, CircleX } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface RolesPermissionsPanelProps {
    onClose: () => void;
}

type RoleType = 'Primary Admin' | 'Admin' | 'Employee';

const RolesPermissionsPanel = ({ onClose }: RolesPermissionsPanelProps) => {
    const [selectedRole, setSelectedRole] = useState<RoleType>('Primary Admin');

    const roleData: Record<RoleType, {
        info?: string;
        permissions: string[];
        restrictions?: string[];
        color: string;
        bgColor: string;
        borderColor: string;
    }> = {
        'Primary Admin': {
            info: 'Each business can have only one Primary Admin',
            permissions: [
                'Full access to all books of this business',
                'Full access to business settings',
                'Add/remove members in business'
            ],
            color: '#10b981',
            bgColor: '#ecfdf5',
            borderColor: '#10b981'
        },
        'Admin': {
            permissions: [
                'Full access to all books of this business',
                'Full access to business settings',
                'Add/remove members in business'
            ],
            restrictions: [
                "Can't delete business",
                "Can't remove Primary Admin from business"
            ],
            color: '#f59e0b',
            bgColor: '#fff7ed',
            borderColor: '#f59e0b'
        },
        'Employee': {
            permissions: [
                'Limited access to selected books',
                'Primary Admin/Admin can assign Book Admin, Viewer or Operator role to Employee in any book',
                'Can leave business from business settings'
            ],
            restrictions: [
                'No access to books they are not part of',
                'No option to delete books',
                "Can't view employee details"
            ],
            color: '#4361ee',
            bgColor: '#eef2ff',
            borderColor: '#4361ee'
        }
    };

    const current = roleData[selectedRole];

    return (
        <>
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[100]" onClick={onClose} />
            <div className="fixed right-0 top-0 h-full w-[480px] bg-white  z-[110] animate-slide-in-right flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
                    <h2 className="text-[18px]  text-slate-800">Business Roles & Permissions</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                        <X className="w-6 h-6 text-slate-500 stroke-[2.5px]" />
                    </button>
                </div>

                <div className="flex-1 p-8 overflow-y-auto">
                    {/* Role Selection Tabs */}
                    <div className="flex gap-3 mb-8">
                        {(['Primary Admin', 'Admin', 'Employee'] as RoleType[]).map((role) => (
                            <button
                                key={role}
                                onClick={() => setSelectedRole(role)}
                                className={cn(
                                    "px-5 py-2 rounded-full text-[13px]  border transition-all",
                                    selectedRole === role
                                        ? `border-2`
                                        : "bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100"
                                )}
                                style={selectedRole === role ? {
                                    backgroundColor: current.bgColor,
                                    color: current.color,
                                    borderColor: current.borderColor
                                } : {}}
                            >
                                {role === 'Primary Admin' ? 'Primary Admin (You)' : role}
                            </button>
                        ))}
                    </div>

                    {/* Info Box */}
                    {current.info && (
                        <div className="mb-10 bg-[#eef2ff] border border-[#e0e7ff] rounded-none p-4 flex items-start gap-4">
                            <div className="w-6 h-6 rounded-full bg-[#4361ee] flex items-center justify-center shrink-0 mt-0.5">
                                <Info className="w-4 h-4 text-white" />
                            </div>
                            <p className="text-[13px] text-slate-600  leading-relaxed">
                                {current.info}
                            </p>
                        </div>
                    )}

                    {/* Permissions Section */}
                    <div className="mb-10">
                        <h3 className="text-[13px]  text-slate-400 uppercase tracking-[0.15em] mb-6 px-1">Permissions</h3>
                        <div className="space-y-6">
                            {current.permissions.map((permission, i) => (
                                <div key={i} className="flex items-start gap-4 px-1">
                                    <div className="w-5 h-5 rounded-full bg-[#10b981] flex items-center justify-center shrink-0 mt-0.5">
                                        <Check className="w-3 h-3 text-white stroke-[4px]" />
                                    </div>
                                    <p className="text-[14px]  text-slate-700 leading-tight">{permission}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Restrictions Section */}
                    {current.restrictions && (
                        <div>
                            <h3 className="text-[13px]  text-slate-400 uppercase tracking-[0.15em] mb-6 px-1">Restrictions</h3>
                            <div className="space-y-6">
                                {current.restrictions.map((restriction, i) => (
                                    <div key={i} className="flex items-start gap-4 px-1">
                                        <div className="w-5 h-5 rounded-full bg-[#ef4444] flex items-center justify-center shrink-0 mt-0.5">
                                            <CircleX className="w-3 h-3 text-white stroke-[3px]" />
                                        </div>
                                        <p className="text-[14px]  text-slate-700 leading-tight">{restriction}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-8 border-t border-slate-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-[#4361ee] text-white px-10 py-3 rounded border text-[14px]  hover:opacity-90  active:scale-95 transition-all"
                    >
                        Ok, Got It
                    </button>
                </div>
            </div>
        </>
    );
};

export default RolesPermissionsPanel;
