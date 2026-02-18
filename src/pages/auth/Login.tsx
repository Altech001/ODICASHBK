import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Loader2, Lock } from "lucide-react";
import { apiClient } from "@/api/client";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await apiClient.post("/auth/login", { email, password });
            if (response.data.success) {
                setAuth(response.data.data.user);
                toast.success("Login successful!");
                navigate("/cashbooks");
            }
        } catch (error: any) {
            const errorData = error.response?.data;
            if (errorData?.errors) {
                const errorMessages = Object.values(errorData.errors).flat();
                errorMessages.forEach((msg: any) => toast.error(msg));
            } else {
                toast.error(errorData?.message || "Login failed. Please check your credentials.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#2B3674]">Welcome back!</h1>
                <p className="mt-2 text-[#707EAE]">Enter your details to access your account.</p>
            </div>

            <div className="w-full">
                <form onSubmit={handleLogin} className="space-y-5">
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

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-sm font-semibold text-[#2B3674]">Password</Label>
                            <Link to="/forgot-password" className="text-xs font-medium text-[#4361EE] hover:underline">Forgot password?</Link>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-[#A3AED0]" />
                            <Input
                                id="password"
                                type="password"
                                placeholder="************"
                                className="h-12 outline-none pl-11 border-[1px] border-[#E0E5F2] focus:rounded-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-12 bg-[#4361EE] text-white rounded-none hover:bg-[#334ed1] transition-all"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
                    </Button>
                </form>

                <div className="mt-8 text-center text-sm">
                    <p className="text-[#707EAE]">
                        Don't have an account?{" "}
                        <Link to="/signup" className="font-bold text-[#4361EE] hover:underline">
                            Create an account
                        </Link>
                    </p>
                </div>

                <p className="mt-10 text-center text-xs leading-relaxed text-[#707EAE]">
                    By signing in, you agree to our{" "}
                    <a href="#" className="font-semibold text-[#4361EE] transition-colors hover:text-[#334ed1]">Terms</a> and{" "}
                    <a href="#" className="font-semibold text-[#4361EE] transition-colors hover:text-[#334ed1]">Privacy Policy</a>.
                </p>
            </div>
        </div>
    );
};

export default Login;

