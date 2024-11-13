// src/TodoApp.js
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setTodoList,
  addTask,
  setNewTask,
  setAddedTime,
  setPriority,
  setEditTaskId,
  setEditTaskName,
  setEditPriority,
  toggleTaskCompletion,
  updateTask,
  deleteTask,
  setSelectedFilter,
  setFilterPriority,
} from "features/todoSlice";
import { VscCheckAll } from "react-icons/vsc";
import { MdDeleteOutline, MdEdit } from "react-icons/md";
import Navbar from "./components/Navbar";
import axios from "axios";
import { AnimatedBackground } from "animated-backgrounds";

const api = axios.create({
  baseURL: "https://dummyjson.com/todos",
  headers: {
    "Content-Type": "application/json",
  },
});

function TodoApp() {
  const dispatch = useDispatch();

  const {
    todoList,
    newTask,
    addedTime,
    priority,
    editTaskId,
    editTaskName,
    editPriority,
    selectedFilter,
    filterPriority,
  } = useSelector((state) => state.todo);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://dummyjson.com/todos");
        const apiData = response.data.todos.map((item) => ({
          id: item.id,
          name: item.todo,
          complete: item.completed,
          addedTime: new Date().toISOString(),
          priority: "Low", // Default priority
          completedTime: item.completed ? new Date().toLocaleString() : null,
        }));
        dispatch(setTodoList(apiData));
      } catch (error) {
        console.error("Error fetching data from API:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  const addTasks = () => {
    if (!newTask.trim() || !addedTime || !priority) return;
    const task = {
      id: todoList.length === 0 ? 1 : todoList[todoList.length - 1].id + 1,
      name: newTask,
      complete: false,
      addedTime: addedTime,
      priority: priority,
      completedTime: null,
    };
    dispatch(addTask(task));
  };

  const deleteTasks = async (id) => {
    try {
      await api.delete(`/${id}`);
      dispatch(deleteTask(id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const toggleComplete = (id) => {
    dispatch(toggleTaskCompletion(id));
  };

  const startEditing = (id, currentName, currentPriority) => {
    dispatch(setEditTaskId(id));
    dispatch(setEditTaskName(currentName));
    dispatch(setEditPriority(currentPriority));
  };

  const saveEdit = () => {
    if (!editTaskName.trim()) return;
    dispatch(
      updateTask({ id: editTaskId, name: editTaskName, priority: editPriority })
    );
    dispatch(setEditTaskId(null));
    dispatch(setEditTaskName(""));
    dispatch(setEditPriority(""));
  };

  const filteredTasks = todoList.filter((task) => {
    if (selectedFilter === "completed") return task.complete;
    if (selectedFilter === "priority") return task.priority === filterPriority;
    return true;
  });

  return (
    <>
      <AnimatedBackground animationName="particleNetwork" />
      <div className="app">
        {/* Add Task form */}
        {/* Rest of your components go here */}
      </div>
    </>
  );
}

export default TodoApp;
