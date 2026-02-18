import { Pencil, Building2, Users, Mail, ChevronRight, AlertTriangle, Info, Trash2, ArrowRightLeft, Loader2, Calendar } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useWorkspaces, Workspace } from '@/hooks/useWorkspaces';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

type Section = 'profile' | 'settings';

const BusinessSettingsPage = () => {
    const { activeWorkspaceId } = useAuthStore();
    const { workspaces, isLoading } = useWorkspaces();
    const activeBusiness = workspaces.find((w) => w.id === activeWorkspaceId);
    const [activeSection, setActiveSection] = useState<Section>('profile');

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-[#fbfcfd]">
                <Loader2 className="w-8 h-8 animate-spin text-[#4361ee]" />
            </div>
        );
    }

    return (
        <div className="flex-1 flex bg-[#fbfcfd]">
            {/* Sidebar */}
            <div className="w-[240px] border-r border-slate-100 bg-white">
                <div className="py-2">
                    <button
                        onClick={() => setActiveSection('profile')}
                        className={cn(
                            'w-full text-left px-6 py-5 transition-all duration-200 relative',
                            activeSection === 'profile'
                                ? 'bg-[#eef2ff] border-r-4 border-[#4361ee]'
                                : 'hover:bg-slate-50'
                        )}
                    >
                        <p className={cn(
                            "text-[15px] font-bold mb-1",
                            activeSection === 'profile' ? "text-slate-800" : "text-slate-700"
                        )}>Business Profile</p>
                        <p className="text-[12px] text-slate-500 font-medium">Edit business details</p>
                    </button>
                    <button
                        onClick={() => setActiveSection('settings')}
                        className={cn(
                            'w-full text-left px-6 py-5 transition-all duration-200 relative',
                            activeSection === 'settings'
                                ? 'bg-[#eef2ff] border-r-4 border-[#4361ee]'
                                : 'hover:bg-slate-50'
                        )}
                    >
                        <p className={cn(
                            "text-[15px] font-bold mb-1",
                            activeSection === 'settings' ? "text-slate-800" : "text-slate-700"
                        )}>Settings</p>
                        <p className="text-[12px] text-slate-500 font-medium leading-relaxed">Change Primary Admin or delete business</p>
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-3xl p-8">
                    {activeSection === 'profile' ? (
                        <ProfileTab business={activeBusiness} />
                    ) : (
                        <SettingsTab business={activeBusiness} />
                    )}
                </div>
            </div>
        </div>
    );
};

