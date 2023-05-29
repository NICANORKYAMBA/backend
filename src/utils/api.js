const axios = require('axios');

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

const registerUser = async (username, email, password) => {
    try {
        const res = await api.post('/auth/register', { username, email, password });
        console.log(res.data.message);
    } catch (err) {
        console.error(err.response.data.message);
    }
}

const loginUser = async (email, password) => {
    try {
        const res = await api.post('/auth/login', { email, password });
        console.log(res.data.message);
    } catch (err) {
        console.error(err.response.data.message);
    }
}

const createTask = async (title, description, dueDate, importance) => {
    try {
        const res = await api.post('/tasks', { title, description, dueDate, importance });
        console.log(res.data.message);
    } catch (err) {
        console.error(err.response.data.message);
    }
}

const updateTask = async (id, title, description, dueDate, importance, completed) => {
    try {
        const res = await api.put(`/tasks/${id}`, { title, description, dueDate, importance, completed });
        console.log(res.data.message);
    } catch (err) {
        console.error(err.response.data.message);
    }
}

const deleteTask = async (id) => {
    try {
        const res = await api.delete(`/tasks/${id}`);
        console.log(res.data.message);
    } catch (err) {
        console.error(err.response.data.message);
    }
}

const getTasks = async () => {
    try {
        const res = await api.get('/tasks');
        console.log(res.data);
    } catch (err) {
        console.error(err.response.data.message);
    }
}

const logoutUser = async () => {
    try {
        const res = await api.get('/auth/logout');
        console.log(res.data.message);
    } catch (err) {
        console.error(err.response.data.message);
    }
}

module.exports = {
    registerUser,
    loginUser,
    createTask,
    updateTask,
    deleteTask,
    getTasks,
    logoutUser,
};