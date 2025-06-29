#!/usr/bin/env node

import { Command } from 'commander';
import { getAllTasks, createTask, completeTask, deleteTask } from './requests/client.js'; 
import chalk from 'chalk';

const program = new Command();

program
  .name('task-tracker')
  .description(chalk.blue.bold('📋 Task Tracker CLI - A simple command-line task management tool'))
  .version('1.0.0', '-v, --version', 'Display version information')
  .option('-a, --about', 'Show detailed information about the CLI tool')
  .addHelpText('after', `
${chalk.yellow('Examples:')}
  $ task-tracker list                    # List all tasks
  $ task-tracker create "Buy groceries"  # Create a new task
  $ task-tracker complete 1              # Mark task with ID 1 as completed
  $ task-tracker delete 1                # Delete task with ID 1

${chalk.cyan('For more information, visit:')} https://github.com/Yonathan-T/Simple-task-tracker-cli
  `);

program.on('option:about', () => {
  console.log(chalk.blue.bold('\n📋 Task Tracker CLI - About\n'));
  console.log(chalk.white('A powerful and intuitive command-line task management tool designed to help you'));
  console.log(chalk.white('organize and track your daily tasks efficiently.\n'));
  
  console.log(chalk.yellow.bold('✨ Features:'));
  console.log(chalk.white('• Create and manage tasks with simple commands'));
  console.log(chalk.white('• Mark tasks as completed with visual feedback'));
  console.log(chalk.white('• Delete tasks with confirmation prompts'));
  console.log(chalk.white('• Persistent user sessions across sessions'));
  console.log(chalk.white('• Beautiful colored output and progress indicators\n'));
  
  console.log(chalk.yellow.bold('🛠 Built with:'));
  console.log(chalk.white('• Node.js and Commander.js for CLI framework'));
  console.log(chalk.white('• Axios for HTTP requests'));
  console.log(chalk.white('• Chalk for beautiful terminal output'));
  console.log(chalk.white('• UUID for unique user identification\n'));
  
  console.log(chalk.yellow.bold('📝 Usage:'));
  console.log(chalk.white('Simply run any command to get started. The tool automatically'));
  console.log(chalk.white('creates a user session for you on first use.\n'));
  
  console.log(chalk.cyan('🌐 Repository:') + chalk.white(' https://github.com/Yonathan-T/Simple-task-tracker-cli'));
  console.log(chalk.cyan('📧 Support:') + chalk.white(' Star the Repo ⭐\n'));
  
  process.exit(0);
});

program
  .command('list')
  .description('List all tasks')
  .action(async () => {
    await getAllTasks();
  }); 

program
  .command('create <title>')
  .description('Create a new task')
  .action(async (title) => {
    await createTask(title);
  });

program
  .command('complete <id>')
  .description('mark a task as completed')
  .action(async (id) => {
    await completeTask(id);
  });

program
  .command('delete <id>')
  .description('Delete the task')
  .action(async (id) => {
    await deleteTask(id);
  });

program.parse(process.argv);