const ProfileTab = ({ business }: { business: Workspace | undefined }) => {
    const { updateWorkspace } = useWorkspaces();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Workspace Overview Card */}
            <div className="bg-gray-400/10 rounded-l p-8">
                <div className="flex items-start gap-6 mb-8">
                    <div className="w-16 h-16 bg-[#4361ee]/10 rounded flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-[#4361ee]" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1.5">
                            <h2 className="text-[20px] font-bold text-slate-800 leading-tight">{business?.name || 'Loading...'}</h2>
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-black rounded border border-slate-200">
                                {business?.type}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="px-2 py-0.5 bg-slate-50 text-slate-400 text-[11px] font-medium font-mono rounded border border-slate-100">
                                ID: {business?.id}
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ecfdf5]">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                            <span className="text-[11px] font-bold text-[#10b981]">Active</span>
                        </div>
                    </div>
                </div>

                <div className="bg-[#f8fafc] rounded p-4 flex items-start gap-4">
                    <div className="w-7 h-7 flex items-center justify-center shrink-0">
                        <Info className="w-4 h-4 text-[#4361ee]" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-[13px] text-slate-700 font-bold">Workspace Policy</p>
                        <p className="text-[12px] text-slate-500 leading-relaxed">
                            This is a <strong>{business?.type?.toLowerCase()}</strong> workspace controlled by the owner email listed below. {business?.type === 'BUSINESS' ? 'Changes here affect all team members access.' : 'This workspace is restricted to private use.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Workspace Details */}
            <div>
                <div className="flex items-center justify-between mb-5 px-1">
                    <h3 className="text-[15px] font-semibold text-slate-800">Workspace Management</h3>
                    <span className="text-[10px] text-slate-400">Editable Fields</span>
                </div>

                <div className="bg-white border border-slate-200 rounded p-8 space-y-10">
                    <EditableField
                        label="Business Name"
                        value={business?.name || ''}
                        icon={Building2}
                        placeholder="Enter business name"
                        onSave={(val) => {
                            if (business?.id && val && val !== business.name) {
                                updateWorkspace({
                                    id: business.id,
                                    data: { name: val }
                                }, {
                                    onSuccess: () => toast.success('Workspace name updated'),
                                    onError: () => toast.error('Failed to update workspace name')
                                });
                            }
                        }}
                    />

                    <div className="h-[1px] bg-slate-50" />

                    {/* Meta Data Section */}
                    <div className="grid grid-cols-2 gap-10">
                        <ReadOnlyField
                            label="Workspace Owner"
                            value={business?.owner ? `${business.owner.firstName} ${business.owner.lastName}` : 'N/A'}
                            icon={Users}
                        />
                        <ReadOnlyField
                            label="Registered Email"
                            value={business?.owner?.email || 'N/A'}
                            icon={Mail}
                        />
                    </div>

                    <div className="pt-6 border-t border-slate-50">
                        <ReadOnlyField
                            label="Created Date"
                            value={business?.createdAt ? new Date(business.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}
                            icon={Calendar}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const ReadOnlyField = ({ label, value, icon: Icon }: { label: string, value: string, icon: any }) => (
    <div className="flex items-start gap-4">
        <div className="w-10 h-10   flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-slate-400" />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-[11px] text-slate-400 mb-1.5 font-bold">{label}</p>
            <p className="text-[14px] text-slate-700 font-bold truncate">{value}</p>
        </div>
    </div>
);

const SettingsTab = ({ business }: { business: Workspace | undefined }) => {
    const { deleteWorkspace } = useWorkspaces();
    const { user } = useAuthStore();

    const handleDelete = () => {
        if (!business) return;
        if (confirm(`Are you sure you want to delete "${business.name}"? This action cannot be undone.`)) {
            deleteWorkspace(business.id, {
                onSuccess: () => {
                    toast.success('Workspace deleted successfully');
                    setTimeout(() => window.location.href = '/', 500);
                },
                onError: () => toast.error('Failed to delete workspace')
            });
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="bg-white border border-slate-200  p-8 flex items-center justify-between transition-all hover:shadow-md hover:border-[#f59e0b]/30 group">
                <div className="flex-1">
                    <h3 className="text-[15px] font-bold text-slate-800 mb-1">Transfer Ownership</h3>
                    <p className="text-[12px] text-slate-500 font-medium leading-relaxed">
                        Currently owned by: <span className="text-[#f59e0b] font-bold">{user?.id === business?.ownerId ? 'You (Primary Admin)' : 'Another Administrator'}</span>
                    </p>
                </div>
                <button className="flex items-center gap-2 bg-white text-[#f59e0b] px-5 py-2.5 rounded-md border-2 border-[#f59e0b]/20 text-[13px] font-bold hover:bg-[#f59e0b] hover:text-white transition-all">
                    <ArrowRightLeft className="w-4 h-4 stroke-[2.5px]" />
                    Transfer
                </button>
            </div>

            <div className="bg-white border border-slate-200  p-8 flex items-center justify-between transition-all hover:shadow-md hover:border-red-200 group">
                <div className="flex-1">
                    <h3 className="text-[15px] font-bold text-slate-800 mb-1">Permanent Deletion</h3>
                    <p className="text-[12px] text-slate-500 font-medium">Removing this workspace will delete all associated cashbooks and entries.</p>
                </div>
                <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 bg-white text-[#ef4444] px-5 py-2.5 rounded-md border-2 border-[#ef4444]/20 text-[13px] font-bold hover:bg-[#ef4444] hover:text-white transition-all"
                >
                    <Trash2 className="w-4 h-4 stroke-[2.5px]" />
                    Delete
                </button>
            </div>
        </div>
    );
};

const EditableField = ({
    label,
    value: initialValue,
    icon: Icon,
    placeholder = 'Not set',
    isTextarea = false,
    onSave
}: {
    label: string;
    value: string;
    icon: any;
    placeholder?: string;
    isTextarea?: boolean;
    onSave?: (value: string) => void;
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    const handleSave = () => {
        if (onSave) onSave(value);
        setIsEditing(false);
    };

    return (
        <div className="flex items-start gap-5 group">
            <div className="w-10 h-10 rounded bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0 group-hover:bg-slate-100 transition-all">
                <Icon className="w-5 h-5 text-slate-400 group-hover:text-[#4361ee]" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[11px] text-slate-400 mb-2 px-1 font-bold">{label}</p>
                {isEditing ? (
                    <div className="relative animate-in zoom-in-95 duration-200">
                        {isTextarea ? (
                            <textarea
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                onBlur={handleSave}
                                autoFocus
                                className="w-full bg-white border-2 border-[#4361ee]  px-4 py-3 text-[14px] font-bold text-slate-700 outline-none shadow-lg min-h-[100px]"
                                placeholder={placeholder}
                            />
                        ) : (
                            <input
                                type="text"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                                onBlur={handleSave}
                                autoFocus
                                className="w-full bg-white border-2 border-[#4361ee]  px-4 py-3 text-[14px] font-bold text-slate-700 outline-none shadow-lg"
                                placeholder={placeholder}
                            />
                        )}
                        <button
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#4361ee] text-white px-3 py-1 rounded-lg font-bold text-[11px] shadow-sm hover:bg-[#3451d1] transition-colors"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={handleSave}
                        >
                            Save
                        </button>
                    </div>
                ) : (
                    <div
                        onClick={() => setIsEditing(true)}
                        className="flex items-center justify-between group/field cursor-pointer bg-white border border-slate-100  px-4 py-2.5 hover:border-[#4361ee]/40 transition-all min-h-[46px] hover:shadow-sm"
                    >
                        <p className={cn(
                            "text-[15px] font-bold truncate",
                            value ? "text-slate-700" : "text-slate-300 italic"
                        )}>
                            {value || placeholder}
                        </p>
                        <div className="flex items-center gap-2 opacity-0 group-hover/field:opacity-100 transition-opacity">
                            <span className="text-[10px] text-[#4361ee] font-bold uppercase tracking-wider">Edit</span>
                            <Pencil className="w-3.5 h-3.5 text-[#4361ee] shrink-0" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BusinessSettingsPage;
