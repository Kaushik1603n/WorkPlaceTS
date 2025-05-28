import { useState, useEffect, useRef, type KeyboardEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resendOtp, verifyEmail } from "../../features/auth/authSlice";
import { toast } from "react-toastify";
import p2 from "../../assets/pp1.svg";
import type { AppDispatch, RootState } from "../../app/store";

export default function OTPVerification() {
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [timer, setTimer] = useState<number>(60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  const [isRegisterDisabled, setIsRegisterDisabled] = useState<boolean>(false);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { userId } = useSelector((state: RootState) => state.auth);


  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
      setIsResendDisabled(false);
      setIsRegisterDisabled(true);
    }
    return () => clearInterval(interval);
  }, [timer, isTimerRunning]);

  useEffect(() => {
    const allFieldsFilled = otp.every((digit) => digit !== "");
    setIsRegisterDisabled(!allFieldsFilled);
  }, [otp]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  const handleChange = (index: number, value: string): void => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 3) {
        inputRefs[index + 1].current?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleResendOTP = (): void => {
    if (isResendDisabled) return;

    setOtp(["", "", "", ""]);
    dispatch(resendOtp({ userId: userId }))
      .unwrap()
      .then(() => {
        toast.success("OTP resent successfully");
      })
      .catch((error) => {
        toast.error(error.message);
      });

    setTimer(60);
    setIsTimerRunning(true);
    setIsResendDisabled(true);
    setIsRegisterDisabled(false);
    inputRefs[0].current?.focus();
  };

  const handleRegister = (): void => {
    if (isRegisterDisabled) return;

    const otpCode = otp.join("");

    dispatch(verifyEmail({ otp: otpCode, userId: userId }))
      .unwrap()
      .then(() => {
        toast.success("Registration successfully")
        navigate("/");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };
  return (
    <div className="min-h-screen flex flex-col items-center bg-green-50">
      <h1 className="text-3xl font-bold mt-16 mb-8">WorkPlace</h1>

      <div className="w-full max-w-5xl flex flex-col md:flex-row rounded-lg shadow-lg">
        <div className="hidden lg:block lg:w-1/2 bg-green-100 p-12 relative">
          <div className="flex flex-col items-center justify-center h-full">
            <img src={p2} alt="Workplace Image" className="max-w-full h-auto" />
          </div>
        </div>

        <div className="w-full md:w-1/2 bg-white p-4 flex flex-col justify-center items-center rounded-lg">
          <div className="text-center mb-6">
            <p className="text-gray-700">OTP has been send to your Email</p>

            <div className="text-5xl text-green-500 font-bold my-6">
              {formatTime(timer)}
            </div>

            <div className="flex justify-center gap-3 mb-8">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  type="text"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-14 h-14 bg-gray-200 rounded-full text-center text-xl font-bold"
                  maxLength={1}
                />
              ))}
            </div>

            <button
              onClick={handleResendOTP}
              disabled={isResendDisabled}
              className={`w-full py-3 rounded-lg transition mb-4 ${isResendDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600"
                }`}
            >
              {isResendDisabled
                ? `Resend available in ${timer}s`
                : "Send Again"}
            </button>

            <button
              onClick={handleRegister}
              disabled={isRegisterDisabled}
              className={`w-full py-3 rounded-lg transition ${isRegisterDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600"
                }`}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
