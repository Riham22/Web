import axios from 'axios';

const api = axios.create({
    baseURL: 'https://dummyjson.com/todos',
    headers: { 'Content-Type': 'application/json' },
});


export const fetchTodos = async () => {
    try {
        const response = await api.get('/');
        return response.data.todos.map((item) => ({
            id: item.id,
            name: item.todo,
            complete: item.completed,
            addedTime: new Date().toLocaleString(),
            priority: 'Low',
            completedTime: item.completed ? new Date().toLocaleString() : null,
        }));
    } catch (error) {
        console.error('Error fetching todos:', error);
        return [];
    }
};

export const deleteTodoApi = async (id) => {
    try {
        await api.delete(`/${id}`);
    } catch (error) {
        console.error('Error deleting task:', error);
    }
};

export const toggleCompleteApi = async (id, completed) => {
    try {
        await api.patch(`/${id}`, { completed });
    } catch (error) {
        console.error('Error toggling completion status:', error);
    }
};
