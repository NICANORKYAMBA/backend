const readline = require('readline');
const { registerUser, loginUser, createTask, listTask, updateTask, deleteTask, logoutUser } = require('./src/utils/api');


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});


const main = async () => {
    console.log('Welcome to the my task manager web application!');
    
    while (true) {
        console.log('\nPlease select an option:');
        console.log('1. Register User');
        console.log('2. Login User');
        console.log('3. Create Task');
        console.log('4. List Tasks');
        console.log('5. Update Task');
        console.log('6. Delete Task');
        console.log('7. Logout');
        console.log('8. Exit');

        const option = await new Promise((resolve) => {
            rl.question('Option: ', (option) => {
                resolve(option);
            });
        });

        switch (option) {
            case '1':
                await register();
                break;
            case '2':
                await login();
                break;
            case '3':
                await create();
                break;
            case '4':
                await list();
                break;
            case '5':
                await update();
                break;
            case '6':
                await remove();
                break;
            case '7':
                await logout();
                break;
            case '8':
                rl.close();
                process.exit(0);
            default:
                console.log('Invalid option');
        }
    }
};


const register = async () => {

    const username = await new Promise((resolve) => {
        rl.question('Username: ', (username) => {
            resolve(username);
        });
    });

    const email = await new Promise((resolve) => {
        rl.question('Email: ', (email) => {
            resolve(email);
        });
    });

    const password = await new Promise((resolve) => {
        rl.question('Password: ', (password) => {
            resolve(password);
        });
    });

    await registerUser(username, email, password);
};


const login = async () => {

    const email = await new Promise((resolve) => {
        rl.question('Email: ', (email) => {
            resolve(email);
        });
    });

    const password = await new Promise((resolve) => {
        rl.question('Password: ', (password) => {
            resolve(password);
        });
    });

    await loginUser(email, password);
};


const create = async () => {

    const title = await new Promise((resolve) => {
        rl.question('Title: ', (title) => {
            resolve(title);
        });
    });

    const description = await new Promise((resolve) => {
        rl.question('Description: ', (description) => {
            resolve(description);
        });
    });

    const dueDate = await new Promise((resolve) => {
        rl.question('Due Date: ', (dueDate) => {
            resolve(dueDate);
        });
    });

    const importance = await new Promise((resolve) => {
        rl.question('Importance (1-5): ', (importance) => {
            resolve(importance);
        });
    });

    await createTask(title, description, dueDate, importance);
};


const list = async () => {
    await listTask();
};


const update = async () => {
    
        const id = await new Promise((resolve) => {
            rl.question('Task ID: ', (id) => {
                resolve(id);
            });
        });
    
        const title = await new Promise((resolve) => {
            rl.question('Title: ', (title) => {
                resolve(title);
            });
        });
    
        const description = await new Promise((resolve) => {
            rl.question('Description: ', (description) => {
                resolve(description);
            });
        });
    
        const dueDate = await new Promise((resolve) => {
            rl.question('Due Date: ', (dueDate) => {
                resolve(dueDate);
            });
        });
    
        const importance = await new Promise((resolve) => {
            rl.question('Importance (1-5): ', (importance) => {
                resolve(importance);
            });
        });
    
        const completed = await new Promise((resolve) => {
            rl.question('Completed (true/false): ', (completed) => {
                resolve(completed);
            });
        });
    
        await updateTask(id, title, description, dueDate, importance, completed);
};
    

const remove = async () => {
    
        const id = await new Promise((resolve) => {
            rl.question('Task ID: ', (id) => {
                resolve(id);
            });
        });
    
        await deleteTask(id);
};
    

const logout = async () => {
    await logoutUser();
};


main();