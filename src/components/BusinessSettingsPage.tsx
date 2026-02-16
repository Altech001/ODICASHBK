import { Pencil, Building2, MapPin, Users, Briefcase, Mail, Phone, ChevronRight, AlertTriangle, Info, Trash2, ArrowRightLeft } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import { useState } from 'react';

type Section = 'profile' | 'settings';

const BusinessSettingsPage = () => {
  const { businesses, activeBusinessId, renameBusiness } = useAppStore() as any;
  const activeBusiness = businesses.find((b: any) => b.id === activeBusinessId);
  const [activeSection, setActiveSection] = useState<Section>('profile');

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
            <SettingsTab />
          )}
        </div>
      </div>
    </div>
  );
};

const ProfileTab = ({ business }: { business: any }) => {
    const { renameBusiness } = useAppStore();
    const profileStrength = 52.5;

    return (
        <div className="space-y-8">
            {/* Profile Strength Card */}
            <div className="bg-white border border-slate-200 rounded-lg p-8 ">
                <div className="flex items-start gap-6 mb-8">
                    <div className="relative group">
                        <div className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center transition-colors group-hover:bg-slate-100">
                            <Building2 className="w-8 h-8 text-slate-400" />
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#4361ee] rounded flex items-center justify-center border-2 border-white">
                                <span className="text-white text-[18px] font-bold leading-none">+</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-[14px] font-semibold text-slate-800">{business?.name}</h2>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#ef4444]">
                            <AlertTriangle className="w-4 h-4 fill-current" />
                            <span className="text-[12px] font-bold">Incomplete business profile</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[13px] font-bold">
                            <span className="text-slate-400">Profile Strength: </span>
                            <span className="text-[#f59e0b]">Medium</span>
                            <span className="text-[#f59e0b] ml-1">{profileStrength}%</span>
                        </p>
                    </div>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-2 mb-8 overflow-hidden">
                    <div 
                        className="bg-[#f59e0b] h-full rounded-full transition-all duration-1000" 
                        style={{ width: `${profileStrength}%` }} 
                    />
                </div>

                <div className="bg-[#eef2ff] border border-[#e0e7ff] rounded p-4 flex items-start gap-4">
                    <div className="w-5 h-5 rounded-full bg-[#4361ee] flex items-center justify-center shrink-0 mt-0.5">
                        <Info className="w-3.5 h-3.5 text-white" />
                    </div>
                    <p className="text-[13px] text-slate-600  leading-relaxed">
                        6 out of 10 fields are incomplete. Fill these to complete your profile
                    </p>
                </div>
            </div>

            {/* Basics Section */}
            <div>
                <h3 className="text-[16px] font-semibold text-slate-800 mb-6">Basics</h3>
                <div className="bg-white border border-slate-200 rounded-lg p-8 space-y-8">
                    <EditableField 
                        label="Business Name" 
                        value={business?.name} 
                        icon={Building2} 
                        placeholder="Enter business name"
                        onSave={(val) => renameBusiness(business.id, val)}
                    />
                    <EditableField 
                        label="Business Address" 
                        value="" 
                        icon={MapPin} 
                        placeholder="Add business address"
                        isTextarea
                    />
                    <EditableField 
                        label="Staff Size" 
                        value="" 
                        icon={Users} 
                        placeholder="Select staff size"
                    />
                    <EditableField 
                        label="Business Category" 
                        value="Other" 
                        icon={Briefcase} 
                    />
                    <EditableField 
                        label="Business Subcategory" 
                        value="" 
                        icon={Briefcase} 
                        placeholder="Select business subcategory"
                    />
                    <EditableField 
                        label="Business Type" 
                        value="Trader" 
                        icon={Briefcase} 
                    />
                    <EditableField 
                        label="Business Registration Type" 
                        value="" 
                        icon={Briefcase} 
                        placeholder="Select registration type"
                    />
                </div>
            </div>

            {/* Communication Section */}
            <div>
                <h3 className="text-[16px] font-semibold text-slate-800 mb-6">Communication</h3>
                <div className="bg-white border border-slate-200 rounded-lg p-8 space-y-8">
                    <EditableField 
                        label="Business Email" 
                        value="albertabaasa07@gmail.com" 
                        icon={Mail} 
                    />
                    <EditableField 
                        label="Business Mobile Number" 
                        value="" 
                        icon={Phone} 
                        placeholder="Enter Business Mobile Number"
                    />
                </div>
            </div>
        </div>
    );
};

const SettingsTab = () => {
    return (
        <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded p-8 flex items-center justify-between transition-all hover:border-blue-200 ">
                <div className="flex-1">
                    <h3 className="text-[15px]  text-slate-800 mb-1">Change Primary Admin</h3>
                    <p className="text-[12px] text-slate-500 font-medium">Current Primary Admin: You</p>
                </div>
                <button className="flex items-center gap-2 bg-white text-[#f59e0b] px-5 py-2.5 rounded border border-[#f59e0b] text-[14px] font-semibold hover:bg-[#fff7ed] transition-all">
                    <ArrowRightLeft className="w-5 h-5" />
                    Change Primary Admin
                </button>
            </div>

            <div className="bg-white border border-slate-200 rounded p-8 flex items-center justify-between transition-all hover:border-red-200 ">
                <div className="flex-1">
                    <h3 className="text-[15px]  text-slate-800 mb-1">Delete Business</h3>
                    <p className="text-[12px] text-slate-500 font-medium">This will delete your business permanently</p>
                </div>
                <button className="flex items-center gap-2 bg-white text-[#ef4444] px-5 py-2.5 rounded border border-[#ef4444] text-[14px] font-semibold hover:bg-[#fef2f2] transition-all">
                    <Trash2 className="w-5 h-5 text-[#ef4444]" />
                    Delete business
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

    const handleSave = () => {
        if (onSave) onSave(value);
        setIsEditing(false);
    };

    return (
        <div className="flex items-start gap-5 group">
            <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0 group-hover:bg-slate-100 transition-colors">
                <Icon className="w-5 h-5 text-slate-400" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[11px] text-slate-400  uppercase  mb-2 px-1">{label}</p>
                {isEditing ? (
                    <div className="relative">
                        {isTextarea ? (
                            <textarea
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                onBlur={handleSave}
                                autoFocus
                                className="w-full bg-white border-2 border-[#4361ee] rounded px-4 py-3 text-[14px]  outline-none shadow-sm min-h-[100px]"
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
                                className="w-full bg-white border-2 border-[#4361ee] rounded px-4 py-3 text-[14px]  outline-none shadow-sm"
                                placeholder={placeholder}
                            />
                        )}
                        <button 
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4361ee] font-bold text-[12px]"
                            onMouseDown={(e) => e.preventDefault()} 
                            onClick={handleSave}
                        >
                            Save
                        </button>
                    </div>
                ) : (
                    <div 
                        onClick={() => setIsEditing(true)}
                        className="flex items-center justify-between group/field cursor-pointer bg-white border border-slate-100 rounded px-4 py-2.5 hover:border-[#4361ee]/40 transition-all min-h-[46px]"
                    >
                        <p className={cn(
                            "text-[15px]  truncate",
                            value ? "text-slate-800" : "text-slate-300"
                        )}>
                            {value || placeholder}
                        </p>
                        <Pencil className="w-4 h-4 text-slate-300 group-hover/field:text-[#4361ee] transition-colors shrink-0 ml-4 stroke-[2px]" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default BusinessSettingsPage;
