import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Planner from "./pages/Planner";
import Analytics from "./pages/Analytics";
import Pomodoro from "./pages/Pomodoro";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/pomodoro" element={<Pomodoro />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;