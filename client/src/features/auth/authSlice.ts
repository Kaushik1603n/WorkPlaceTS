import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
const apiUrl = import.meta.env.VITE_API_BASE_URL;

interface AuthState {
  user: LoginResponse["user"] | null;
  userId: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  userId: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    role: string;
    fullName: string;
  };
}
interface VerifyResponse {
  user: {
    id: string;
    email: string;
    role: string;
    fullName: string;
  };
}
interface registerResponse {
  userId: string;
  message: string;
}

interface registerCredentials {
  joinAs: string;
  fullName: string;
  email: string;
  password: string;
}

interface LogoutCredentials {
  userId: string | undefined;
}
interface LogoutResponse {
  message: string;
}

interface VerifyEmailArgs {
  otp: string;
  userId: string | null;
}

interface ResendOtpArgs {
  userId: string | null;
}

interface ForgotResponse {
  userId: string;
}
interface ChangePassArgs {
  newPassword: string;
  confirmPassword: string;
  userId: string | null;
}

// interface AuthResponse {
//   accessToken: string;
//   refreshToken?: string;
//   user?: object;
// }

export const loginUser = createAsyncThunk<
  LoginResponse, // Returned type
  LoginCredentials, // Argument type
  { rejectValue: string } // Rejected value type
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post<LoginResponse>(
      `${apiUrl}/auth/login`,
      credentials
    );

    localStorage.setItem("access_token", response.data.accessToken);
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
    const response = await axios.post<registerResponse>(
      `${apiUrl}/auth/register`,
      credentials
    );

    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(error.response?.data.message || "Login failed");
  }
});

export const verifyEmail = createAsyncThunk<
  VerifyResponse,
  VerifyEmailArgs, // argument type
  { rejectValue: string } // error type
>("auth/verify-otp", async (args, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${apiUrl}/auth/verify-otp`, args);
    localStorage.setItem("access_token", response.data.accessToken);
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
  { message: string }, // return type
  ResendOtpArgs, // argument type
  { rejectValue: string } // error type
>("auth/resend-otp", async (args, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${apiUrl}/auth/resend-otp`, args);
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
    const response = await axios.post(`${apiUrl}/auth/forgot-password`, args);
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
    const response = await axios.post(`${apiUrl}/auth/verify-reset-otp`, args);
    localStorage.setItem("access_token", response.data.accessToken);
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
    const response = await axios.post(`${apiUrl}/auth/reset-password`, args);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || "Resend failed");
  }
});

export const fetchUser = createAsyncThunk<
  LoginResponse,
  void, // No argument
  { rejectValue: string }
>("auth/user", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<LoginResponse>(`${apiUrl}/auth/user`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      withCredentials: true,
    });

    localStorage.setItem("access_token", response.data.accessToken);
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
    const response = await axios.post<LoginResponse>(
      `${apiUrl}/auth/set-role`,
      credentials,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        withCredentials: true,
      }
    );

    localStorage.setItem("access_token", response.data.accessToken);
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(error.response?.data.message || "Login failed");
  }
});

export const logoutUser = createAsyncThunk<LogoutResponse, LogoutCredentials>(
  "auth/logout",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post<LogoutResponse>(
        `${apiUrl}/auth/logout`,
        credentials,{
          withCredentials:true
        }
      );
      localStorage.removeItem("access_token");
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

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.userId = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
