import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

const Login = () => {
    return (
        <div className="flex flex-col items-center">
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold text-[#2B3674]">Welcome to CashBook 👋</h1>
                <p className="mt-2 text-[#707EAE]">Login/Register to CashBook</p>
            </div>

            <div className="w-full rounded-[20px] border border-[#E0E5F2] bg-white p-10 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.05)]">
                <h3 className="mb-6 text-center font-medium text-[#2B3674]">Choose one option to continue</h3>

                <div className="space-y-4">
                    <Button
                        variant="outline"
                        className="flex h-14 w-full items-center justify-center gap-3 border-[#E0E5F2] text-lg font-medium text-[#4361EE] hover:bg-slate-50"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.63l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Continue With Google
                    </Button>

                    <Button
                        variant="outline"
                        className="flex h-14 w-full items-center justify-center gap-3 border-[#E0E5F2] text-lg font-medium text-[#4361EE] hover:bg-slate-50"
                    >
                        <Mail className="h-5 w-5 text-[#4361EE]" />
                        Continue With Email
                    </Button>
                </div>

                <p className="mt-8 text-center text-xs leading-relaxed text-[#707EAE]">
                    By continuing, you are indicating that you accept our{" "}
                    <a href="#" className="font-semibold text-[#4361EE] transition-colors hover:text-[#334ed1]">Terms of Service</a> and{" "}
                    <a href="#" className="font-semibold text-[#4361EE] transition-colors hover:text-[#334ed1]">Privacy Policy</a>.
                </p>

                <div className="relative my-8 flex items-center">
                    <div className="flex-grow border-t border-[#E0E5F2]"></div>
                    <span className="mx-4 flex-shrink text-sm font-medium text-[#707EAE]">OR</span>
                    <div className="flex-grow border-t border-[#E0E5F2]"></div>
                </div>

                <Button
                    variant="outline"
                    className="h-14 w-full border-[#E0E5F2] text-lg font-medium text-[#4361EE] hover:bg-slate-50"
                >
                    Other Ways To Login
                </Button>
            </div>
        </div>
    );
};

export default Login;
