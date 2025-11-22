#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const os = require('os');
const { spawn } = require('child_process');

// Get logs path based on platform
function getLogsPath() {
    const appName = 'posx-pk';
    
    switch (process.platform) {
        case 'win32':
            return path.join(os.homedir(), 'AppData', 'Roaming', appName, 'logs');
        case 'darwin':
            return path.join(os.homedir(), 'Library', 'Logs', appName);
        default: // Linux and others
            return path.join(os.homedir(), '.config', appName, 'logs');
    }
}

const logsPath = getLogsPath();

console.log('====================================');
console.log('POS Application Logs');
console.log('====================================');
console.log(`Logs directory: ${logsPath}`);
console.log('');

// Check if logs directory exists
if (!fs.existsSync(logsPath)) {
    console.log('⚠️  Logs directory does not exist yet.');
    console.log('   The directory will be created when you run the application for the first time.');
    console.log('');
    process.exit(0);
}

// List log files
const logFiles = fs.readdirSync(logsPath).filter(f => f.endsWith('.log'));

if (logFiles.length === 0) {
    console.log('⚠️  No log files found.');
    console.log('   Log files will be created when you run the application.');
    console.log('');
    process.exit(0);
}

console.log('Available log files:');
logFiles.forEach((file, index) => {
    const filePath = path.join(logsPath, file);
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    console.log(`  ${index + 1}. ${file} (${sizeKB} KB)`);
});
console.log('');

// Open logs directory
console.log('Opening logs directory...');
console.log('');

if (process.platform === 'win32') {
    spawn('explorer', [logsPath], { shell: true });
} else if (process.platform === 'darwin') {
    spawn('open', [logsPath]);
} else {
    spawn('xdg-open', [logsPath]);
}

// Show recent errors if error.log exists
const errorLogPath = path.join(logsPath, 'error.log');
if (fs.existsSync(errorLogPath)) {
    console.log('Recent errors from error.log:');
    console.log('-----------------------------------');
    
    try {
        const errorContent = fs.readFileSync(errorLogPath, 'utf-8');
        const lines = errorContent.split('\n').filter(line => line.trim());
        const recentErrors = lines.slice(-20); // Last 20 lines
        
        if (recentErrors.length === 0) {
            console.log('✅ No errors logged');
        } else {
            recentErrors.forEach(line => console.log(line));
        }
    } catch (err) {
        console.log(`Error reading error.log: ${err.message}`);
    }
    console.log('');
}

