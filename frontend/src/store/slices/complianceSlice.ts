import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ComplianceTemplate, ComplianceCheckResult } from '../../types';
import { api } from '../../services/api';

interface ComplianceState {
    templates: ComplianceTemplate[];
    currentTemplate: ComplianceTemplate | null;
    checkResult: ComplianceCheckResult | null;
    gdprTemplate: ComplianceTemplate | null;
    kvkkTemplate: ComplianceTemplate | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: ComplianceState = {
    templates: [],
    currentTemplate: null,
    checkResult: null,
    gdprTemplate: null,
    kvkkTemplate: null,
    isLoading: false,
    error: null,
};

export const fetchTemplates = createAsyncThunk(
    'compliance/fetchTemplates',
    async () => {
        const response = await api.listComplianceTemplates();
        return response;
    }
);

export const fetchTemplate = createAsyncThunk(
    'compliance/fetchTemplate',
    async (id: number) => {
        const response = await api.getComplianceTemplate(id);
        return response;
    }
);

export const checkCompliance = createAsyncThunk(
    'compliance/check',
    async ({ text, templateId }: { text: string; templateId: number }) => {
        const response = await api.checkCompliance(text, templateId);
        return response;
    }
);

export const fetchGdprTemplate = createAsyncThunk(
    'compliance/fetchGdpr',
    async () => {
        const response = await api.getGdprTemplate();
        return response;
    }
);

export const fetchKvkkTemplate = createAsyncThunk(
    'compliance/fetchKvkk',
    async () => {
        const response = await api.getKvkkTemplate();
        return response;
    }
);

const complianceSlice = createSlice({
    name: 'compliance',
    initialState,
    reducers: {
        clearCheckResult: (state) => {
            state.checkResult = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch templates
            .addCase(fetchTemplates.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchTemplates.fulfilled, (state, action) => {
                state.isLoading = false;
                state.templates = action.payload;
            })
            .addCase(fetchTemplates.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch templates';
            })
            // Fetch single template
            .addCase(fetchTemplate.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchTemplate.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentTemplate = action.payload;
            })
            .addCase(fetchTemplate.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch template';
            })
            // Check compliance
            .addCase(checkCompliance.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(checkCompliance.fulfilled, (state, action) => {
                state.isLoading = false;
                state.checkResult = action.payload;
            })
            .addCase(checkCompliance.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Compliance check failed';
            })
            // Fetch GDPR template
            .addCase(fetchGdprTemplate.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchGdprTemplate.fulfilled, (state, action) => {
                state.isLoading = false;
                state.gdprTemplate = action.payload;
            })
            .addCase(fetchGdprTemplate.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch GDPR template';
            })
            // Fetch KVKK template
            .addCase(fetchKvkkTemplate.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchKvkkTemplate.fulfilled, (state, action) => {
                state.isLoading = false;
                state.kvkkTemplate = action.payload;
            })
            .addCase(fetchKvkkTemplate.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch KVKK template';
            });
    },
});

export const { clearCheckResult, clearError } = complianceSlice.actions;
export default complianceSlice.reducer; 