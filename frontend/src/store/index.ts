import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import translationReducer from './slices/translationSlice';
import complianceReducer from './slices/complianceSlice';
import subscriptionReducer from './slices/subscriptionSlice';
import dashboardReducer from './slices/dashboardSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        translation: translationReducer,
        compliance: complianceReducer,
        subscription: subscriptionReducer,
        dashboard: dashboardReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 