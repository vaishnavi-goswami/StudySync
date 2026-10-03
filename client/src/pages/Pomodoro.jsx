import { useEffect, useState } from "react";

function Pomodoro() {
  const [mode, setMode] = useState("Focus");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [message, setMessage] = useState("");

  const modes = {
    Focus: 25 * 60,
    "Short Break": 5 * 60,
    "Long Break": 15 * 60,
  };

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((currentTime) => {
        if (currentTime <= 1) {
          setIsRunning(false);

          if (mode === "Focus") {
            completeFocusSession();
          }

          return 0;
        }

        return currentTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, mode]);

  const completeFocusSession = async () => {
    setSessions((current) => current + 1);

    try {
      const response = await fetch(
        "http://localhost:5000/api/study-sessions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subject: "Focused Study",
            duration: 25,
            date: new Date()
              .toISOString()
              .split("T")[0],
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(
          `Focus session saved! Session #${data.id} added to your study history.`
        );
      } else {
        setMessage(
          data.message || "Unable to save session."
        );
      }
    } catch (error) {
      console.error(
        "Error saving study session:",
        error
      );

      setMessage(
        "Focus session completed, but the server could not save it."
      );
    }

    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  const handleStartPause = () => {
    setIsRunning((current) => !current);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(modes[mode]);
    setMessage("");
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(modes[newMode]);
    setMessage("");
  };

  const minutes = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, "0");

  const seconds = (timeLeft % 60)
    .toString()
    .padStart(2, "0");

  return (
    <div className="pomodoro-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">
            FOCUS • STUDY • REPEAT
          </p>

          <h1>
            Focus <span>Timer</span>
          </h1>

          <p className="header-description">
            Use the Pomodoro technique to stay
            focused and make your study sessions
            more productive.
          </p>
        </div>

        <div className="planner-summary">
          <strong>{sessions}</strong>
          <span>Sessions Today</span>
        </div>
      </header>

      <section className="timer-card">
        <div className="timer-mode">
          {Object.keys(modes).map((item) => (
            <button
              key={item}
              className={
                mode === item ? "active" : ""
              }
              onClick={() =>
                handleModeChange(item)
              }
            >
              {item}
            </button>
          ))}
        </div>

        <div className="timer-display">
          {minutes}:{seconds}
        </div>

        <p className="timer-status">
          {isRunning
            ? mode === "Focus"
              ? "Stay focused. You've got this!"
              : "Take a proper break and recharge."
            : timeLeft === 0
            ? "Session complete!"
            : "Ready when you are."}
        </p>

        <div className="timer-controls">
          <button
            className="timer-button"
            onClick={handleStartPause}
          >
            {isRunning ? "Pause" : "Start Focus"}
          </button>

          <button
            className="timer-button timer-reset-button"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>

        {message && (
          <div className="form-message">
            {message}
          </div>
        )}

        <div className="session-info">
          {sessions === 0
            ? "Complete a 25-minute focus session to record your first study session."
            : `You've completed ${sessions} focus ${
                sessions === 1
                  ? "session"
                  : "sessions"
              } in this timer.`}
        </div>
      </section>

      <section className="focus-technique-card">
        <div>
          <p className="section-label">
            THE POMODORO TECHNIQUE
          </p>

          <h2>
            Work with your attention, not against
            it.
          </h2>
        </div>

        <div className="pomodoro-steps">
          <div>
            <strong>01</strong>
            <span>25 min</span>
            <p>Focused study</p>
          </div>

          <div>
            <strong>02</strong>
            <span>5 min</span>
            <p>Short break</p>
          </div>

          <div>
            <strong>03</strong>
            <span>Repeat</span>
            <p>Build momentum</p>
          </div>

          <div>
            <strong>04</strong>
            <span>15 min</span>
            <p>Long break</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Pomodoro;