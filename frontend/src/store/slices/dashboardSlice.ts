import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../index';

interface DashboardStats {
  totalTranslations: number;
  complianceScore: number;
  subscriptionStatus: string;
  availableCredits: number;
  recentActivities: {
    id: string;
    type: 'translation' | 'compliance' | 'subscription';
    title: string;
    timestamp: string;
    status: 'completed' | 'in_progress' | 'failed';
  }[];
  monthlyStats: {
    month: string;
    complianceScore: number;
    translationCount: number;
  }[];
}

interface DashboardState {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: null,
  loading: false,
  error: null,
};

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/dashboard/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }
      const data = await response.json();
      return data as DashboardStats;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch dashboard stats');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = dashboardSlice.actions;

export const selectDashboardStats = (state: RootState) => state.dashboard.stats;
export const selectDashboardLoading = (state: RootState) => state.dashboard.loading;
export const selectDashboardError = (state: RootState) => state.dashboard.error;

export default dashboardSlice.reducer; 