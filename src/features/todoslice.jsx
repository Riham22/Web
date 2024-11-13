// src/redux/todoSlice.js

import { createSlice } from "@reduxjs/toolkit";

const todoSlice = createSlice({
    name: "todos",
    initialState: {
        tasks: [],
        filter: "all", // Default filter
        selectedPriority: "Low", // Default priority for filtering
    },
    reducers: {
        setTasks(state, action) {
            state.tasks = action.payload;
        },
        addTask(state, action) {
            state.tasks.push(action.payload);
        },
        deleteTask(state, action) {
            state.tasks = state.tasks.filter((task) => task.id !== action.payload);
        },
        toggleComplete(state, action) {
            const task = state.tasks.find((task) => task.id === action.payload);
            if (task) {
                task.complete = !task.complete;
                task.completedTime = task.complete
                    ? new Date().toLocaleString()
                    : null;
            }
        },
        startEditing(state, action) {
            const { id, name, priority } = action.payload;
            const task = state.tasks.find((task) => task.id === id);
            if (task) {
                task.name = name;
                task.priority = priority;
            }
        },
        setFilter(state, action) {
            state.filter = action.payload.filterType;
            if (action.payload.priority) {
                state.selectedPriority = action.payload.priority;
            }
        },
    },
});

export const {
    setTasks,
    addTask,
    deleteTask,
    toggleComplete,
    startEditing,
    setFilter,
} = todoSlice.actions;

export default todoSlice.reducer;
