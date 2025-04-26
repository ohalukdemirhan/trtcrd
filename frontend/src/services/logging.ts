import { env } from '../config/env';

export interface LogEntry {
    level: 'info' | 'warn' | 'error';
    message: string;
    timestamp: string;
    data?: any;
    tags?: string[];
}

class LoggingService {
    private static instance: LoggingService;
    private readonly MAX_BATCH_SIZE = 100;
    private logQueue: LogEntry[] = [];

    private constructor() {
        window.addEventListener('unload', () => this.flush());
    }

    public static getInstance(): LoggingService {
        if (!LoggingService.instance) {
            LoggingService.instance = new LoggingService();
        }
        return LoggingService.instance;
    }

    private createLogEntry(
        level: LogEntry['level'],
        message: string,
        data?: any,
        tags?: string[]
    ): LogEntry {
        return {
            level,
            message,
            timestamp: new Date().toISOString(),
            data,
            tags,
        };
    }

    private async sendLogs(logs: LogEntry[]): Promise<void> {
        if (env.NODE_ENV === 'development') {
            console.log('Logs:', logs);
            return;
        }

        try {
            await fetch(`${env.API_URL}/logs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ logs }),
            });
        } catch (error) {
            console.error('Failed to send logs:', error);
        }
    }

    private flush(): void {
        if (this.logQueue.length > 0) {
            this.sendLogs([...this.logQueue]);
            this.logQueue = [];
        }
    }

    public info(message: string, data?: any, tags?: string[]): void {
        this.queue(this.createLogEntry('info', message, data, tags));
    }

    public warn(message: string, data?: any, tags?: string[]): void {
        this.queue(this.createLogEntry('warn', message, data, tags));
    }

    public error(message: string, error?: Error, tags?: string[]): void {
        this.queue(
            this.createLogEntry('error', message, {
                error: error?.message,
                stack: error?.stack,
            }, tags)
        );
    }

    private queue(entry: LogEntry): void {
        this.logQueue.push(entry);

        if (this.logQueue.length >= this.MAX_BATCH_SIZE) {
            this.flush();
        }
    }
}

export const logger = LoggingService.getInstance(); 