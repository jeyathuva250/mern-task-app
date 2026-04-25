import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "https://mern-task-app-hi43.onrender.com/";

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setTasks(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to fetch tasks. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await axios.post(API_URL, { title });
      setTasks([res.data, ...tasks]);
      setTitle("");
    } catch (err) {
      console.error("Error adding task:", err);
      alert("Failed to add task.");
    }
  };

  const toggleTask = async (id, completed) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, { completed: !completed });
      setTasks(tasks.map(t => t._id === id ? res.data : t));
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="container">
      <header>
        <h1>Task Hero</h1>
        <p>Level up your productivity</p>
      </header>

      <form className="task-form" onSubmit={addTask}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          autoFocus
        />
        <button type="submit" disabled={!title.trim()}>
          Add Task
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      <div className="task-list">
        {loading ? (
          <div className="loader">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">No tasks yet. Start by adding one!</div>
        ) : (
          <ul>
            {tasks.map((t) => (
              <li key={t._id} className={t.completed ? "completed" : ""}>
                <div className="task-content">
                  <input
                    type="checkbox"
                    checked={t.completed}
                    onChange={() => toggleTask(t._id, t.completed)}
                  />
                  <span>{t.title}</span>
                </div>
                <button className="delete-btn" onClick={() => deleteTask(t._id)}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <footer>
        {tasks.length > 0 && (
          <p>{tasks.filter(t => !t.completed).length} items remaining</p>
        )}
      </footer>
    </div>
  );
}

export default App;
