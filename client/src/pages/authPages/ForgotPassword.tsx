import { Mail } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { forgotPass } from "../../features/auth/authSlice";
import { toast } from "react-toastify";
import p2 from "../../assets/pp1.svg";
import type { AppDispatch } from "../../app/store";

export default function ForgotPassword() {
    const [email, setEmail] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    //   const { loading, error } = useSelector((state) => state.auth);

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            toast.error("Please enter a valid email address.");
            return;
        }
        setLoading(true)
        dispatch(forgotPass({ email }))
            .unwrap()
            .then(() => {
                navigate("/otp");
            })
            .catch((error) => {
                setLoading(false)
                toast.error(error);
            });
    };

    return (
        <div className="min-h-screen bg-green-50 flex items-center justify-center">
            <div className="w-full max-w-6xl flex overflow-hidden bg-white rounded-lg shadow-lg">
                <div className="w-full md:w-1/2 p-12 flex flex-col items-center justify-center">
                    <h1 className="text-4xl font-bold text-green-500 mb-16">
                        forgot Password
                    </h1>

                    <div className="w-full max-w-md">
                        <div className="relative mb-10">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                className="w-full pl-10 pr-3 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Please Enter your Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className={`w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-md font-medium transition-colors
                                disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            Send OTP
                        </button>
                    </div>
                </div>

                <div className="hidden lg:block lg:w-1/2 bg-green-100 p-12 relative">
                    <h1 className="text-3xl font-bold  text-center mb-8">WorkPlace</h1>
                    <div className="flex flex-col items-center justify-center h-full">
                        <img src={p2} alt="Workplace Image" className="max-w-full h-auto" />
                    </div>
                </div>
            </div>
        </div>
    );
}
