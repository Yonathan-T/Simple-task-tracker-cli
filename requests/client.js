import axios from 'axios';
import chalk from 'chalk';
import { BASE_URL } from '../services/api.js';
import readline from 'readline';
import ora from 'ora';

export async function getAllTasks() {
  const spinner = ora(chalk.blue('Fetching tasks...')).start();

  try {
    const res = await axios.get(`${BASE_URL}/tasks`, { responseType: 'json' });
    
            if (res.data.length === 0) {
                      spinner.info(chalk.yellow('No tasks found.'));
                 return;
             } else {
                 spinner.succeed(chalk.green('✅ Tasks loaded!'));
             }


    res.data.forEach(task => {
      const statusText = task.completed
        ? chalk.green('Completed')
        : chalk.yellow('Pending');

      console.log(
        `${chalk.bold('📝 ID:')} ${chalk.bold(task.id)} ${task.title} [${statusText}]`
      );
    });

  } catch (err) {
    spinner.fail(chalk.red('😑 Error fetching tasks:', err.message));
  }
}

export async function createTask(title) {
     const spinner = ora(chalk.blue('Creating a task...')).start();
  try {
    const res = await axios.post(`${BASE_URL}/tasks`, { title });
    if(res.data){
        spinner.succeed(chalk.green('Task created!'));
    }
  } catch (err) {
    console.log(chalk.red('🤦‍♂️Error creating a task:', err.message));
  }
}
export async function completeTask(id) {
const spinner = ora(chalk.blue('Marking your task as completed')).start();
     const taskId = Number(id);
    if(isNaN(taskId)){
        console.log(chalk.red(`Please input a Number`));
        return;
    }
  try {
    const res = await axios.put(`${BASE_URL}/tasks/${ taskId }`);
    const task = res.data;
    spinner.succeed(chalk.green(' Great job! Task completed successfully.'));
console.log('\n' + chalk.yellow(strikethrough(`ID: ${task.id} —  ${task.title}`)));
    
  } catch (err) {
console.log(chalk.red('😔 Oops! Something went wrong while completing the task:'), err.message);
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
    const res = await axios.get(`${BASE_URL}/tasks/${taskId}`); 

    spinner.succeed(chalk.green('Task found.'));

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log(chalk.yellow('👀 Are you sure you want to delete this task? [Y/N]'));

    rl.question('> ', async (input) => {
      const confirmation = input.trim().toUpperCase();

      if (confirmation === 'Y') {
        const deleteSpinner = ora(chalk.blue('Deleting the task...')).start();
        try {
          await axios.delete(`${BASE_URL}/tasks/${taskId}`);
          deleteSpinner.succeed(chalk.green('✅ Task deleted successfully!'));
          console.log(`🗑 ID: ${taskId} — ${res.data.title || 'Task removed'}`);
        } catch (err) {
          deleteSpinner.fail(chalk.red('❌ Error deleting task: ') + err.message);
        }
      } else {
        console.log(chalk.blue('🛑 Deletion cancelled.'));
      }

      rl.close();
    });

  } catch (err) {
    spinner.fail(chalk.red('❌ Task not found or already deleted.'));
  }
}

function strikethrough(text) {
  return text.split('').map(char => char + '\u0336').join('');
}


