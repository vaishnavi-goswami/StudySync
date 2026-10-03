const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

/* =====================================================
   TASKS
   ===================================================== */

let tasks = [
  {
    id: 1,
    title: "Complete React Assignment",
    subject: "Full Stack Development",
    priority: "High",
    status: "Pending",
    dueDate: "2026-10-05",
  },
  {
    id: 2,
    title: "Study Probability",
    subject: "Mathematics",
    priority: "Medium",
    status: "Completed",
    dueDate: "2026-10-04",
  },
];

let nextTaskId = 3;

/* =====================================================
   EXAMS
   ===================================================== */

let exams = [
  {
    id: 1,
    subject: "Full Stack Development",
    date: "2026-10-17",
    preparation: 68,
  },
  {
    id: 2,
    subject: "Cloud Platforms",
    date: "2026-10-22",
    preparation: 52,
  },
];

let nextExamId = 3;

/* =====================================================
   STUDY SESSIONS
   ===================================================== */

let studySessions = [
  {
    id: 1,
    subject: "Full Stack Development",
    duration: 60,
    date: "2026-10-02",
  },
  {
    id: 2,
    subject: "Mathematics",
    duration: 45,
    date: "2026-10-03",
  },
];

let nextSessionId = 3;

/* =====================================================
   HOME
   ===================================================== */

app.get("/", (req, res) => {
  res.json({
    message: "StudySync API is running!",
    version: "1.0",
    endpoints: [
      "/api/tasks",
      "/api/exams",
      "/api/study-sessions",
    ],
  });
});

/* =====================================================
   TASK ROUTES
   ===================================================== */

// GET all tasks
app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

// GET one task
app.get("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  res.json(task);
});

// CREATE task
app.post("/api/tasks", (req, res) => {
  const {
    title,
    subject,
    priority,
    dueDate,
  } = req.body;

  if (!title || !subject || !priority || !dueDate) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const newTask = {
    id: nextTaskId++,
    title,
    subject,
    priority,
    status: "Pending",
    dueDate,
  };

  tasks.push(newTask);

  res.status(201).json(newTask);
});

// UPDATE task
app.put("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const taskIndex = tasks.findIndex(
    (task) => task.id === id
  );

  if (taskIndex === -1) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...req.body,
    id,
  };

  res.json(tasks[taskIndex]);
});

// DELETE task
app.delete("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const taskExists = tasks.some(
    (task) => task.id === id
  );

  if (!taskExists) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  tasks = tasks.filter(
    (task) => task.id !== id
  );

  res.json({
    message: "Task deleted successfully",
  });
});

/* =====================================================
   EXAM ROUTES
   ===================================================== */

// GET all exams
app.get("/api/exams", (req, res) => {
  res.json(exams);
});

// GET one exam
app.get("/api/exams/:id", (req, res) => {
  const id = Number(req.params.id);

  const exam = exams.find(
    (exam) => exam.id === id
  );

  if (!exam) {
    return res.status(404).json({
      message: "Exam not found",
    });
  }

  res.json(exam);
});

// CREATE exam
app.post("/api/exams", (req, res) => {
  const {
    subject,
    date,
    preparation,
  } = req.body;

  if (!subject || !date) {
    return res.status(400).json({
      message: "Subject and date are required",
    });
  }

  const newExam = {
    id: nextExamId++,
    subject,
    date,
    preparation: Number(preparation) || 0,
  };

  exams.push(newExam);

  res.status(201).json(newExam);
});

// UPDATE exam
app.put("/api/exams/:id", (req, res) => {
  const id = Number(req.params.id);

  const examIndex = exams.findIndex(
    (exam) => exam.id === id
  );

  if (examIndex === -1) {
    return res.status(404).json({
      message: "Exam not found",
    });
  }

  exams[examIndex] = {
    ...exams[examIndex],
    ...req.body,
    id,
  };

  res.json(exams[examIndex]);
});

// DELETE exam
app.delete("/api/exams/:id", (req, res) => {
  const id = Number(req.params.id);

  const examExists = exams.some(
    (exam) => exam.id === id
  );

  if (!examExists) {
    return res.status(404).json({
      message: "Exam not found",
    });
  }

  exams = exams.filter(
    (exam) => exam.id !== id
  );

  res.json({
    message: "Exam deleted successfully",
  });
});

/* =====================================================
   STUDY SESSION ROUTES
   ===================================================== */

// GET all study sessions
app.get("/api/study-sessions", (req, res) => {
  res.json(studySessions);
});

// GET one study session
app.get("/api/study-sessions/:id", (req, res) => {
  const id = Number(req.params.id);

  const session = studySessions.find(
    (session) => session.id === id
  );

  if (!session) {
    return res.status(404).json({
      message: "Study session not found",
    });
  }

  res.json(session);
});

// CREATE study session
app.post("/api/study-sessions", (req, res) => {
  const {
    subject,
    duration,
    date,
  } = req.body;

  if (!subject || !duration || !date) {
    return res.status(400).json({
      message:
        "Subject, duration and date are required",
    });
  }

  const newSession = {
    id: nextSessionId++,
    subject,
    duration: Number(duration),
    date,
  };

  studySessions.push(newSession);

  res.status(201).json(newSession);
});

// DELETE study session
app.delete(
  "/api/study-sessions/:id",
  (req, res) => {
    const id = Number(req.params.id);

    const sessionExists = studySessions.some(
      (session) => session.id === id
    );

    if (!sessionExists) {
      return res.status(404).json({
        message: "Study session not found",
      });
    }

    studySessions = studySessions.filter(
      (session) => session.id !== id
    );

    res.json({
      message:
        "Study session deleted successfully",
    });
  }
);

/* =====================================================
   START SERVER
   ===================================================== */

app.listen(PORT, () => {
  console.log(
    `StudySync server running at http://localhost:${PORT}`
  );
});