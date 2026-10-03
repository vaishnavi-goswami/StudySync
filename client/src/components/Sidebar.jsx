import { NavLink } from "react-router-dom";

function Sidebar() {
  const navItems = [
    {
      path: "/",
      icon: "⌂",
      label: "Dashboard",
    },
    {
      path: "/planner",
      icon: "✓",
      label: "Study Planner",
    },
    {
      path: "/analytics",
      icon: "▥",
      label: "Analytics",
    },
    {
      path: "/pomodoro",
      icon: "◷",
      label: "Focus Timer",
    },
    {
      path: "/profile",
      icon: "○",
      label: "Profile",
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">S</div>

        <div>
          <h2>StudySync</h2>
          <span>Academic Command Center</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-title">MAIN MENU</p>

        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="streak-card">
          <div className="streak-icon">🔥</div>

          <div>
            <strong>7 Day Streak</strong>
            <p>Keep it going!</p>
          </div>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">V</div>

          <div>
            <strong>Student</strong>
            <span>Keep learning ✨</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;