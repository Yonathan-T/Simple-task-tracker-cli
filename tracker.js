


import { Command } from 'commander';
import { getAllTasks, createTask, completeTask, deleteTask } from './requests/client.js'; 

const program = new Command();

program
  .command('list')
  .description('List all tasks')
  .action(getAllTasks); 

program
  .command('create <title>')
  .description('Create a new task')
  .action(createTask);
program
  .command('complete <id>')
  .description('mark a task as completed')
  .action(completeTask);
program
  .command('delete <id>')
  .description('Delete the task')
  .action(deleteTask);

program.parse(process.argv);

