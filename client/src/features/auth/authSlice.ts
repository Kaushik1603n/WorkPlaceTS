import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { authApi } from "./authApi";
import axios, { AxiosError } from "axios";
const apiUrl = import.meta.env.VITE_API_BASE_URL;

export interface AuthState {
  user: LoginResponse["user"] | null;
  userId: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  createdAt?: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  userId: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  createdAt: null,
};

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    role: string;
    fullName: string;
    isVerification?: string;
    createdAt?: string;
  };
}
export interface VerifyResponse {
  user: {
    id: string;
    email: string;
    role: string;
    fullName: string;
    createdAt?: string;
  };
  accessToken: string;
}
export interface registerResponse {
  userId: string;
  message: string;
}

export interface registerCredentials {
  joinAs: string;
  fullName: string;
  email: string;
  password: string;
}

export interface LogoutCredentials {
  userId: string | undefined;
}
export interface LogoutResponse {
  message: string;
}

export interface VerifyEmailArgs {
  otp: string;
  userId: string | null;
}

export interface ResendOtpArgs {
  userId: string | null;
}

export interface ForgotResponse {
  userId: string;
}
export interface ChangePassArgs {
  newPassword: string;
  confirmPassword: string;
  userId: string | null;
}
interface changePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
interface ChangePassResponse {
  success: boolean;
  message: string;
}

interface changeEmailData {
  email: string;
}
interface ChangeEmailResponse {
  success: boolean;
  message: string;
}

interface changeEmailOtpData {
  email: string;
  otp: string;
}
interface ChangeEmailOtpResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    email: string;
    role: string;
    fullName: string;
    createdAt?: string;
  };
}

// export interface AuthResponse {
//   accessToken: string;
//   refreshToken?: string;
//   user?: object;
// }

export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginCredentials,
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await authApi.login(credentials);

    localStorage.setItem("accessToken", response.data.accessToken);
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(error.response?.data.message || "Login failed");
  }
});

export const registerUser = createAsyncThunk<
  registerResponse,
  registerCredentials,
  { rejectValue: string }
>("auth/register", async (credentials, { rejectWithValue }) => {
  try {
    const response = await authApi.register(credentials);

    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(error.response?.data.message || "Login failed");
  }
});

export const verifyEmail = createAsyncThunk<
  VerifyResponse,
  VerifyEmailArgs,
  { rejectValue: string }
>("auth/verify-otp", async (args, { rejectWithValue }) => {
  try {
    const response = await authApi.verifyEmail(args);
    localStorage.setItem("accessToken", response.data.accessToken);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(
      err.response?.data?.message || "Verification failed"
    );
  }
});

// resendOtp thunk
export const resendOtp = createAsyncThunk<
  { message: string },
  ResendOtpArgs,
  { rejectValue: string }
>("auth/resend-otp", async (args, { rejectWithValue }) => {
  try {
    const response = await authApi.reSentOtp(args);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || "Resend failed");
  }
});

export const forgotPass = createAsyncThunk<
  ForgotResponse,
  { email: string },
  { rejectValue: string }
>("auth/forgot-password", async (args, { rejectWithValue }) => {
  try {
    const response = await authApi.forgotPassword(args);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || "Resend failed");
  }
});

export const passOtp = createAsyncThunk<
  { userId: string },
  VerifyEmailArgs,
  { rejectValue: string }
>("auth/verify-reset-otp", async (args, { rejectWithValue }) => {
  try {
    const response = await authApi.passOtp(args);
    // localStorage.setItem("accessToken", response.data.accessToken);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(
      err.response?.data?.message || "Verification failed"
    );
  }
});

export const resetPassword = createAsyncThunk<
  { email: string },
  ChangePassArgs,
  { rejectValue: string }
>("auth/reset-password", async (args, { rejectWithValue }) => {
  try {
    const response = await authApi.resetPassword(args);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || "Resend failed");
  }
});

export const fetchUser = createAsyncThunk<
  LoginResponse,
  void,
  { rejectValue: string }
>("auth/user", async (_, { rejectWithValue }) => {
  try {
    const response = await authApi.fetchUser();

    localStorage.setItem("accessToken", response.data.accessToken);
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(error.response?.data.message || "Login failed");
  }
});
export const getUserDetails = createAsyncThunk<
  LoginResponse,
  void,
  { rejectValue: string }
>("auth/get-user-details", async (_, { rejectWithValue }) => {
  try {
    const response = await authApi.getUserDetails();
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(error.response?.data.message || "Login failed");
  }
});

export const roleUpdate = createAsyncThunk<
  LoginResponse,
  { role: string },
  { rejectValue: string }
>("auth/set-role", async (credentials, { rejectWithValue }) => {
  try {
    const response = await authApi.roleUpdate(credentials);
    
    localStorage.setItem("accessToken", response.data.accessToken);
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(error.response?.data.message || "Login failed");
  }
});

export const changePass = createAsyncThunk<
  ChangePassResponse,
  changePasswordData,
  { rejectValue: string }
>("auth/changePass", async (credentials, { rejectWithValue }) => {
  try {
    const response = await authApi.changepass(credentials);
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error.response?.data.message || "Password change failed"
    );
  }
});
export const changeEmail = createAsyncThunk<
  ChangeEmailResponse,
  changeEmailData,
  { rejectValue: string }
>("auth/change-email", async (credentials, { rejectWithValue }) => {
  try {
    const response = await authApi.changeEmail(credentials);
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error.response?.data.message || "Email change failed"
    );
  }
});
export const changeEmailOtp = createAsyncThunk<
  ChangeEmailOtpResponse,
  changeEmailOtpData,
  { rejectValue: string }
>("auth/change-email/otp", async (credentials, { rejectWithValue }) => {
  try {
    const response = await authApi.changeEmailOtp(credentials);
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error.response?.data.message || "Email change otp failed"
    );
  }
});

export const logoutUser = createAsyncThunk<LogoutResponse, LogoutCredentials>(
  "auth/logout",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post<LogoutResponse>(
        `${apiUrl}/auth/logout`,
        credentials,
        {
          withCredentials: true,
        }
      );
      localStorage.removeItem("accessToken");
      return response.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetAuthState: (state) => {
      state.user = null;
      state.userId = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.createdAt = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<registerResponse>) => {
          state.loading = false;
          state.userId = action.payload.userId;
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      // Verify Email
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        verifyEmail.fulfilled,
        (state, action: PayloadAction<VerifyResponse>) => {
          state.loading = false;
          state.isAuthenticated = true;
          state.user = action.payload.user ?? null;
        }
      )
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      // forgotPass
      .addCase(forgotPass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        forgotPass.fulfilled,
        (state, action: PayloadAction<ForgotResponse>) => {
          state.loading = false;
          state.userId = action.payload.userId ?? null;
        }
      )
      .addCase(forgotPass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      .addCase(passOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(passOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.userId = action.payload.userId;
      })
      .addCase(passOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUser.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.loading = false;
          state.user = action.payload.user;
          if (action.payload.user.role) {
            state.isAuthenticated = true;
          }
        }
      )
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      .addCase(getUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getUserDetails.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.loading = false;
          state.user = action.payload.user;
        }
      )
      .addCase(getUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      .addCase(roleUpdate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        roleUpdate.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }
      )
      .addCase(roleUpdate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(changePass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePass.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      .addCase(changeEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeEmail.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changeEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      .addCase(changeEmailOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeEmailOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(changeEmailOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.userId = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, resetAuthState } = authSlice.actions;
export default authSlice.reducer;
