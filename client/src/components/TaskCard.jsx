function TaskCard({ task, onComplete, onDelete }) {
  return (
    <div
      className={`task-card ${
        task.status === "Completed" ? "completed" : ""
      }`}
    >
      <div className="task-main">
        <div className="task-checkbox">
          <button
            onClick={() => onComplete(task.id)}
            title="Mark task as completed"
          >
            {task.status === "Completed" ? "✓" : ""}
          </button>
        </div>

        <div className="task-info">
          <h4>{task.title}</h4>

          <p>
            {task.subject} · Due {task.dueDate}
          </p>

          <span className={`priority ${task.priority.toLowerCase()}`}>
            {task.priority}
          </span>
        </div>
      </div>

      <button
        className="delete-task"
        onClick={() => onDelete(task.id)}
        title="Delete task"
      >
        ×
      </button>
    </div>
  );
}

export default TaskCard;