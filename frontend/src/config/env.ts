interface EnvConfig {
    API_URL: string;
    NODE_ENV: string;
    APP_VERSION: string;
    STRIPE_PUBLIC_KEY: string;
    PADDLE_VENDOR_ID: string;
    SENTRY_DSN: string;
}

const getEnvVar = (key: keyof EnvConfig): string => {
    const value = process.env[`REACT_APP_${key}`];
    if (!value && process.env.NODE_ENV === 'production') {
        throw new Error(`Missing environment variable: REACT_APP_${key}`);
    }
    return value || '';
};

export const env: EnvConfig = {
    API_URL: getEnvVar('API_URL'),
    NODE_ENV: process.env.NODE_ENV || 'development',
    APP_VERSION: process.env.REACT_APP_VERSION || '1.0.0',
    STRIPE_PUBLIC_KEY: getEnvVar('STRIPE_PUBLIC_KEY'),
    PADDLE_VENDOR_ID: getEnvVar('PADDLE_VENDOR_ID'),
    SENTRY_DSN: getEnvVar('SENTRY_DSN'),
}; 