import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';
import { BASE_URL } from '../services/api.js';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

const CONFIG_FILE = path.join(process.env.HOME || process.env.USERPROFILE, '.task-tracker-cli-config.json');



async function getUserId() {
    let config = {};
    try {
        if (fs.existsSync(CONFIG_FILE)) {
            config = JSON.parse(fs.readFileSync(CONFIG_FILE));
            const userId = config.userId;
            if (userId) {
                // Try to register the user (this will succeed if they already exist)
                await registerUser(userId);
                return userId;
            }
        }
    } catch (err) {
        console.error(chalk.red('Error reading config file:', err.message));
    }
    
    const userId = uuidv4();
    fs.writeFileSync(CONFIG_FILE, JSON.stringify({ userId }));
    
    // Register the new user
    await registerUser(userId);
    return userId;
}

const userId = await getUserId();

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: { 'X-User-ID': userId }
});

async function registerUser(userId) {
    try {
        const res = await axios.post(`${BASE_URL}/register`, {}, {
            headers: { 'X-User-ID': userId }
        });
        
        if (res.status === 201) {
            const spinner = ora(chalk.blue('Registering user...')).start();
            spinner.succeed(chalk.green('User registered successfully!'));
        }
        return true;
    } catch (err) {
        const spinner = ora(chalk.blue('Registering user...')).start();
        spinner.fail(chalk.red('Failed to register user'));
        console.log(chalk.red('Error registering user:', err.response?.data?.error || err.message));
        return false;
    }
}
export async function getAllTasks() {
    const spinner = ora(chalk.blue('Fetching tasks...')).start();
    try {
        const res = await axiosInstance.get('/tasks');
        if (res.data.length === 0) {
            spinner.succeed(chalk.green('Tasks fetched!'));
            console.log(chalk.yellow('No tasks found.'));
        } else {
            spinner.succeed(chalk.green('Tasks fetched!'));
            res.data.forEach(task => {
                const status = task.completed ? chalk.green('Completed') : chalk.yellow('Pending');
                console.log(`${chalk.bold(`ID: ${task.id}`)} ${task.title} [${status}]`);
            });
        }
    } catch (err) {
        spinner.fail(chalk.red('Failed to fetch tasks'));
        console.log(chalk.red('😑 Error fetching tasks:', err.response?.data?.error || err.message));
    }
}

export async function createTask(title) {
    const spinner = ora(chalk.blue('Creating task...')).start();
    try {
        const res = await axiosInstance.post('/task', { title });
        spinner.succeed(chalk.green('Task created!'));
        console.log(chalk.yellow(`${title} Added Successfully ✅`));
    } catch (err) {
        spinner.fail(chalk.red('Failed to create task'));
        console.log(chalk.red('🤦‍♂️ Error creating task:', err.response?.data?.error || err.message));
    }
}

export async function completeTask(id) {
    const taskId = Number(id);
    if (isNaN(taskId)) {
        console.log(chalk.red('Please input a number'));
        return;
    }
    const spinner = ora(chalk.blue('Completing task...')).start();
    try {
    const getRes = await axiosInstance.get(`/task/${taskId}`);
          if (getRes.data.completed) {
            spinner.fail(chalk.blue('Task is already completed'));
            return;
          }
    const res = await axiosInstance.put(`/task/${taskId}`, { completed: true });
    spinner.succeed(chalk.bgGreen(strikeThrough(`Task ID ${taskId} ${res.data.title}`)));
    spinner.succeed(chalk.green('Task marked as completed!'));

        } catch (err) {
        spinner.fail(chalk.red('Failed to complete task'));
        console.log(chalk.red('😔 Oops! Something went wrong:', err.response?.data?.error || err.message));
    }
}

export async function deleteTask(id) {
    const taskId = Number(id);
    if (isNaN(taskId)) {
        console.log(chalk.red('❌ Please enter a valid numeric ID.'));
        return;
    }

    const spinner = ora(chalk.blue('Checking task...')).start();

    try {
        const res = await axiosInstance.get(`/task/${taskId}`);
        spinner.succeed(chalk.green('Task found.'));

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        console.log(chalk.yellow(`👀 Are you sure you want to delete task: ${res.data.title} (ID: ${taskId})? [Y/N]`));

        rl.question('> ', async (input) => {
            const confirmation = input.trim().toUpperCase();

            if (confirmation === 'Y') {
                const deleteSpinner = ora(chalk.blue('Deleting task...')).start();
                try {
                    await axiosInstance.delete(`/task/${taskId}`);
                    deleteSpinner.succeed(chalk.green('✅ Task deleted successfully!'));
                    console.log(chalk.bgRed(`🗑 -> ID: ${taskId} — ${res.data.title}`));
                } catch (err) {
                    deleteSpinner.fail(chalk.red(`❌ Error deleting task: ${err.response?.data?.error || err.message}`));
                }
            } else {
                console.log(chalk.blue('🛑 Deletion cancelled.'));
            }

            rl.close();
        });
    } catch (err) {
        spinner.fail(chalk.red(`❌ Error: ${err.response?.data?.error || 'Task not found or already deleted'}`));
    }
}

function strikeThrough(text) {
  return text
    .split('')
    .map(char => char + '\u0336')
    .join('')
}