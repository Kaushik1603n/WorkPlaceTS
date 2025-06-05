import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axiosClient from "../../utils/axiosClient";
import type { AxiosError } from "axios";
import type { ProposalPayload, ProposalResponse } from "./proposalTypes";

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
}

interface Client {
  fullName?: string;
  email?: string;
}
interface JobDetails {
  success: boolean;
  data: {
    title?: string;
    description?: string;
    stack?: string;
    time?: string;
    reference?: string;
    requiredFeatures?: string | React.ReactNode;
    budgetType?: string;
    budget?: string | number;
    experienceLevel?: string;
    clientId?: Client;
  };
}

interface MarketPlaceState {
  jobs: Job[];
  currentJob: JobDetails["data"] | null;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage?: number;
    totalPages?: number;
    totalItems?: number;
    itemsPerPage?: number;
  };
}

const initialState: MarketPlaceState = {
  jobs: [],
  currentJob: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 5,
  },
};

export const getAllTheJobs = createAsyncThunk<
  {
    data: Job[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
    };
  },
  { searchQuery: string; page: number; limit: number; filters: FilterData },
  {
    rejectValue: { error: string };
  }
>(
  "/jobs/get-jobs",
  async (
    { searchQuery = "", page = 1, limit = 5, filters },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();

      if (searchQuery) params.append("search", searchQuery);
      params.append("page", page.toString());
      params.append("limit", limit.toString());

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
      if (filters.experienceLevel.length > 0) {
        params.append("experienceLevel", filters.experienceLevel.join(","));
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
export const getJobDetails = createAsyncThunk<
  JobDetails,
  { jobId: string | undefined },
  {
    rejectValue: { error: string };
  }
>("/jobs/job-details", async ({ jobId }, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get(`/jobs/job-details/${jobId}`);
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue({
      error:
        error.response?.data.message || "Failed to fetch freelancer profile",
    });
  }
});

export const applyJobProposal = createAsyncThunk<
  ProposalResponse,
  ProposalPayload,
  { rejectValue: { error: string } }
>("/jobs/apply-job-proposal", async (ProposalPayload, { rejectWithValue }) => {
  try {
    const response = await axiosClient.post<ProposalResponse>(
      `/jobs/apply-job-proposal`,
      ProposalPayload
    );
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue({
      error: error.response?.data.message || "Failed to submit proposal",
    });
  }
});

const marketPlaceSlice = createSlice({
  name: "market",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearJobs: (state) => {
      state.jobs = [];
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
        (
          state,
          action: PayloadAction<{
            data: Job[];
            pagination: {
              currentPage: number;
              totalPages: number;
              totalItems: number;
            };
          }>
        ) => {
          state.loading = false;
          state.jobs = action.payload.data;
          if (action.payload.pagination) {
            state.pagination = {
              ...state.pagination,
              currentPage: action.payload.pagination.currentPage,
              totalPages: action.payload.pagination.totalPages,
              totalItems: action.payload.pagination.totalItems,
            };
          }
          state.error = null;
        }
      )
      .addCase(getAllTheJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to fetch jobs";
      })

      .addCase(getJobDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getJobDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJob = action.payload.data;
      })
      .addCase(getJobDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to fetch job details";
      })

      .addCase(applyJobProposal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyJobProposal.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(applyJobProposal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to submit proposal";
      });
  },
});

export const { clearError, clearJobs } = marketPlaceSlice.actions;
export default marketPlaceSlice.reducer;
