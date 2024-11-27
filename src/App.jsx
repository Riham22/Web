import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchTodos,
  deleteTodoApi,
  toggleCompleteApi,
} from "./features/todos/todosApi";
import {
  setTodos,
  addTodo,
  deleteTodo,
  toggleComplete,
  editTodo,
  setFilter,
} from "./features/todos/todosSlice";
import Navbar from "./components/Navbar";
import { VscCheckAll } from "react-icons/vsc";
import { MdDeleteOutline, MdEdit } from "react-icons/md";
import { AnimatedBackground } from "animated-backgrounds";
import "./App.css";

function App() {
  const dispatch = useDispatch();
  const todoList = useSelector((state) => state.todos.todos);
  const filter = useSelector((state) => state.todos.filter);
  const filterPriority = useSelector((state) => state.todos.filterPriority);

  const [newTask, setNewTask] = useState("");
  const [addedTime, setAddedTime] = useState("");
  const [priority, setPriority] = useState("Low");
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskName, setEditTaskName] = useState("");
  const [editPriority, setEditPriority] = useState("");

  useEffect(() => {
    const loadTodos = async () => {
      const todos = await fetchTodos();
      dispatch(setTodos(todos));
    };
    loadTodos();
  }, [dispatch]);

  const handleAddTask = () => {
    if (!newTask.trim() || !addedTime || !priority) return;
    dispatch(
      addTodo({
        id: Date.now(),
        name: newTask,
        complete: false,
        addedTime,
        priority,
        completedTime: null,
      })
    );
    setNewTask("");
    setAddedTime("");
    setPriority("Low");
  };

  const handleDelete = async (id) => {
    await deleteTodoApi(id);
    dispatch(deleteTodo(id));
  };

  const handleToggleComplete = (id) => {
    const task = todoList.find((task) => task.id === id);
    if (task) {
      toggleCompleteApi(id, !task.complete); // Toggle complete status
      dispatch(toggleComplete(id)); // Update Redux state
    }
  };

  const startEditing = (id, currentName, currentPriority) => {
    setEditTaskId(id);
    setEditTaskName(currentName);
    setEditPriority(currentPriority);
  };

  const saveEdit = () => {
    if (!editTaskName.trim()) return;
    dispatch(
      editTodo({ id: editTaskId, name: editTaskName, priority: editPriority })
    );
    setEditTaskId(null); // Reset editing state
    setEditTaskName("");
    setEditPriority("");
  };

  const handleFilterChange = (filterType, priority = null) => {
    dispatch(setFilter({ filterType, priority }));
  };

  const filteredTasks = todoList.filter((task) => {
    if (filter === "completed") return task.complete;
    if (filter === "priority") return task.priority === filterPriority;
    return true;
  });

  return (
    <>
      <AnimatedBackground animationName="particleNetwork" />
      <div className="app">
        <div className="addTask">
          <input
            id="myInput"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter task"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="timeInput"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <input
            type="datetime-local"
            value={addedTime}
            onChange={(e) => setAddedTime(e.target.value)}
            className="timeInput"
          />
          <button onClick={handleAddTask}>Add Task</button>
        </div>

        <Navbar handleFilterChange={handleFilterChange} />

        <div className="list">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={task.complete ? "completed-task" : "mytask"}
            >
              {editTaskId === task.id ? (
                <>
                  <input
                    type="text"
                    value={editTaskName}
                    onChange={(e) => setEditTaskName(e.target.value)}
                    placeholder="Edit task"
                    className="edit-input"
                  />
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value)}
                    className="timeInput"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                  <button onClick={saveEdit}>Save</button>
                </>
              ) : (
                <>
                  <span>{task.name}</span>
                  <div className="iconsrow">
                    <span>{task.addedTime}</span>
                    <span>{task.completedTime}</span>

                    <VscCheckAll
                      id="check"
                      onClick={() => handleToggleComplete(task.id)}
                    />
                    <MdEdit
                      id="edit"
                      onClick={() =>
                        startEditing(task.id, task.name, task.priority)
                      }
                    />
                    <MdDeleteOutline
                      id="remove"
                      onClick={() => handleDelete(task.id)}
                    />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
