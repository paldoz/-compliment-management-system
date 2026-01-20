
import fs from 'fs';
import path from 'path';

const logFile = path.join(process.cwd(), 'cms-debug.log');

export const logger = {
    log: (message: string, data?: any) => {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] INFO: ${message} ${data ? JSON.stringify(data) : ''}\n`;
        try {
            fs.appendFileSync(logFile, logEntry);
        } catch (e) {
            console.error("Failed to write to log file", e);
        }
    },
    error: (message: string, error?: any) => {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] ERROR: ${message} ${error ? JSON.stringify(error, Object.getOwnPropertyNames(error)) : ''}\n`;
        try {
            fs.appendFileSync(logFile, logEntry);
        } catch (e) {
            console.error("Failed to write to log file", e);
        }
    }
};
