import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import TaskCard from "../components/TaskCard";
import StudyMotivation from "../components/StudyMotivation";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [examLoading, setExamLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/tasks")
      .then((response) => response.json())
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading tasks:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/exams")
      .then((response) => response.json())
      .then((data) => {
        setExams(data);
        setExamLoading(false);
      })
      .catch((error) => {
        console.error("Error loading exams:", error);
        setExamLoading(false);
      });
  }, []);

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status !== "Completed"
  ).length;

  const progress =
    tasks.length > 0
      ? Math.round((completedTasks / tasks.length) * 100)
      : 0;

  const handleComplete = async (id) => {
    const task = tasks.find((item) => item.id === id);

    if (!task) return;

    const updatedTask = {
      ...task,
      status:
        task.status === "Completed"
          ? "Pending"
          : "Completed",
    };

    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTask),
        }
      );

      const data = await response.json();

      setTasks((currentTasks) =>
        currentTasks.map((item) =>
          item.id === id ? data : item
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(
        `http://localhost:5000/api/tasks/${id}`,
        {
          method: "DELETE",
        }
      );

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== id)
      );
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const getDaysUntilExam = (examDate) => {
    const today = new Date();

    const exam = new Date(`${examDate}T00:00:00`);

    const todayDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const difference =
      exam.getTime() - todayDate.getTime();

    return Math.max(
      0,
      Math.ceil(
        difference / (1000 * 60 * 60 * 24)
      )
    );
  };

  const nextExam = [...exams]
    .sort(
      (a, b) =>
        new Date(a.date) - new Date(b.date)
    )
    .find(
      (exam) =>
        getDaysUntilExam(exam.date) >= 0
    );

  const daysUntilExam = nextExam
    ? getDaysUntilExam(nextExam.date)
    : null;

  return (
    <div className="dashboard-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">
            YOUR ACADEMIC COMMAND CENTER
          </p>

          <h1>
            Good evening, <span>Vaishnavi.</span>
          </h1>

          <p className="header-description">
            Stay organized, stay focused, and make
            progress toward your academic goals.
          </p>
        </div>

        <div className="header-date">
          <span>Today</span>
          <strong>03 October 2026</strong>
        </div>
      </header>

      <section className="stats-grid">
        <StatCard
          icon="📚"
          value={tasks.length}
          label="Total Tasks"
          trend="+2 this week"
        />

        <StatCard
          icon="✓"
          value={completedTasks}
          label="Completed"
          trend="Great progress"
        />

        <StatCard
          icon="⏳"
          value={pendingTasks}
          label="Pending Tasks"
          trend="Stay focused"
        />

        <StatCard
          icon="🎯"
          value={`${progress}%`}
          label="Overall Progress"
          trend="Keep going"
        />
      </section>

      <div className="dashboard-grid">
        <section className="dashboard-main">
          <div className="section-heading">
            <div>
              <p className="section-label">
                YOUR WORKLOAD
              </p>

              <h2>Today's Focus</h2>
            </div>

            <span className="task-count">
              {pendingTasks} pending
            </span>
          </div>

          <div className="progress-card">
            <div className="progress-top">
              <div>
                <span>Weekly Progress</span>
                <strong>{progress}%</strong>
              </div>

              <span>
                {completedTasks} of {tasks.length}{" "}
                completed
              </span>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${progress}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="task-list">
            {loading ? (
              <div className="empty-state">
                <div className="loading-spinner"></div>

                <p>Loading your tasks...</p>
              </div>
            ) : tasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  📝
                </div>

                <h3>No tasks yet</h3>

                <p>
                  Your study tasks will appear
                  here.
                </p>
              </div>
            ) : (
              tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onComplete={handleComplete}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        </section>

        <aside className="dashboard-side">
          <StudyMotivation />

          <div className="focus-card">
            <div className="focus-card-header">
              <div>
                <p className="section-label">
                  EXAM COUNTDOWN
                </p>

                <h3>Next Big Goal</h3>
              </div>

              <span className="calendar-icon">
                📅
              </span>
            </div>

            {examLoading ? (
              <div className="exam-loading">
                Loading exam...
              </div>
            ) : nextExam ? (
              <>
                <div className="countdown">
                  <strong>{daysUntilExam}</strong>

                  <span>
                    {daysUntilExam === 1
                      ? "day"
                      : "days"}
                  </span>
                </div>

                <p className="exam-name">
                  {nextExam.subject}
                </p>

                <div className="mini-progress">
                  <div
                    className="mini-progress-fill"
                    style={{
                      width: `${nextExam.preparation}%`,
                    }}
                  ></div>
                </div>

                <div className="focus-footer">
                  <span>Preparation</span>

                  <strong>
                    {nextExam.preparation}%
                  </strong>
                </div>
              </>
            ) : (
              <div className="empty-exam">
                <span>📚</span>

                <p>No upcoming exams</p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Dashboard;