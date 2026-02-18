import { Outlet } from "react-router-dom";

const AuthLayout = () => {
    return (
        <div className="flex min-h-screen w-full overflow-hidden bg-white">
            {/* Left Side - Illustration */}
            <div className="hidden w-1/2 flex-col justify-between bg-[#E9F0FF] p-12 lg:flex">
                <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4361EE] text-white font-bold text-2xl">
                        C
                    </div>
                    <span className="text-xl font-bold tracking-tight text-[#2B3674]">CASHBOOK</span>
                </div>

                <div className="relative flex flex-col items-center justify-center">
                    {/* Background decorative circles */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-64 bg-white/40 rounded-full blur-3xl opacity-50" />
                    <div className="absolute top-1/2 left-0 w-32 h-32 bg-blue-200/50 rounded-full blur-2xl" />

                    <img
                        src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop"
                        alt="Dashboard Mockup"
                        className="z-10 w-full max-w-md rounded-2xl shadow-2xl"
                    />
                </div>

                <div className="space-y-4">
                    <h2 className="text-3xl font-bold text-[#2B3674]">Collaborate with your team</h2>
                    <p className="max-w-sm text-lg text-[#707EAE]">
                        Invite your team to CashBook and manage your group business books together.
                    </p>
                    <div className="flex items-center gap-2 pt-4">
                        <div className="h-2 w-2 rounded-full bg-[#4361EE]/20" />
                        <div className="h-2 w-2 rounded-full bg-[#4361EE]/20" />
                        <div className="h-2 w-2 rounded-full bg-[#4361EE]" />
                        <div className="h-2 w-2 rounded-full bg-[#4361EE]/20" />
                        <div className="ml-24">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#4361EE]"><path d="m9 18 6-6-6-6" /></svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Auth Forms */}
            <div className="flex w-full flex-col items-center justify-center p-8 lg:w-1/2">
                <div className="w-full max-w-[480px]">
                    <Outlet />
                </div>

                <div className="mt-12 text-center text-sm text-[#707EAE]">
                    To know more about CashBook please visit{" "}
                    <a href="https://cashbook.in" target="_blank" rel="noreferrer" className="font-semibold text-[#4361EE] hover:underline inline-flex items-center gap-1">
                        cashbook.in
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" x2="21" y1="14" y2="3" /></svg>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
