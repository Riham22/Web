import { useState } from "react";
import "./App.css";
import { AnimatedBackground } from "animated-backgrounds";
import { VscCheckAll } from "react-icons/vsc";
import { MdDeleteOutline } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import Navbar from "./components/Navbar";
import { useEffect } from "react";
import axios from "axios";
const api = axios.create({
  baseURL: "https://dummyjson.com/todos",
  headers: {
    "Content-Type": "application/json",
  },
});

function App() {
  const [newTask, setNewTask] = useState("");
  const [addedTime, setAddedTime] = useState("");
  const [priority, setPriority] = useState("Low");
  const [todoList, setTodoList] = useState([]);
  const [hoverState, setHoverState] = useState({
    check: null,
    delete: null,
    edit: null,
  });

  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskName, setEditTaskName] = useState("");
  const [editPriority, setEditPriority] = useState("");

  const [selectedFilter, setSelectedFilter] = useState("all");
  const [filterPriority, setFilterPriority] = useState("Low");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://dummyjson.com/todos");
        const apiData = response.data.todos.map((item) => ({
          id: item.id,
          name: item.todo,
          complete: item.completed,
          addedTime: new Date().toISOString(), // Example timestamp
          priority: "Low", // Default priority or fetch from API
          completedTime: item.completed ? new Date().toLocaleString() : null,
        }));
        setTodoList(apiData);
        console.log(apiData); // Check if data from the API is present
      } catch (error) {
        console.error("Error fetching data from API:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("Updated todoList after render:", todoList);
  }, [todoList]);

  const handleTaskChange = (e) => setNewTask(e.target.value);
  const handleTimeChange = (e) => setAddedTime(e.target.value);
  const handlePriorityChange = (e) => setPriority(e.target.value);

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
    setTodoList([...todoList, task]);
    console.log([...todoList, task]); // Check if tasks are added
    setNewTask("");
    setAddedTime("");
    setPriority("Low");
  };

  const deleteTasks = async (id) => {
    try {
      await api.delete(`/${id}`);

      // Remove the task from the UI state
      setTodoList(todoList.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  const toggleComplete = (id) => {
    setTodoList(
      todoList.map((task) =>
        task.id === id
          ? {
              ...task,
              complete: !task.complete,
              completedTime: task.complete ? null : new Date().toLocaleString(),
            }
          : task
      )
    );
  };

  const startEditing = (id, currentName, currentPriority) => {
    setEditTaskId(id);
    setEditTaskName(currentName);
    setEditPriority(currentPriority);
  };

  const saveEdit = () => {
    if (!editTaskName.trim()) return;
    setTodoList(
      todoList.map((task) =>
        task.id === editTaskId
          ? { ...task, name: editTaskName, priority: editPriority }
          : task
      )
    );
    setEditTaskId(null);
    setEditTaskName("");
    setEditPriority("");
  };

  const handleHover = (icon, id, isHovered) => {
    setHoverState((prevState) => ({
      ...prevState,
      [icon]: isHovered ? id : null,
    }));
  };

  const handleFilterChange = (filterType, priority = null) => {
    setSelectedFilter(filterType);
    if (priority) setFilterPriority(priority);
  };

  const filteredTasks = todoList.filter((task) => {
    if (selectedFilter === "completed") return task.complete;
    if (selectedFilter === "priority") return task.priority === filterPriority;
    if (selectedFilter === "urgent") {
      const oneWeekFromNow = new Date();
      oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
      return new Date(task.addedTime) <= oneWeekFromNow;
    }
    return true; // Default: show all tasks
  });

  return (
    <>
      <AnimatedBackground animationName="particleNetwork" />
      <div className="app">
        <div className="addTask">
          <input
            onChange={handleTaskChange}
            id="myInput"
            value={newTask}
            placeholder="Enter task"
          />
          <select
            value={priority}
            onChange={handlePriorityChange}
            className="timeInput"
            style={{ color: "white", padding: "1rem" }}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <input
            type="datetime-local"
            onChange={handleTimeChange}
            value={addedTime}
            className="timeInput"
            style={{ color: "white", width: "1rem" }}
          />
          <button onClick={addTasks}>Add Task</button>
        </div>

        <Navbar handleFilterChange={handleFilterChange} />

        <div className="list">
          {filteredTasks.map((t) => (
            <div
              id="mytask"
              key={t.id}
              style={{
                backgroundColor: t.complete
                  ? "rgba(155, 142, 255, 0.9)"
                  : "rgba(247, 247, 247, 0.9)",
                color: t.complete ? "white" : "#222",
              }}
            >
              <div className="taskName">
                {editTaskId === t.id ? (
                  <input
                    id="editInput"
                    type="text"
                    value={editTaskName} // Always ensure this is defined
                    onChange={(e) => setEditTaskName(e.target.value)}
                  />
                ) : (
                  <span>{t.name}</span>
                )}
              </div>

              <div className="iconsrow">
                <div
                  className="priority"
                  style={{
                    color: t.complete
                      ? hoverState.priority === t.id
                        ? "#494f9c" // Hover color when completed
                        : "white" // Default color for completed tasks
                      : hoverState.priority === t.id
                      ? "#494f9c" // Hover color when not completed
                      : "#222",
                    fontSize: "small",
                    textWrap: "nowrap",
                  }}
                >
                  {editTaskId === t.id ? (
                    <select
                      id="priorityInput"
                      style={{
                        padding: "1rem",
                        backgroundColor: "#494f9c",
                        color: "white",
                        borderRadius: "1rem",
                      }}
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value)}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  ) : (
                    // When not editing, show the task priority as text
                    <span>{t.priority}</span>
                  )}
                </div>

                <VscCheckAll
                  onMouseEnter={() => handleHover("check", t.id, true)}
                  onMouseLeave={() => handleHover("check", t.id, false)}
                  id="check"
                  onClick={() => toggleComplete(t.id)}
                  style={{
                    color: t.complete
                      ? hoverState.check === t.id
                        ? "#494f9c"
                        : "white"
                      : hoverState.check === t.id
                      ? "#494f9c"
                      : "#222",
                  }}
                />

                {editTaskId === t.id ? (
                  <button onClick={saveEdit} id="save">
                    Save
                  </button>
                ) : (
                  <MdEdit
                    id="editing"
                    onMouseEnter={() => handleHover("edit", t.id, true)}
                    onMouseLeave={() => handleHover("edit", t.id, false)}
                    style={{
                      color:
                        hoverState.edit === t.id
                          ? "#494f9c"
                          : t.complete
                          ? "white"
                          : "#222",
                    }}
                    onClick={() => startEditing(t.id, t.name, t.priority)}
                  />
                )}

                <MdDeleteOutline
                  onMouseEnter={() => handleHover("delete", t.id, true)}
                  onMouseLeave={() => handleHover("delete", t.id, false)}
                  id="remove"
                  onClick={() => deleteTasks(t.id)}
                  style={{
                    color:
                      hoverState.delete === t.id
                        ? "red"
                        : t.complete
                        ? "white"
                        : "#222",
                  }}
                />

                <div className="times">
                  <p>Due Time: {new Date(t.addedTime).toLocaleString()}</p>
                </div>

                {t.complete && (
                  <p className="completedTime">Completed: {t.completedTime}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
