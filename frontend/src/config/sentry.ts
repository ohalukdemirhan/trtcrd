import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { env } from './env';

export const initSentry = () => {
    if (env.NODE_ENV === 'production') {
        Sentry.init({
            dsn: env.SENTRY_DSN,
            integrations: [
                new BrowserTracing({
                    tracingOrigins: ['localhost', /^\//],
                }) as any
            ],
            tracesSampleRate: 1.0,
            environment: env.NODE_ENV,
            release: env.APP_VERSION,
            beforeSend(event) {
                // Don't send personal information
                if (event.user) {
                    delete event.user.ip_address;
                    delete event.user.email;
                }
                return event;
            },
        });
    }
}; 