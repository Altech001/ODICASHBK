import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Loader2, User, Lock } from "lucide-react";
import { apiClient } from "@/api/client";
import { toast } from "sonner";

const SignUp = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await apiClient.post("/auth/register", formData);
            if (response.data.success) {
                toast.success("Registration successful! Please check your email for verification.");
                navigate("/login");
            }
        } catch (error: any) {
            const errorData = error.response?.data;
            if (errorData?.errors) {
                const errorMessages = Object.values(errorData.errors).flat();
                errorMessages.forEach((msg: any) => toast.error(msg));
            } else {
                toast.error(errorData?.message || "Registration failed. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    return (
        <div className="flex flex-col">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[#2B3674]">Create Account</h1>
                <p className="mt-2 text-sm text-[#707EAE]">Join CashBook and start managing your finances.</p>
            </div>

            <div className="w-full">
                <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName" className="text-sm font-semibold text-[#2B3674]">First Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-5 w-5 text-[#A3AED0]" />
                                <Input
                                    id="firstName"
                                    placeholder="John"
                                    className="h-12 pl-11 outline-none border-[1px] focus:border-none rounded-none"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName" className="text-sm font-semibold text-[#2B3674]">Last Name</Label>
                            <Input
                                id="lastName"
                                placeholder="Doe"
                                className="h-12 pl-11 outline-none border-[1px] focus:border-none rounded-none"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold text-[#2B3674]">Email Address</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-[#A3AED0]" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                className="h-12 pl-11 outline-none border-[1px] focus:border-none rounded-none"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-semibold text-[#2B3674]">Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-[#A3AED0]" />
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className="h-12 pl-11 outline-none border-[1px] focus:border-none rounded-none"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <p className="px-1 text-[11px] text-[#707EAE]">
                            Must be 8+ characters with mixed case and numbers.
                        </p>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-12 mt-4 bg-[#4361EE] text-white rounded-none hover:bg-[#334ed1] transition-all"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Step into Efficiency"}
                    </Button>
                </form>

                <div className="mt-6 text-center text-xs">
                    <p className="text-[#707EAE]">
                        Already have an account?{" "}
                        <Link to="/login" className="font-bold text-[#4361EE] hover:underline">
                            Log In
                        </Link>
                    </p>
                </div>

                <p className="mt-8 text-center text-xs leading-relaxed text-[#707EAE]">
                    By signing up, you agree to our{" "}
                    <a href="#" className="font-semibold text-[#4361EE] hover:underline">Terms of Service</a> and{" "}
                    <a href="#" className="font-semibold text-[#4361EE] hover:underline">Privacy Policy</a>.
                </p>
            </div>
        </div>
    );
};

export default SignUp;

