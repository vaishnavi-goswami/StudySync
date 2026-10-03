import { useEffect, useMemo, useState } from "react";

function Analytics() {
  const [tasks, setTasks] = useState([]);
  const [studySessions, setStudySessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalyticsData = async () => {
      try {
        const [tasksResponse, sessionsResponse] =
          await Promise.all([
            fetch("http://localhost:5000/api/tasks"),
            fetch(
              "http://localhost:5000/api/study-sessions"
            ),
          ]);

        const tasksData = await tasksResponse.json();
        const sessionsData =
          await sessionsResponse.json();

        setTasks(tasksData);
        setStudySessions(sessionsData);
      } catch (error) {
        console.error(
          "Error loading analytics data:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadAnalyticsData();
  }, []);

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const totalTasks = tasks.length;

  const completionRate =
    totalTasks > 0
      ? Math.round(
          (completedTasks / totalTasks) * 100
        )
      : 0;

  const highPriorityTasks = tasks.filter(
    (task) => task.priority === "High"
  ).length;

  const totalStudyMinutes = studySessions.reduce(
    (total, session) =>
      total + Number(session.duration || 0),
    0
  );

  const totalStudyHours = (
    totalStudyMinutes / 60
  ).toFixed(1);

  const subjectData = useMemo(() => {
    const subjectMap = {};

    studySessions.forEach((session) => {
      if (!subjectMap[session.subject]) {
        subjectMap[session.subject] = 0;
      }

      subjectMap[session.subject] += Number(
        session.duration || 0
      );
    });

    return Object.entries(subjectMap)
      .map(([subject, minutes]) => ({
        subject,
        minutes,
        hours: (minutes / 60).toFixed(1),
      }))
      .sort((a, b) => b.minutes - a.minutes);
  }, [studySessions]);

  const maxStudyMinutes =
    subjectData.length > 0
      ? Math.max(
          ...subjectData.map(
            (item) => item.minutes
          )
        )
      : 1;

  const weeklyData = useMemo(() => {
    const days = [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun",
    ];

    const today = new Date();

    return days.map((day, index) => {
      const date = new Date(today);

      const currentDay = today.getDay();
      const mondayOffset =
        currentDay === 0 ? -6 : 1 - currentDay;

      date.setDate(
        today.getDate() +
          mondayOffset +
          index
      );

      const dateString =
        date.toISOString().split("T")[0];

      const minutes = studySessions
        .filter(
          (session) =>
            session.date === dateString
        )
        .reduce(
          (total, session) =>
            total +
            Number(session.duration || 0),
          0
        );

      return {
        day,
        minutes,
        hours: (minutes / 60).toFixed(1),
      };
    });
  }, [studySessions]);

  const maxWeeklyMinutes = Math.max(
    ...weeklyData.map((item) => item.minutes),
    60
  );

  if (loading) {
    return (
      <div className="analytics-page">
        <div className="empty-state">
          <div className="loading-spinner"></div>

          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">
            TRACK • ANALYZE • IMPROVE
          </p>

          <h1>
            Study <span>Analytics</span>
          </h1>

          <p className="header-description">
            Understand your study habits and track
            your academic progress.
          </p>
        </div>

        <div className="planner-summary">
          <strong>{totalStudyHours}h</strong>

          <span>Total Study Time</span>
        </div>
      </header>

      {/* SUMMARY CARDS */}

      <section className="analytics-stats">
        <div className="analytics-stat-card">
          <div className="analytics-stat-icon">
            ⏱
          </div>

          <div>
            <span>Total Study Time</span>

            <strong>
              {totalStudyHours}h
            </strong>

            <small>
              {totalStudyMinutes} minutes
            </small>
          </div>
        </div>

        <div className="analytics-stat-card">
          <div className="analytics-stat-icon">
            ✓
          </div>

          <div>
            <span>Task Completion</span>

            <strong>
              {completionRate}%
            </strong>

            <small>
              {completedTasks} of {totalTasks}{" "}
              tasks
            </small>
          </div>
        </div>

        <div className="analytics-stat-card">
          <div className="analytics-stat-icon">
            📚
          </div>

          <div>
            <span>Study Subjects</span>

            <strong>
              {subjectData.length}
            </strong>

            <small>
              Subjects tracked
            </small>
          </div>
        </div>

        <div className="analytics-stat-card">
          <div className="analytics-stat-icon">
            🎯
          </div>

          <div>
            <span>High Priority Tasks</span>

            <strong>
              {highPriorityTasks}
            </strong>

            <small>
              Need your attention
            </small>
          </div>
        </div>
      </section>

      {/* MAIN ANALYTICS GRID */}

      <div className="analytics-grid">
        {/* WEEKLY STUDY HOURS */}

        <section className="analytics-card weekly-card">
          <div className="analytics-card-header">
            <div>
              <p className="section-label">
                THIS WEEK
              </p>

              <h2>Study Hours</h2>
            </div>

            <span className="analytics-badge">
              {totalStudyHours}h total
            </span>
          </div>

          <div className="weekly-chart">
            {weeklyData.map((item) => {
              const height =
                item.minutes > 0
                  ? Math.max(
                      8,
                      (item.minutes /
                        maxWeeklyMinutes) *
                        100
                    )
                  : 4;

              return (
                <div
                  className="chart-column"
                  key={item.day}
                >
                  <div className="chart-value">
                    {item.hours}h
                  </div>

                  <div className="chart-bar-wrapper">
                    <div
                      className="chart-bar"
                      style={{
                        height: `${height}%`,
                      }}
                    ></div>
                  </div>

                  <span>{item.day}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* SUBJECT BREAKDOWN */}

        <section className="analytics-card subject-card">
          <div className="analytics-card-header">
            <div>
              <p className="section-label">
                BY SUBJECT
              </p>

              <h2>Study Distribution</h2>
            </div>
          </div>

          {subjectData.length === 0 ? (
            <div className="analytics-empty">
              <span>📊</span>

              <p>
                No study sessions recorded yet.
              </p>
            </div>
          ) : (
            <div className="subject-list">
              {subjectData.map((item) => {
                const percentage = Math.round(
                  (item.minutes /
                    totalStudyMinutes) *
                    100
                );

                const width = Math.max(
                  8,
                  (item.minutes /
                    maxStudyMinutes) *
                    100
                );

                return (
                  <div
                    className="subject-row"
                    key={item.subject}
                  >
                    <div className="subject-row-top">
                      <div>
                        <strong>
                          {item.subject}
                        </strong>

                        <span>
                          {item.hours} hours
                        </span>
                      </div>

                      <strong>
                        {percentage}%
                      </strong>
                    </div>

                    <div className="subject-progress">
                      <div
                        style={{
                          width: `${width}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* PRODUCTIVITY OVERVIEW */}

        <section className="analytics-card productivity-card">
          <div className="analytics-card-header">
            <div>
              <p className="section-label">
                PRODUCTIVITY
              </p>

              <h2>Task Performance</h2>
            </div>
          </div>

          <div className="productivity-content">
            <div
              className="donut-chart"
              style={{
                background: `conic-gradient(
                  #635bff ${completionRate}%,
                  #e8e8f0 ${completionRate}% 100%
                )`,
              }}
            >
              <div className="donut-center">
                <strong>
                  {completionRate}%
                </strong>

                <span>Complete</span>
              </div>
            </div>

            <div className="productivity-details">
              <div>
                <span className="legend-dot completed-dot"></span>

                <div>
                  <strong>
                    {completedTasks}
                  </strong>

                  <p>Completed</p>
                </div>
              </div>

              <div>
                <span className="legend-dot pending-dot"></span>

                <div>
                  <strong>
                    {totalTasks -
                      completedTasks}
                  </strong>

                  <p>Remaining</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STUDY INSIGHT */}

        <section className="analytics-card insight-card">
          <div className="insight-icon">
            ✨
          </div>

          <p className="section-label">
            YOUR INSIGHT
          </p>

          <h2>
            Consistency beats intensity.
          </h2>

          <p>
            You have logged{" "}
            <strong>
              {totalStudyHours} hours
            </strong>{" "}
            of study time. Keep building a
            consistent routine and focus on
            completing your highest-priority
            tasks first.
          </p>

          <div className="insight-footer">
            <span>Study sessions tracked</span>

            <strong>
              {studySessions.length}
            </strong>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Analytics;