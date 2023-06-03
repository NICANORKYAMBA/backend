const readline = require('readline');
const { registerUser, loginUser, createTask, getTasks, updateTask, deleteTask, logoutUser, registerUserWithGoogle, loginUserWithGoogle } = require('./src/utils/my_api');


// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});


// Display menu
const displayMenu = () => {

    console.log('=== TODO LIST MANAGER ===');
    console.log('1. Register User normally');
    console.log('2. Login User normally');
    console.log('3. Register User with Google');
    console.log('4. Login User with Google');
    console.log('5. Create Task');
    console.log('6. List Tasks');
    console.log('7. Update Task');
    console.log('8. Delete Task');
    console.log('9. Logout');
    console.log('10. Exit');
    console.log('=========================');
};

// Get user input
const getUserInput = async (question) => {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
};


// Handle user registration
const handleRegisterUser = async () => {
    console.log('====User Registration====');
    const username = await getUserInput('Enter Username: ');
    const email = await getUserInput('Enter Email: ');
    const password = await getUserInput('Enter Password: ');

    try {
        await registerUser(username, email, password);
        //console.log('User registered successfully');
    } catch (err) {
        console.error('Failed to register user', err.message);
    }
    showMainMenu();
};


// Handle user login
const handleLoginUser = async () => {
    console.log('====User Login====');
    const email = await getUserInput('Enter your Email: ');
    const password = await getUserInput('Enter Password: ');

    try {
        const token = await loginUser(email, password);
        console.log('User logged in successfully');
        console.log('Token: ', token);
    } catch (err) {
        console.error('Failed to login user', err.message);
    }
    showMainMenu();
};


// Handle create task
const handleCreateTask = async () => {
    console.log('====Create Task====');
    const title = await getUserInput('Enter Task Title: ');
    const description = await getUserInput('Enter Task Description: ');
    const dueDate = await getUserInput('Enter Task Due Date: ');
    const importance = await getUserInput('Enter Task Importance: ');

    try {
        await createTask(title, description, dueDate, importance);
        console.log('Task created successfully');
    } catch (err) {
        console.error('Failed to create task', err.message);
    }
    showMainMenu();
};


// Handle list tasks
const handleListTasks = async () => {
    console.log('====Task List====');
    try {
        const sortBy = await getUserInput('Sort by (title/dueDate/importance/createdAt/updatedAt/completed/completedDate/description): ');
        const sortOrder = await getUserInput('Sort order (asc/desc): ');
        
        const tasks = await getTasks(sortBy, sortOrder);
        console.log('Task List: ');
        tasks.forEach((task) => {
            console.log(`Task ID: ${task._id}`);
            console.log(`Title: ${task.title}`);
            console.log(`Description: ${task.description}`);
            console.log(`Created At: ${task.createdAt}`);
            console.log(`Updated At: ${task.updatedAt}`);
            console.log(`Due Date: ${task.dueDate}`);
            console.log(`Importance: ${task.importance}`);
            console.log(`Completed Date: ${task.completedDate}`);
            console.log(`Completed: ${task.completed}`);
            console.log('=========================');
        });
    } catch (err) {
        console.error('Failed to list tasks', err.message);
    }
    showMainMenu();
};


// Handle update task
const handleUpdateTask = async () => {
    console.log('====Update Task====');
    const taskId = await getUserInput('Enter Task ID: ');
    const title = await getUserInput('Enter New Task Title (leave empty to skip): ');
    const description = await getUserInput('Enter New Task Description (leave empty to skip): ');
    const dueDate = await getUserInput('Enter New Task Due Date (leave empty to skip): ');
    const importance = await getUserInput('Enter New Importance (leave empty to skip): ');
    const completed = await getUserInput('Enter New Completion Status (true/false) (leave empty to skip): ');

    try {
        await updateTask(taskId, title, description, dueDate, importance, completed);
        console.log('Task updated successfully');
    } catch (err) {
        console.error('Failed to update task', err.message);
    }
    showMainMenu();
};


// Handle delete task
const handleDeleteTask = async () => {
    console.log('====Delete Task====');
    const taskid = await getUserInput('Enter Task ID: ');

    try {
        await deleteTask(taskid);
        console.log('Task deleted successfully');
    } catch (err) {
        console.error('Failed to delete task', err.message);
    }
    showMainMenu();
};


// Handle logout user
const handleLogoutUser = async () => {
    console.log('====User Logout====');
    try {
        await logoutUser();
        console.log('User logged out successfully');
    } catch (err) {
        console.error('Failed to logout user', err.message);
    }
    showMainMenu();
};


// Handle user choice selection from main menu
const showMainMenu = async () => {
    displayMenu();

    const option = await getUserInput('Enter your choice: ');

    switch (option) {
        case '1':
            await handleRegisterUser();
            break;
        case '2':
            await handleLoginUser();
            break;
        case '3':
            await handleRegisterUserWithGoogle();
            break;
        case '4':
            await handleLoginUserWithGoogle();
            break;
        case '5':
            await handleCreateTask();
            break;
        case '6':
            await handleListTasks();
            break;
        case '7':
            await handleUpdateTask();
            break;
        case '8':
            await handleDeleteTask();
            break;
        case '9':
            await handleLogoutUser();
            break;
        case '10':
            rl.close();
            process.exit(0);
        default:
            console.log('Invalid option');
    }
};


const main = async () => {
    console.log('Welcome to the my task manager web application!');
    showMainMenu();
};

main();