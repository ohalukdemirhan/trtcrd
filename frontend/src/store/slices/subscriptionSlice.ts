import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Subscription, UsageStats } from '../../types';
import { api } from '../../services/api';

interface SubscriptionState {
    subscription: Subscription | null;
    usageStats: UsageStats | null;
    checkoutUrl: string | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: SubscriptionState = {
    subscription: null,
    usageStats: null,
    checkoutUrl: null,
    isLoading: false,
    error: null,
};

export const fetchCurrentSubscription = createAsyncThunk(
    'subscription/fetchCurrent',
    async () => {
        const response = await api.getCurrentSubscription();
        return response;
    }
);

export const fetchUsageStats = createAsyncThunk(
    'subscription/fetchUsage',
    async () => {
        const response = await api.getUsageStats();
        return response;
    }
);

export const createCheckoutSession = createAsyncThunk(
    'subscription/createCheckout',
    async ({
        tier,
        paymentProvider,
    }: {
        tier: string;
        paymentProvider: 'stripe' | 'paddle';
    }) => {
        const response = await api.createCheckoutSession(tier, paymentProvider);
        return response;
    }
);

const subscriptionSlice = createSlice({
    name: 'subscription',
    initialState,
    reducers: {
        clearCheckoutUrl: (state) => {
            state.checkoutUrl = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch current subscription
            .addCase(fetchCurrentSubscription.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCurrentSubscription.fulfilled, (state, action) => {
                state.isLoading = false;
                state.subscription = action.payload;
            })
            .addCase(fetchCurrentSubscription.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch subscription';
            })
            // Fetch usage stats
            .addCase(fetchUsageStats.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUsageStats.fulfilled, (state, action) => {
                state.isLoading = false;
                state.usageStats = action.payload;
            })
            .addCase(fetchUsageStats.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch usage stats';
            })
            // Create checkout session
            .addCase(createCheckoutSession.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.checkoutUrl = null;
            })
            .addCase(createCheckoutSession.fulfilled, (state, action) => {
                state.isLoading = false;
                state.checkoutUrl = action.payload.checkout_url;
            })
            .addCase(createCheckoutSession.rejected, (state, action) => {
                state.isLoading = false;
                state.error =
                    action.error.message || 'Failed to create checkout session';
            });
    },
});

export const { clearCheckoutUrl, clearError } = subscriptionSlice.actions;
export default subscriptionSlice.reducer; 