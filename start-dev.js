#!/usr/bin/env node
// start-dev.js - Kill port 5173 and start Vite (ES Module version)
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Function to kill process on port
const killPortProcess = async (port) => {
  try {
    console.log(`🔍 Checking for processes on port ${port}...`);
    
    // For macOS/Linux
    if (process.platform !== 'win32') {
      try {
        const { stdout } = await execAsync(`lsof -ti:${port}`);
        if (stdout.trim()) {
          const pids = stdout.trim().split('\n');
          for (const pid of pids) {
            console.log(`💀 Killing process ${pid} on port ${port}...`);
            await execAsync(`kill -9 ${pid}`);
          }
          console.log(`✅ Successfully killed processes on port ${port}`);
          // Wait a moment for the port to be freed
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        // No process found on port, which is good
        console.log(`✅ Port ${port} is available`);
      }
    } else {
      // For Windows
      try {
        const { stdout } = await execAsync(`netstat -ano | findstr :${port}`);
        if (stdout.trim()) {
          const lines = stdout.trim().split('\n');
          for (const line of lines) {
            const match = line.match(/\s+(\d+)$/);
            if (match) {
              const pid = match[1];
              console.log(`💀 Killing process ${pid} on port ${port}...`);
              await execAsync(`taskkill /PID ${pid} /F`);
            }
          }
          console.log(`✅ Successfully killed processes on port ${port}`);
          // Wait a moment for the port to be freed
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        // No process found on port, which is good
        console.log(`✅ Port ${port} is available`);
      }
    }
  } catch (error) {
    console.log(`ℹ️  No process found on port ${port} or unable to kill: ${error.message}`);
  }
};

const startDev = async () => {
  try {
    // Kill any process on port 5173
    await killPortProcess(5173);
    
    console.log('🚀 Starting Vite dev server...\n');
    
    // Start Vite with forced port
    const viteProcess = exec('npx vite --port 5173 --host', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
        return;
      }
    });
    
    // Pipe output to console
    viteProcess.stdout.pipe(process.stdout);
    viteProcess.stderr.pipe(process.stderr);
    
    // Handle process termination
    process.on('SIGINT', () => {
      console.log('\n👋 Shutting down dev server...');
      viteProcess.kill('SIGINT');
      process.exit(0);
    });
    
    process.on('SIGTERM', () => {
      console.log('\n👋 Shutting down dev server...');
      viteProcess.kill('SIGTERM');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Failed to start dev server:', error.message);
    process.exit(1);
  }
};

startDev();