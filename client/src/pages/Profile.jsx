import { useState } from "react";

function Profile() {
  const [profile, setProfile] = useState({
    name: "Vaishnavi",
    email: "student@studysync.com",
    course: "Computer Science",
    semester: "Semester 5",
    goal: "Maintain an 8.5+ GPA",
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile((currentProfile) => ({
      ...currentProfile,
      [name]: value,
    }));

    setSaved(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  return (
    <div className="profile-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">YOUR SPACE • YOUR GOALS</p>

          <h1>
            My <span>Profile</span>
          </h1>

          <p className="header-description">
            Manage your academic information and personal goals.
          </p>
        </div>
      </header>

      <div className="profile-layout">
        <section className="profile-card">
          <div className="profile-cover"></div>

          <div className="profile-main">
            <div className="large-avatar">V</div>

            <h2>{profile.name}</h2>

            <p>{profile.email}</p>

            <div className="profile-badges">
              <span>🎓 Student</span>
              <span>🔥 7 Day Streak</span>
            </div>
          </div>

          <div className="profile-stats">
            <div>
              <strong>12</strong>
              <span>Tasks Completed</span>
            </div>

            <div>
              <strong>7</strong>
              <span>Day Streak</span>
            </div>

            <div>
              <strong>86%</strong>
              <span>Focus Score</span>
            </div>
          </div>
        </section>

        <section className="profile-form-card">
          <div className="card-heading">
            <div className="heading-icon">✎</div>

            <div>
              <p className="section-label">PERSONAL DETAILS</p>
              <h2>Academic Profile</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>

              <input
                id="name"
                name="name"
                type="text"
                value={profile.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>

              <input
                id="email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="course">Course</label>

                <input
                  id="course"
                  name="course"
                  type="text"
                  value={profile.course}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="semester">Semester</label>

                <select
                  id="semester"
                  name="semester"
                  value={profile.semester}
                  onChange={handleChange}
                >
                  <option>Semester 1</option>
                  <option>Semester 2</option>
                  <option>Semester 3</option>
                  <option>Semester 4</option>
                  <option>Semester 5</option>
                  <option>Semester 6</option>
                  <option>Semester 7</option>
                  <option>Semester 8</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="goal">Academic Goal</label>

              <input
                id="goal"
                name="goal"
                type="text"
                value={profile.goal}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="primary-button">
              Save Changes
              <span>✓</span>
            </button>

            {saved && (
              <div className="form-message success">
                Profile updated successfully!
              </div>
            )}
          </form>
        </section>

        <section className="profile-goal-card">
          <div className="goal-icon">🎯</div>

          <p className="section-label">YOUR CURRENT GOAL</p>

          <h2>{profile.goal}</h2>

          <p>
            Stay consistent with your study sessions and
            keep making small improvements every day.
          </p>

          <div className="goal-progress">
            <div className="goal-progress-header">
              <span>Progress</span>
              <strong>72%</strong>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: "72%" }}
              ></div>
            </div>
          </div>

          <div className="goal-footer">
            <span>Keep going!</span>
            <span>28% to go</span>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Profile;