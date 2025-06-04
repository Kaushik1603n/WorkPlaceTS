import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axiosClient from "../../utils/axiosClient";
import type { AxiosError } from "axios";

interface Job {
  _id: string;
  title: string;
  stack: string;
  createdAt: string;
  description: string;
  skills: string[];
  budget: number;
  proposals: string[];
}

interface FilterData {
  priceRange: [number, number];
  selectedJobTypes: string[];
  selectedSkills: string[];
  experienceLevel: string[];
  projectDuration: string[];
}

interface MarketPlaceState {
  jobs: Job[];
  loading: boolean;
  error: string | null;
}

const initialState: MarketPlaceState = {
  jobs: [],
  loading: false,
  error: null,
};

export const getAllTheJobs = createAsyncThunk<
  { data: Job[] },
  { searchQuery: string; filters: FilterData },
  {
    rejectValue: { error: string };
  }
>(
  "/jobs/get-jobs",
  async ({ searchQuery = "", filters }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();

      if (searchQuery) params.append("search", searchQuery);
      if (filters.priceRange) {
        params.append("minPrice", filters.priceRange[0].toString());
        params.append("maxPrice", filters.priceRange[1].toString());
      }
      if (filters.selectedJobTypes.length > 0) {
        params.append("jobTypes", filters.selectedJobTypes.join(","));
      }
      if (filters.selectedSkills.length > 0) {
        params.append("skills", filters.selectedSkills.join(","));
      }

      const response = await axiosClient.get(
        `/jobs/get-jobs?${params.toString()}`
      );
      return response.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue({
        error:
          error.response?.data.message || "Failed to fetch freelancer profile",
      });
    }
  }
);

const marketPlaceSlice = createSlice({
  name: "market",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllTheJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllTheJobs.fulfilled,
        (state, action: PayloadAction<{ data: Job[] }>) => {
          state.loading = false;
          state.jobs = action.payload.data;
          state.error = null;
        }
      )
      .addCase(getAllTheJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to fetch jobs";
      });
  },
});

export const { clearError } = marketPlaceSlice.actions;
export default marketPlaceSlice.reducer;
