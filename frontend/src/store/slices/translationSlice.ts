import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Translation, TranslationResponse } from '../../types';
import { api } from '../../services/api';

interface TranslationState {
    translations: Translation[];
    currentTranslation: TranslationResponse | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: TranslationState = {
    translations: [],
    currentTranslation: null,
    isLoading: false,
    error: null,
};

export const createTranslation = createAsyncThunk(
    'translation/create',
    async ({
        sourceText,
        sourceLang,
        targetLang,
        context,
    }: {
        sourceText: string;
        sourceLang: string;
        targetLang: string;
        context?: Record<string, any>;
    }) => {
        const response = await api.createTranslation(
            sourceText,
            sourceLang,
            targetLang,
            context
        );
        return response;
    }
);

export const fetchTranslation = createAsyncThunk(
    'translation/fetch',
    async (id: number) => {
        const response = await api.getTranslation(id);
        return response;
    }
);

export const fetchTranslations = createAsyncThunk(
    'translation/fetchAll',
    async ({ skip, limit }: { skip?: number; limit?: number } = {}) => {
        const response = await api.listTranslations(skip, limit);
        return response;
    }
);

const translationSlice = createSlice({
    name: 'translation',
    initialState,
    reducers: {
        clearCurrentTranslation: (state) => {
            state.currentTranslation = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Create translation
            .addCase(createTranslation.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createTranslation.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentTranslation = action.payload;
                // Extract the translation from the response
                const translationData = action.payload.translation || action.payload;
                if (translationData) {
                    state.translations.unshift(translationData);
                }
            })
            .addCase(createTranslation.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Translation failed';
            })
            // Fetch single translation
            .addCase(fetchTranslation.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchTranslation.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentTranslation = action.payload;
            })
            .addCase(fetchTranslation.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch translation';
            })
            // Fetch all translations
            .addCase(fetchTranslations.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchTranslations.fulfilled, (state, action) => {
                state.isLoading = false;
                state.translations = action.payload;
            })
            .addCase(fetchTranslations.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch translations';
            });
    },
});

export const { clearCurrentTranslation, clearError } = translationSlice.actions;
export default translationSlice.reducer; 