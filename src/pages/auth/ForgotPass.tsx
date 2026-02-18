import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Loader2, ArrowLeft } from "lucide-react";
import { apiClient } from "@/api/client";
import { toast } from "sonner";

const ForgotPass = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await apiClient.post("/auth/forgot-password", { email });
            if (response.data.success) {
                toast.success("Verification code sent to your email!");
                // Navigate to reset password page with email in query params
                navigate(`/reset-password?email=${encodeURIComponent(email)}`);
            }
        } catch (error: any) {
            const errorData = error.response?.data;
            toast.error(errorData?.message || "Failed to send code. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col">
            <div className="mb-8">
                <Link to="/login" className="inline-flex items-center gap-2 text-sm font-medium text-[#707EAE] hover:text-[#4361EE] transition-colors mb-4 group">
                    <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                    Back to Login
                </Link>
                <h1 className="text-2xl font-bold text-[#2B3674]">Forgot Password?</h1>
                <p className="mt-2 text-sm text-[#707EAE]">No worries, we'll send you reset instructions.</p>
            </div>

            <div className="w-full">
                <form onSubmit={handleRequestOtp} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold text-[#2B3674]">Email Address</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-[#A3AED0]" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="user@odibooks.com"
                                className="h-12 border-[#E0E5F2] pl-11 outline-none focus:rounded-none"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-12 bg-[#4361EE] text-white rounded-none hover:bg-[#334ed1] transition-all shadow-lg shadow-blue-500/10"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send Verification Code"}
                    </Button>
                </form>

                <div className="mt-10 text-center text-xs">
                    <p className="text-[#707EAE]">
                        Remembered your password?{" "}
                        <Link to="/login" className="font-bold text-[#4361EE] hover:underline">
                            Log In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPass;
