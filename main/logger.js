const winston = require('winston');
const path = require('path');
const { app } = require('electron');

// Get the logs directory based on the platform
function getLogsPath() {
    try {
        // Use electron's app.getPath('logs') which provides a proper location for logs
        // Windows: %USERPROFILE%\AppData\Roaming\{app name}\logs
        // macOS: ~/Library/Logs/{app name}
        // Linux: ~/.config/{app name}/logs
        return app.getPath('logs');
    } catch (error) {
        // Fallback if app is not ready yet
        const userDataPath = app.getPath('userData');
        return path.join(userDataPath, 'logs');
    }
}

// Create logger instance
function createLogger() {
    const logsPath = getLogsPath();
    
    // Define log format
    const logFormat = winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.printf(({ timestamp, level, message, stack }) => {
            if (stack) {
                return `${timestamp} [${level.toUpperCase()}]: ${message}\n${stack}`;
            }
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    );

    const logger = winston.createLogger({
        level: 'info',
        format: logFormat,
        transports: [
            // Write all logs to combined.log
            new winston.transports.File({
                filename: path.join(logsPath, 'combined.log'),
                maxsize: 5242880, // 5MB
                maxFiles: 5,
            }),
            // Write errors to error.log
            new winston.transports.File({
                filename: path.join(logsPath, 'error.log'),
                level: 'error',
                maxsize: 5242880, // 5MB
                maxFiles: 5,
            }),
            // Also log to console
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.printf(({ timestamp, level, message }) => {
                        return `${timestamp} [${level}]: ${message}`;
                    })
                )
            })
        ],
        exitOnError: false
    });

    logger.info('='.repeat(80));
    logger.info(`Logger initialized. Logs directory: ${logsPath}`);
    logger.info(`Platform: ${process.platform}`);
    logger.info(`App version: ${app.getVersion()}`);
    logger.info(`Electron version: ${process.versions.electron}`);
    logger.info(`Node version: ${process.versions.node}`);
    logger.info(`Chrome version: ${process.versions.chrome}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'production'}`);
    logger.info('='.repeat(80));

    return logger;
}

module.exports = { createLogger, getLogsPath };

