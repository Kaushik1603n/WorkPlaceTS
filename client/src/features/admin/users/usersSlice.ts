import {
  createAsyncThunk,
  createSlice,
  //   type PayloadAction,
} from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import axiosClient from "../../../utils/axiosClient";

interface userData {
  _id?: string;
  fullName?: string;
  email?: string;
  createdAt?: string;
  status?: string;
  role?: string;
}

interface UserProfileState {
  client: userData[] | [];
  freelancer: userData[] | [];
  users: userData[] | [];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  searchQuery: string;
}

const initialState: UserProfileState = {
  client: [],
  freelancer: [],
  users: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 5,
  },
  searchQuery: "",
};

export const getFreelancerData = createAsyncThunk<
  {
    freelancer: userData[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
    };
  },
  {
    page?: number;
    limit?: number;
    search?: string;
  },
  { rejectValue: { error: string } }
>(
  "admin/get-freelancer-profile",
  async ({ page, limit, search }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(
        `/admin/get-freelancer-profile?page=${page}&limit=${limit}&search=${search}`
      );

      return response.data.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue({
        error:
          error.response?.data.message || "Failed to fetch freelancer profile",
      });
    }
  }
);

export const getClientData = createAsyncThunk<
  {
    client: userData[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
    };
  },
  {
    page?: number;
    limit?: number;
    search?: string;
  },
  { rejectValue: { error: string } }
>(
  "admin/get-client-profile",
  async ({ page, limit, search }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(
        `/admin/get-client-profile?page=${page}&limit=${limit}&search=${search}`
      );

      return response.data.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue({
        error: error.response?.data.message || "Failed to fetch client profile",
      });
    }
  }
);

export const getUserData = createAsyncThunk<
  {
    users: userData[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
    };
  },
  {
    page?: number;
    limit?: number;
    search?: string;
  },
  { rejectValue: { error: string } }
>(
  "admin/get-user-profile",
  async ({ page, limit, search }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(
        `/admin/get-user-profile?page=${page}&limit=${limit}&search=${search}`
      );

      return response.data.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue({
        error: error.response?.data.message || "Failed to fetch user profile",
      });
    }
  }
);

export const actionChange = createAsyncThunk<
  { success: boolean; message: string },
  { userId: string; status: string },
  { rejectValue: { error: string } }
>(
  "admin/user-action",
  async ({ userId, status }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.put("/admin/user-action", {
        userId,
        status,
      });
      return response.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue({
        error: error.response?.data.message || "Failed to fetch client profile",
      });
    }
  }
);

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
      state.pagination = {
        ...state.pagination,
        currentPage: action.payload.pagination.currentPage,
        totalPages: action.payload.pagination.totalPages,
        totalItems: action.payload.pagination.totalItems,
      };
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
 console.log("API Response:", action.payload);
      state.pagination = {
        ...state.pagination,
        currentPage: action.payload.pagination.currentPage,
        totalPages: action.payload.pagination.totalPages,
        totalItems: action.payload.pagination.totalItems,
      };
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
      state.pagination = {
        ...state.pagination,
        currentPage: action.payload.pagination.currentPage,
        totalPages: action.payload.pagination.totalPages,
        totalItems: action.payload.pagination.totalItems,
      };
    });
    builder.addCase(getUserData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.error || "Unknown error occurred";
    });
  },
});

export const { clearError } = usersProfileDataSlice.actions;
export default usersProfileDataSlice.reducer;
