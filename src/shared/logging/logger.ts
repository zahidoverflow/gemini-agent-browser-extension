export enum LogLevel {
    DEBUG = 'debug',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error'
}

export interface LogEntry {
    timestamp: number;
    level: LogLevel;
    message: string;
    data?: any;
    stack?: string;
}

const MAX_LOGS = 100;
const STORAGE_KEY = 'extension_logs';

export class Logger {
    private static instance: Logger;

    private constructor() { }

    static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    private async getLogs(): Promise<LogEntry[]> {
        const result = await chrome.storage.local.get(STORAGE_KEY);
        return result[STORAGE_KEY] || [];
    }

    private async saveLogs(logs: LogEntry[]): Promise<void> {
        // Keep only last MAX_LOGS entries
        const trimmed = logs.slice(-MAX_LOGS);
        await chrome.storage.local.set({ [STORAGE_KEY]: trimmed });
    }

    private async addLog(level: LogLevel, message: string, data?: any): Promise<void> {
        const entry: LogEntry = {
            timestamp: Date.now(),
            level,
            message,
            data,
            stack: level === LogLevel.ERROR ? new Error().stack : undefined
        };

        const logs = await this.getLogs();
        logs.push(entry);
        await this.saveLogs(logs);

        // Also console log
        const consoleMethod = level === LogLevel.ERROR ? console.error :
            level === LogLevel.WARN ? console.warn :
                console.log;
        consoleMethod(`[${level.toUpperCase()}]`, message, data || '');
    }

    debug(message: string, data?: any): void {
        this.addLog(LogLevel.DEBUG, message, data);
    }

    info(message: string, data?: any): void {
        this.addLog(LogLevel.INFO, message, data);
    }

    warn(message: string, data?: any): void {
        this.addLog(LogLevel.WARN, message, data);
    }

    error(message: string, error?: any): void {
        this.addLog(LogLevel.ERROR, message, {
            error: error?.message || error,
            stack: error?.stack
        });
    }

    async getRecentLogs(limit: number = 100): Promise<LogEntry[]> {
        const logs = await this.getLogs();
        return logs.slice(-limit);
    }

    async clearLogs(): Promise<void> {
        await chrome.storage.local.set({ [STORAGE_KEY]: [] });
    }

    async exportLogs(): Promise<string> {
        const logs = await this.getLogs();
        return JSON.stringify(logs, null, 2);
    }
}

// Global logger instance
export const logger = Logger.getInstance();
