import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { freelancerProgileApi } from "./freelancerProfileApi";
import type { AxiosError } from "axios";

export interface FreelancerProfile {
  coverPic?: string | null;
  profilePic?: string | null;
  fullName?: string;
  email?: string;
  address?: string;
  availability?: string;
  experienceLevel?: string;
  education?: string;
  hourlyRate?: string;
  skills?:string [];
  location?: string;
  reference?: string;
  bio?: string;
  createdAt?:string;
}
interface FreelancerProfileState {
  freelancer: FreelancerProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: FreelancerProfileState = {
  freelancer: null,
  loading: false,
  error: null,
};

export const updateFreelancerProfile = createAsyncThunk<
  { freelancer: FreelancerProfile },
  FreelancerProfile,
  { rejectValue: { error: string } }
>("freelancer/edit-profile", async (credentials, { rejectWithValue }) => {
  try {
    const response = await freelancerProgileApi.updateProfile(credentials);
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue({
      error: error.response?.data.message || "Freelancer profile Update failed",
    });
  }
});

export const getFreelancerProfile = createAsyncThunk<
  { freelancer: FreelancerProfile },
  void, 
  { rejectValue: { error: string } }
>("freelancer/get-profile", async (_, { rejectWithValue }) => {
  try {
    const response = await freelancerProgileApi.getProfile();
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue({
      error:
        error.response?.data.message || "Failed to fetch freelancer profile",
    });
  }
});

const freelancerProfileSlice = createSlice({
  name: "freelancer",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateFreelancerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateFreelancerProfile.fulfilled,
        (state, action: PayloadAction<{ freelancer: FreelancerProfile }>) => {
          state.loading = false;
          state.freelancer = action.payload.freelancer;
          console.log(action.payload.freelancer);
          
          state.error = null;
        }
      )
      .addCase(updateFreelancerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.error || "freelancer profile Update failed";
      })
      .addCase(getFreelancerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getFreelancerProfile.fulfilled,
        (state, action: PayloadAction<{ freelancer: FreelancerProfile }>) => {
          state.loading = false;
          state.freelancer = action.payload.freelancer;
          state.error = null;
        }
      )
      .addCase(getFreelancerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.error || "Failed to fetch freelancer profile";
      });
  },
});

export const { clearError } = freelancerProfileSlice.actions;
export default freelancerProfileSlice.reducer;
