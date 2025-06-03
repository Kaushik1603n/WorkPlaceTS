import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createProjectApi } from "./projectApi";
import type { AxiosError } from "axios";

export interface ProjectDataI {
  jobTitle: string;
  description: string;
  requiredFeatures: string;
  stack: string;
  skills: string[];
  time: string;
  budgetType: "fixed" | "hourly";
  budget: string;
  experienceLevel: "entry" | "intermediate" | "expert";
  reference: string;
}

interface ClientProjectsState {
  projects: ProjectDataI[];
  loading: boolean;
  error: string | null;
}

const initialState: ClientProjectsState = {
  projects: [],
  loading: false,
  error: null,
};

export const createNewJob = createAsyncThunk<
  { success: boolean; message: string },
  ProjectDataI,
  { rejectValue: { error: string } }
>("client/project/new-project", async (credentials, { rejectWithValue }) => {
  try {
    const response = await createProjectApi.createJob(credentials);
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue({
      error: error.response?.data.message || "Project creation failed",
    });
  }
});

export const getClientProject = createAsyncThunk<
  { projects: ProjectDataI[] },
  void,
  { rejectValue: { error: string } }
>("client/project/get-project", async (_, { rejectWithValue }) => {
  try {
    const response = await createProjectApi.getProject();
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue({
      error: error.response?.data.message || "Failed to fetch projects",
    });
  }
});

const clientProjectSlice = createSlice({
  name: "clientProject",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewJob.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createNewJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Project creation failed";
      })
      .addCase(getClientProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getClientProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload.projects;
        state.error = null;
      })
      .addCase(getClientProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to fetch projects";
      });
  },
});

export const { clearError } = clientProjectSlice.actions;
export default clientProjectSlice.reducer;