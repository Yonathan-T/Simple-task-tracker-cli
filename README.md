### ✅Task Tracker CLI

A simple command-line interface (CLI) for managing tasks, built with JavaScript and Node.js. It connects to a Laravel API hosted on Render, using a PostgreSQL database to store tasks persistently. Features include adding, listing, completing, and deleting tasks with colorful output and loading animations.

### Introduction

Task Tracker CLI allows users to manage tasks efficiently via the terminal. Built with commander for command handling, axios for API requests, chalk for colored output, and ora for loading spinners, it interacts with a simple Laravel API i made to perform CRUD operations on tasks stored in PostgreSQL.
here is the repo 👉 (https://github.com/Yonathan-T/Backend)

### Requirements

Node.js: Version 16 or higher (tested with v23.10.0).
npm: For installing dependencies.
API Access: A running Laravel API at https://simple-task-api-88g5.onrender.com/i (see the repo for setup).

### Installation

Clone the repository:

```
git clone https://github.com/Yonathan-T/Simple-task-tracker-cli
cd TaskTrackerCLI
```

### Install dependencies:

```
npm install
```

### Usage

Run commands with node tracker.js <command>:
or
node . <command>:

### List all tasks:

```
node tracker.js list
```

Output:

```
⡿ Fetching tasks...
✔ Tasks fetched!
ID: 1 Buy groceries [Pending]
```

### Create a task:

```
node tracker.js create "Buy groceries"
```

Output:

```
⡿ Creating task...
✔ Task created!
Buy groceries Added Successfully ✅
```

### Mark a task as completed:

```
node tracker.js complete 1
```

Output:

```
⡿ Completing task...
✔ Task completed!
Task ID 1 marked as completed ✅
```

### Delete a task (requires confirmation):

```
node tracker.js delete 1
```

Output:

```
Are you sure you want to delete this task? [Y/N]
> Y
⡿ Deleting task...
✔ Task deleted!
Task deleted successfully ✅
```

### Troubleshooting

No tasks found, API Erros: Ensure the Laravel API is running at (https://simple-task-api-88g5.onrender.com/)
CLI errors: Ensure dependencies (commander, axios, chalk, ora) are installed (npm install).
