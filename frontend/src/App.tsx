import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState("all");
  const [newTask, setNewTask] = useState("");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("dark") === "true");
  const [isLoading, setIsLoading] = useState(false);

  const backend = "http://localhost:8000";

  const fetchTodos = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${backend}/todos${filter !== "all" ? `?status=${filter}` : ""}`);
      setTodos(res.data);
    } catch (err) {
      console.error("Failed to fetch todos", err);
    } finally {
      setIsLoading(false);
    }
  };

  const createTodo = async () => {
    if (newTask.trim() === "") return;
    setIsLoading(true);
    try {
      await axios.post(`${backend}/todos`, { title: newTask, completed: false });
      setNewTask("");
      await fetchTodos();
    } catch (err) {
      console.error("Failed to create task", err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTodo = async (id: number) => {
    setIsLoading(true);
    try {
      await axios.delete(`${backend}/todos/${id}`);
      await fetchTodos();
    } catch (err) {
      console.error("Failed to delete task", err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleComplete = async (id: number, current: boolean) => {
    const task = todos.find((t) => t.id === id);
    if (!task) return;

    setIsLoading(true);
    try {
      await axios.put(`${backend}/todos/${id}`, {
        title: task.title,
        completed: !current,
      });
      await fetchTodos();
    } catch (err) {
      console.error("Failed to toggle completion", err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDark = () => {
    setDarkMode((prev) => {
      const newVal = !prev;
      localStorage.setItem("dark", String(newVal));
      return newVal;
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      createTodo();
    }
  };

  useEffect(() => {
    fetchTodos();
    document.body.className = darkMode ? "dark" : "";
  }, [darkMode, filter]);

  return (
    <div className={`app-container ${darkMode ? "dark" : ""}`}>
      <div className="header">
        <h1 className="app-title">To-Do List</h1>
        <button 
          className="theme-toggle"
          onClick={toggleDark}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>

      <div className="input-container">
        <input
          className="task-input"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="What needs to be done?"
          disabled={isLoading}
        />
        <button 
          className="add-button"
          onClick={createTodo}
          disabled={isLoading || !newTask.trim()}
        >
          {isLoading ? "..." : "+"}
        </button>
      </div>

      <div className="filter-buttons">
        <button 
          className={`filter-button ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button 
          className={`filter-button ${filter === "completed" ? "active" : ""}`}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
        <button 
          className={`filter-button ${filter === "pending" ? "active" : ""}`}
          onClick={() => setFilter("pending")}
        >
          Pending
        </button>
      </div>

      {isLoading && todos.length === 0 ? (
        <div className="loading-spinner">Loading...</div>
      ) : todos.length === 0 ? (
        <div className="empty-state">
          {filter === "all" 
            ? "No tasks yet. Add one above!" 
            : filter === "completed" 
              ? "No completed tasks yet" 
              : "No pending tasks"}
        </div>
      ) : (
        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo.id} className="todo-item">
              <div 
                className={`todo-content ${todo.completed ? "completed" : ""}`}
                onClick={() => toggleComplete(todo.id, todo.completed)}
              >
                <span className="checkbox">
                  {todo.completed ? "✓" : ""}
                </span>
                <span className="todo-text">{todo.title}</span>
              </div>
              <button 
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTodo(todo.id);
                }}
                disabled={isLoading}
                aria-label="Delete task"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {todos.length > 0 && (
        <div className="counter">
          {todos.filter(t => !t.completed).length} items left
        </div>
      )}
    </div>
  );
}

export default App;