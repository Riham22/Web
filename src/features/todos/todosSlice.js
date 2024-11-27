import { createSlice } from '@reduxjs/toolkit';

const todosSlice = createSlice({
    name: 'todos',
    initialState: {
        todos: [],
        filter: 'all',
        filterPriority: 'Low',
    },
    reducers: {
        setTodos: (state, action) => {
            state.todos = action.payload;
        },
        addTodo: (state, action) => {
            state.todos.push(action.payload);
        },
        deleteTodo: (state, action) => {
            state.todos = state.todos.filter(todo => todo.id !== action.payload);
        },
        toggleComplete: (state, action) => {
            const todo = state.todos.find(todo => todo.id === action.payload);
            if (todo) {
                todo.complete = !todo.complete;
                todo.completedTime = todo.complete ? new Date().toLocaleString() : null;
            }
        },
        editTodo: (state, action) => {
            const { id, name, priority } = action.payload;
            const todo = state.todos.find(todo => todo.id === id);
            if (todo) {
                todo.name = name;
                todo.priority = priority;
            }
        },
        setFilter: (state, action) => {
            state.filter = action.payload.filterType;
            state.filterPriority = action.payload.priority || state.filterPriority;
        },
    },
});

export const { setTodos, addTodo, deleteTodo, toggleComplete, editTodo, setFilter } = todosSlice.actions;

export default todosSlice.reducer;
