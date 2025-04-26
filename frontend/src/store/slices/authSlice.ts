import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '../../types';
import { api } from '../../services/api';

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: localStorage.getItem('token'),
    isLoading: false,
    error: null,
};

export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }: { email: string; password: string }) => {
        const response = await api.login(email, password);
        localStorage.setItem('token', response.access_token);
        return response.access_token;
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async ({
        email,
        password,
        full_name,
        company_name,
    }: {
        email: string;
        password: string;
        full_name?: string;
        company_name?: string;
    }) => {
        const response = await api.register(email, password, full_name, company_name);
        return response;
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.token = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Login failed';
            })
            .addCase(register.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Registration failed';
            });
    },
});

export const { logout, setUser, clearError } = authSlice.actions;
export default authSlice.reducer; 