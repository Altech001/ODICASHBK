import { Outlet } from "react-router-dom";
import { ExternalLink } from "lucide-react";

const AuthLayout = () => {
    return (
        <div className="flex min-h-screen w-full overflow-hidden bg-[#FAFBFF]">
            {/* Left Side - Illustration & Branding */}
            <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden lg:flex">
                {/* Full Background Image */}
                <img
                    src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2422&auto=format&fit=crop"
                    alt="Financial Dashboard"
                    className="absolute inset-0 h-full w-full object-cover"
                />
                {/* Stylized Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#4361EE]/90 via-[#4361EE]/80 to-[#2B3674]/95" />

                <div className="relative z-10 p-2">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold tracking-tight text-white"></span>
                    </div>
                </div>

                <div className="relative z-10 flex flex-col items-center justify-center px-12">
                    <div className="text-center text-white">
                        <h2 className="text-2xl font-bold leading-tight">Manage your finances with ease.</h2>
                        <p className="mx-auto mt-6 max-w-md text-sm text-blue-100/80">
                            Join thousands of businesses managing their daily transactions and team collaboration in one secure place.
                        </p>
                    </div>
                </div>

                <div className="relative z-10 p-12">
                    <div className="flex items-center gap-6">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-10 w-10 rounded-full border-2 border-[#4361EE] bg-gray-200">
                                    <img
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 20}`}
                                        alt="User"
                                        className="rounded-full"
                                    />
                                </div>
                            ))}
                        </div>
                        <p className="text-xs font-medium text-blue-100">
                            Trusted by <span className="font-semibold text-white">10,000+</span> teams
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Auth Forms */}
            <div className="flex w-full flex-col items-center justify-center p-6 lg:w-1/2">
                <div className="w-full max-w-[440px]">
                    <div className="mb-8 flex justify-center lg:hidden">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold tracking-tight text-[#2B3674]">ODIBOOK</span>
                        </div>
                    </div>

                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Outlet />
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-xs font-medium text-[#707EAE]">
                        Explore more at{" "}
                        <a
                            href="https://hspotagent.com/sign-in"
                            target="_blank"
                            rel="noreferrer"
                            className="group inline-flex items-center gap-1 font-semibold text-[#4361EE] hover:underline"
                        >
                            ODIBOOK.in
                            <ExternalLink size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;

