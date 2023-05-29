const axios = require('axios');


// Create axios instance
const api = axios.create({
    baseURL: 'http://localhost:3000/api',
});

// Register user normally
const registerUser = async (username, email, password) => {

    try {
        const res = await api.post('/auth/register', { username, email, password });
        console.log(res.data.message);
    } catch (err) {
        console.error(err.response.data.message);
    }
}


// Register user with Google Account
const registerUserWithGoogle = async (accessToken) => {

    try {
        const res = await api.post('/auth/google/register', null, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log(res.data.message);
    } catch (err) {
        console.error(err.response.data.message);
    }
}


// Login user with Google Account
const loginUserWithGoogle = async (accessToken) => {

    try {
        const res = await api.post('/auth/google/login', null, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log(res.data.message);
    } catch (err) {
        console.error(err.response.data.message);
    }
}


// Login user normally
const loginUser = async (email, password) => {

    try {
        const res = await api.post('/auth/login', { email, password });
        console.log(res.data.message);
    } catch (err) {
        console.error(err.response.data.message);
    }
}


// Create task
const createTask = async (title, description, dueDate, importance) => {
    
        try {
            const res = await api.post('/tasks', { title, description, dueDate, importance });
            console.log(res.data.message);
        } catch (err) {
            console.error(err.response.data.message);
        }
}
    

// Update task
const updateTask = async (id, title, description, dueDate, importance, completed) => {
        
            try {
                const res = await api.put(`/tasks/${id}`, { title, description, dueDate, importance, completed });
                console.log(res.data.message);
            } catch (err) {
                console.error(err.response.data.message);
            }
}
    

// Delete task
const deleteTask = async (id) => {

    try {
        const res = await api.delete(`/tasks/${id}`);
        console.log(res.data.message);
    } catch (err) {
        console.error(err.response.data.message);
    }
}


// Get all tasks
const getTasks = async (sortBy, sortOrder) => {

    try {
        const res = await api.get(`/tasks?sortBy=${sortBy}&sortOrder=${sortOrder}`);
        console.log(res.data);
    } catch (err) {
        console.error(err.response.data.message);
    }
}


// Logout user
const logoutUser = async () => {

    try {
        const res = await api.post('/auth/logout');
        console.log(res.data.message);
    } catch (err) {
        console.error(err.response.data.message);
    }
}
    

// Export functions
module.exports = {
    registerUser,
    registerUserWithGoogle,
    loginUserWithGoogle,
    loginUser,
    createTask,
    updateTask,
    deleteTask,
    getTasks,
    logoutUser,
};