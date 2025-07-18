import { useState, type FormEvent } from "react";
import { Mail, Lock } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../features/auth/authSlice";
import { Link, useNavigate, } from "react-router-dom";
import p2 from "../../assets/pp1.svg";
import { toast } from "react-toastify";
import type { AppDispatch, RootState } from "../../app/store";




const apiUrl = import.meta.env.VITE_API_BASE_URL;

export default function LoginPage() {
    const [activeTab, setActiveTab] = useState<string>("login");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isDisabled, setIsDisabled] = useState<boolean>(false);

    const params = new URLSearchParams(window.location.search);
    if (params.get('blocked') === 'true') {
        const message = params.get('message');
        if (message) {
            toast.error(message);
        }

        const cleanUrl = window.location.pathname;
        window.history.replaceState(null, '', cleanUrl);
    }
    if (params.get('unauth') === 'true') {
        const message = params.get('message');
        if (message) {
            toast.error(message);
        }

        const cleanUrl = window.location.pathname;
        window.history.replaceState(null, '', cleanUrl);
    }

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { loading } = useSelector((state: RootState) => state.auth);

    const handleLogin = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error("Email and password are required.");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }



        dispatch(loginUser({ email, password }))
            .unwrap()
            .then((res) => {
                toast.success("Login successful");
                if (res.user.role === "admin") {
                    navigate("/admin-dashboard");
                } else {
                    navigate("/home");
                }
            })
            .catch((error) => {
                toast.error(error || "Login failed");
            });
    };
    const handleGoogleLogin = (): void => {
        setIsDisabled(true)
        try {
            const googleLoginUrl: string = `${apiUrl}/auth/google`;
            window.location.href = googleLoginUrl;

        } catch (error) {
            console.error("error login with google", error);
        } finally {
            //   setLoad(false);
        }
    };


    return (
        <div className="min-h-screen bg-green-50 flex items-center justify-center">
            <div className="w-full max-w-6xl mx-auto flex rounded-lg overflow-hidden shadow-lg">
                <div className="w-full lg:w-1/2 bg-white p-12">
                    <div className="flex mb-8 border-b">
                        <div className="flex-1">
                            <Link
                                to="/login"
                                className={`block pb-3 text-center font-medium text-lg ${activeTab === "login"
                                    ? "text-green-500 border-b-2 border-green-500"
                                    : "text-gray-500"
                                    }`}
                                onClick={() => {
                                    setActiveTab("login");
                                }}
                            >
                                LOGIN
                            </Link>
                        </div>

                        <div className="flex-1">
                            <Link
                                to="/register"
                                className={`block pb-3 text-center font-medium text-lg ${activeTab === "signup"
                                    ? "text-green-500 border-b-2 border-green-500"
                                    : "text-gray-500"
                                    }`}
                                onClick={() => {
                                    setActiveTab("signup");
                                }}
                            >
                                SIGN UP
                            </Link>
                        </div>
                    </div>

                    <form onSubmit={handleLogin}>
                        <div className="mb-6">
                            <label htmlFor="email" className="block text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Please Enter your Email"
                                    value={email}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="block text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    id="password"
                                    className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Please Enter your Password"
                                    value={password}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="mb-6 text-right">
                            <Link
                                to="/forgot-pass"
                                className="text-green-500 hover:text-green-600"
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isDisabled}
                            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-md font-medium mb-4 transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>

                        <button
                            onClick={handleGoogleLogin}
                            disabled={isDisabled}
                            type="button"
                            className={`w-full flex items-center justify-center 
                            bg-green-500 text-white py-3 rounded-md font-medium 
                            transition duration-200 
                            hover:bg-green-600 
                            disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            <svg
                                className="h-5 w-5 mr-2"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" />
                            </svg>
                            Sign up with Google
                        </button>

                    </form>
                </div>

                <div className="hidden lg:block lg:w-1/2 bg-green-100 p-12 relative">
                    <h1 className="text-3xl font-bold text-center mb-8">
                        WorkPlace
                    </h1>
                    <div className="flex flex-col items-center justify-center h-full">
                        <img
                            src={p2}
                            alt="Workplace Image"
                            className="max-w-full h-auto"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}