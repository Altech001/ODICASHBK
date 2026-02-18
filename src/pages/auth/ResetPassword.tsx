import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, CheckCircle2, Lock, KeyRound } from "lucide-react";
import { apiClient } from "@/api/client";
import { toast } from "sonner";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [email, setEmail] = useState(searchParams.get("email") || "");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (!email) {
            toast.error("Invalid session. Please request a new code.");
            navigate("/forgot-password");
        }
    }, [email, navigate]);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await apiClient.post("/auth/reset-password", {
                email,
                otp,
                newPassword
            });
            if (response.data.success) {
                setIsSuccess(true);
                toast.success("Password reset successfully!");
                setTimeout(() => navigate("/login"), 3000);
            }
        } catch (error: any) {
            const errorData = error.response?.data;
            if (errorData?.errors) {
                const errorMessages = Object.values(errorData.errors).flat();
                errorMessages.forEach((msg: any) => toast.error(msg));
            } else {
                toast.error(errorData?.message || "Reset failed. Please check the code and try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="mb-8 text-center flex flex-col items-center">
                    <div className="h-20 w-20 bg-green-50 rounded-full flex items-center justify-center mb-6 text-green-500 shadow-inner">
                        <CheckCircle2 className="h-12 w-12" />
                    </div>
                    <h1 className="text-2xl font-bold text-[#2B3674]">Password Updated!</h1>
                    <p className="mt-4 text-sm text-[#707EAE] text-center max-w-[320px] leading-relaxed">
                        Your password has been reset successfully. You are now being redirected to the login page.
                    </p>
                </div>

                <div className="mt-6">
                    <Link to="/login">
                        <Button className="w-full h-12 bg-[#4361EE] text-white rounded-none hover:bg-[#334ed1] transition-all shadow-lg shadow-blue-500/10">
                            Proceed to Login
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="mb-8">
                <Link
                    to="/forgot-password"
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#707EAE] hover:text-[#4361EE] transition-all mb-4 group"
                >
                    <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
                    Change Email
                </Link>
                <h1 className="text-2xl font-bold text-[#2B3674]">New Password</h1>
                <p className="mt-2 text-sm text-[#707EAE]">Enter the verification code sent to <span className="text-[#2B3674] font-semibold">{email}</span></p>
            </div>

            <div className="w-full">
                <form onSubmit={handleResetPassword} className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="otp" className="text-sm font-semibold text-[#2B3674]">6-Digit Code</Label>
                        <div className="relative">
                            <KeyRound className="absolute left-3 top-3 h-5 w-5 text-[#A3AED0]" />
                            <Input
                                id="otp"
                                type="text"
                                placeholder="000000"
                                maxLength={6}
                                className="h-12 border-[#E0E5F2] pl-11 outline-none focus:rounded-none text-lg font-bold"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-sm font-semibold text-[#2B3674]">Confirm New Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-[#A3AED0]" />
                            <Input
                                id="newPassword"
                                type="password"
                                placeholder="************"
                                className="h-12 outline-none pl-11 border-[1px] border-[#E0E5F2] focus:rounded-none"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <p className="px-1 text-[11px] text-[#707EAE] leading-tight">
                            At least 8 characters, with capital letters, lowercase, and numbers.
                        </p>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-12 bg-[#4361EE] text-white rounded-none hover:bg-[#334ed1] transition-all shadow-lg shadow-blue-500/10 mt-4"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Verify & Update"}
                    </Button>
                </form>

                <div className="mt-10 pt-6 border-t border-[#E0E5F2] text-center">
                    <p className="text-xs text-[#707EAE]">
                        Having trouble?{" "}
                        <button
                            type="button"
                            onClick={() => navigate("/forgot-password")}
                            className="font-bold text-[#4361EE] hover:underline"
                        >
                            Request a new code
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
