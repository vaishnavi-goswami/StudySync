import { useEffect, useState } from "react";

function Planner() {
  const [tasks, setTasks] = useState([]);

  const [form, setForm] = useState({
    title: "",
    subject: "",
    priority: "Medium",
    dueDate: "",
  });

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/tasks");
      const data = await response.json();

      setTasks(data);
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title || !form.subject || !form.dueDate) {
      setMessage("Please fill in all required fields.");
      return;
    }

    try {
      if (editingId) {
        // UPDATE EXISTING TASK
        const response = await fetch(
          `http://localhost:5000/api/tasks/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setMessage(data.message || "Unable to update task.");
          return;
        }

        setTasks((currentTasks) =>
          currentTasks.map((task) =>
            task.id === editingId ? data : task
          )
        );

        setMessage("Task updated successfully!");

        setEditingId(null);
      } else {
        // CREATE NEW TASK
        const response = await fetch(
          "http://localhost:5000/api/tasks",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setMessage(data.message || "Unable to add task.");
          return;
        }

        setTasks((currentTasks) => [
          ...currentTasks,
          data,
        ]);

        setMessage("Task added successfully!");
      }

      setForm({
        title: "",
        subject: "",
        priority: "Medium",
        dueDate: "",
      });

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error saving task:", error);

      setMessage("Unable to connect to the server.");
    }
  };

  const handleEdit = (task) => {
    setEditingId(task.id);

    setForm({
      title: task.title,
      subject: task.subject,
      priority: task.priority,
      dueDate: task.dueDate,
    });

    setMessage("Editing task...");
  };

  const handleCancelEdit = () => {
    setEditingId(null);

    setForm({
      title: "",
      subject: "",
      priority: "Medium",
      dueDate: "",
    });

    setMessage("");
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setTasks((currentTasks) =>
          currentTasks.filter((task) => task.id !== id)
        );

        if (editingId === id) {
          handleCancelEdit();
        }

        setMessage("Task deleted.");

        setTimeout(() => {
          setMessage("");
        }, 2500);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      task.subject
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" ||
      task.priority === filter ||
      task.status === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="planner-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">PLAN • ORGANIZE • ACHIEVE</p>

          <h1>
            Study <span>Planner</span>
          </h1>

          <p className="header-description">
            Turn your academic goals into clear, manageable
            tasks.
          </p>
        </div>

        <div className="planner-summary">
          <strong>{tasks.length}</strong>
          <span>Total Tasks</span>
        </div>
      </header>

      <div className="planner-layout">
        <section className="planner-form-card">
          <div className="card-heading">
            <div className="heading-icon">
              {editingId ? "✎" : "＋"}
            </div>

            <div>
              <p className="section-label">
                {editingId
                  ? "UPDATE TASK"
                  : "CREATE TASK"}
              </p>

              <h2>
                {editingId
                  ? "Edit Task"
                  : "Add a New Task"}
              </h2>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="task-form"
          >
            <div className="form-group">
              <label htmlFor="title">
                Task Title *
              </label>

              <input
                id="title"
                name="title"
                type="text"
                placeholder="e.g. Complete React assignment"
                value={form.title}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">
                Subject *
              </label>

              <input
                id="subject"
                name="subject"
                type="text"
                placeholder="e.g. Full Stack Development"
                value={form.subject}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="priority">
                  Priority
                </label>

                <select
                  id="priority"
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">
                    Medium
                  </option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="dueDate">
                  Due Date *
                </label>

                <input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={form.dueDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              className="primary-button"
            >
              {editingId
                ? "Update Task"
                : "Add Task"}

              <span>
                {editingId ? "✓" : "→"}
              </span>
            </button>

            {editingId && (
              <button
                type="button"
                className="timer-reset-button"
                onClick={handleCancelEdit}
              >
                Cancel Editing
              </button>
            )}

            {message && (
              <div className="form-message">
                {message}
              </div>
            )}
          </form>
        </section>

        <section className="planner-list-card">
          <div className="list-header">
            <div>
              <p className="section-label">
                YOUR SCHEDULE
              </p>

              <h2>All Tasks</h2>
            </div>

            <span className="task-count">
              {filteredTasks.length} shown
            </span>
          </div>

          <div className="planner-controls">
            <div className="search-box">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>

            <select
              value={filter}
              onChange={(event) =>
                setFilter(event.target.value)
              }
              className="filter-select"
            >
              <option value="All">All Tasks</option>
              <option value="High">
                High Priority
              </option>
              <option value="Medium">
                Medium Priority
              </option>
              <option value="Low">
                Low Priority
              </option>
              <option value="Completed">
                Completed
              </option>
              <option value="Pending">
                Pending
              </option>
            </select>
          </div>

          <div className="planner-task-list">
            {filteredTasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  🔎
                </div>

                <h3>No tasks found</h3>

                <p>
                  Try changing your search or add a
                  new task.
                </p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  className="planner-task"
                  key={task.id}
                >
                  <div className="planner-task-info">
                    <div className="task-title-row">
                      <h3>{task.title}</h3>

                      <span
                        className={`priority ${task.priority.toLowerCase()}`}
                      >
                        {task.priority}
                      </span>
                    </div>

                    <p>
                      {task.subject} · Due{" "}
                      {task.dueDate}
                    </p>

                    <span
                      className={`status ${
                        task.status === "Completed"
                          ? "completed"
                          : "pending"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>

                  <div className="task-actions">
                    <button
                      className="edit-button"
                      onClick={() =>
                        handleEdit(task)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() =>
                        handleDelete(task.id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Planner;