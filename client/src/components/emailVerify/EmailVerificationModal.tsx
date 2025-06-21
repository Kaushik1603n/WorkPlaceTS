import { useState, useEffect, useRef } from "react";

interface EmailVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (email:string,otp: string) => void;
    onOtpVerify: (email: string) => void;
    onResendOtp?: (email: string) => void;
}

export const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
    isOpen,
    onClose,
    onOtpVerify,
    onSubmit,
    onResendOtp,
}) => {
    const [step, setStep] = useState<'email' | 'otp'>('email');
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [errors, setErrors] = useState<{
        email?: string;
        otp?: string;
    }>({});
    const [isResending, setIsResending] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateEmailForm = () => {
        const newErrors: typeof errors = {};

        if (!email.trim()) {
            newErrors.email = "Email address is required";
        } else if (!validateEmail(email)) {
            newErrors.email = "Please enter a valid email address";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateOtpForm = () => {
        const newErrors: typeof errors = {};
        const otpString = otp.join("");

        if (otpString.length !== 4) {
            newErrors.otp = "Please enter the complete 4-digit code";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateEmailForm()) {
            onOtpVerify(email); // Call the email verification function
            setStep('otp');
            setResendTimer(60);
        }
    };

    const handleOtpSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateOtpForm()) {
            onSubmit(email,otp.join(""));
            handleClose();
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        if (value && index < 3) {
            otpRefs.current[index + 1]?.focus();
        }

        if (errors.otp) {
            setErrors({ ...errors, otp: undefined });
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');

        if (pastedData.length === 4) {
            const newOtp = pastedData.split('');
            setOtp(newOtp);
            otpRefs.current[3]?.focus();
        }
    };

    const handleResendOtp = async () => {
        if (resendTimer > 0 || isResending) return;

        setIsResending(true);
        try {
            if (onResendOtp) {
                await onResendOtp(email);
            }
            setResendTimer(60);
            setOtp(["", "", "", ""]);
            otpRefs.current[0]?.focus();
        } catch (error) {
            console.log(error);
        } finally {
            setIsResending(false);
        }
    };

    const handleClose = () => {
        setStep('email');
        setEmail("");
        setOtp(["", "", "", ""]);
        setErrors({});
        setResendTimer(0);
        setIsResending(false);
        onClose();
    };

    const handleBackToEmail = () => {
        setStep('email');
        setOtp(["", "", "", ""]);
        setErrors({});
        setResendTimer(0);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto border border-[#2ECC71] bg-[#EFFFF6]">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        {step === 'otp' && (
                            <button
                                onClick={handleBackToEmail}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                        )}
                        <h2 className="text-xl font-semibold text-gray-800">
                            {step === 'email' ? 'Verify Email Address' : 'Enter Verification Code'}
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Email Step */}
                {step === 'email' && (
                    <form onSubmit={handleEmailSubmit} className="p-6">
                        <div className="mb-6">
                            <p className="text-sm text-gray-600 mb-4">
                                Enter your email address to receive a verification code.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`bg-white w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent ${errors.email ? "border-red-500" : "border-[#2ECC71]"
                                        }`}
                                    placeholder="Enter your email address"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex space-x-3 mt-6">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="bg-white flex-1 px-4 py-2 border border-[#2ECC71] text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-2 bg-[#2ECC71] text-white rounded-md hover:bg-[#27AE60] transition-colors font-medium"
                            >
                                Send Code
                            </button>
                        </div>
                    </form>
                )}

                {/* OTP Step */}
                {step === 'otp' && (
                    <form onSubmit={handleOtpSubmit} className="p-6">
                        <div className="mb-6">
                            <p className="text-sm text-gray-600 mb-2">
                                We've sent a 4-digit verification code to:
                            </p>
                            <p className="text-sm font-medium text-gray-800 mb-4">{email}</p>
                            <p className="text-xs text-gray-500">
                                Enter the code below to verify your email address.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Verification Code *
                                </label>
                                <div className="flex space-x-2 justify-center">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={(el) => {(otpRefs.current[index] = el)}}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                            onPaste={handleOtpPaste}
                                            className={`w-12 h-12 text-center text-lg font-semibold bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent ${errors.otp ? "border-red-500" : "border-[#2ECC71]"
                                                }`}
                                        />
                                    ))}
                                </div>
                                {errors.otp && (
                                    <p className="mt-2 text-sm text-red-600 text-center">{errors.otp}</p>
                                )}
                            </div>

                            {/* Resend Code */}
                            <div className="text-center">
                                <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={resendTimer > 0 || isResending}
                                    className={`text-sm font-medium ${resendTimer > 0 || isResending
                                        ? "text-gray-400 cursor-not-allowed"
                                        : "text-[#2ECC71] hover:text-[#27AE60] cursor-pointer"
                                        }`}
                                >
                                    {isResending
                                        ? "Sending..."
                                        : resendTimer > 0
                                            ? `Resend code in ${resendTimer}s`
                                            : "Resend code"
                                    }
                                </button>
                            </div>
                        </div>

                        <div className="flex space-x-3 mt-6">
                            <button
                                type="button"
                                onClick={handleBackToEmail}
                                className="bg-white flex-1 px-4 py-2 border border-[#2ECC71] text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-2 bg-[#2ECC71] text-white rounded-md hover:bg-[#27AE60] transition-colors font-medium"
                            >
                                Verify Email
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};