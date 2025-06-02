import {
  createAsyncThunk,
  createSlice,
//   type PayloadAction,
} from "@reduxjs/toolkit";
import { userProfileApi } from "./usersApi";
import type { AxiosError } from "axios";

interface userData {
  fullName?: string;
  email?: string;
  createdAt?: string;
  status?: string;
}

interface UserProfileState {
  client: userData | null;
  freelancer: userData | null;
  users: userData | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserProfileState = {
  client: null,
  freelancer: null,
  users: null,
  loading: false,
  error: null,
};

export const getFreelancerData = createAsyncThunk<
  { freelancer: userData },
  void,
  { rejectValue: { error: string } }
>("admin/get-freelancer-profile", async (_, { rejectWithValue }) => {
  try {
    const response = await userProfileApi.getFreelancerProfile();
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue({
      error: error.response?.data.message || "Failed to fetch freelancer profile",
    });
  }
});

export const getClientData = createAsyncThunk<
  { client: userData },
  void,
  { rejectValue: { error: string } }
>("admin/get-client-profile", async (_, { rejectWithValue }) => {
  try {
    const response = await userProfileApi.getClientProfile();
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue({
      error: error.response?.data.message || "Failed to fetch client profile",
    });
  }
});

export const getUserData = createAsyncThunk<
  { users: userData },
  void,
  { rejectValue: { error: string } }
>("admin/get-user-profile", async (_, { rejectWithValue }) => {
  try {
    const response = await userProfileApi.getUserProfile();
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue({
      error: error.response?.data.message || "Failed to fetch user profile",
    });
  }
});

const usersProfileDataSlice = createSlice({
  name: "usersData",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Freelancer profile cases
    builder.addCase(getFreelancerData.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getFreelancerData.fulfilled, (state, action) => {
      state.loading = false;
      state.freelancer = action.payload.freelancer;
    });
    builder.addCase(getFreelancerData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.error || "Unknown error occurred";
    });

    // Client profile cases
    builder.addCase(getClientData.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getClientData.fulfilled, (state, action) => {
      state.loading = false;
      state.client = action.payload.client;
    });
    builder.addCase(getClientData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.error || "Unknown error occurred";
    });

    // User profile cases
    builder.addCase(getUserData.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getUserData.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload.users;
    });
    builder.addCase(getUserData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.error || "Unknown error occurred";
    });
  },
});

export const { clearError } = usersProfileDataSlice.actions;
export default usersProfileDataSlice.reducer;