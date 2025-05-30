import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { clientProgileApi } from "./clientProfileApi";
import type { AxiosError } from "axios";

export interface ClientProfile {
  email?: string;
  fullName?: string;
  CoverPic?: string|null;
  profilePic?: string|null;
  companyName?: string;
  location?: string;
  description?: string;
  website?: string;
}

// interface ApiResponse {
//   client: ClientProfile;
// }

interface ClientProfileState {
  client: ClientProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: ClientProfileState = {
  client: null,
  loading: false,
  error: null,
};

export const updateClientProfile = createAsyncThunk<
  { client: ClientProfile }, // Return type
  ClientProfile, // Argument type
  { rejectValue: { error: string } }
>("client/edit-profile", async (credentials, { rejectWithValue }) => {
  try {
    const response = await clientProgileApi.updateProfile(credentials);
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue({
      error: error.response?.data.message || "Client profile Update failed",
    });
  }
});

export const getClientProfile = createAsyncThunk<
  { client: ClientProfile },
  void, // No argument
  { rejectValue: { error: string } }
>("client/get-profile", async (_, { rejectWithValue }) => {
  try {
    const response = await clientProgileApi.getProfile();
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue({
      error: error.response?.data.message || "Failed to fetch client profile",
    });
  }
});

const clientProfileSlice = createSlice({
  name: "clientProfile", // Changed from "auth" to be more descriptive
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateClientProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateClientProfile.fulfilled,
        (state, action: PayloadAction<{ client: ClientProfile }>) => {
          state.loading = false;
          state.client = action.payload.client;
          state.error = null;
        }
      )
      .addCase(updateClientProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Client profile Update failed";
      })
      .addCase(getClientProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getClientProfile.fulfilled,
        (state, action: PayloadAction<{ client: ClientProfile }>) => {
          state.loading = false;
          state.client = action.payload.client;
          state.error = null;
        }
      )
      .addCase(getClientProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to fetch client profile";
      });
  },
});

export const { clearError } = clientProfileSlice.actions;
export default clientProfileSlice.reducer;
