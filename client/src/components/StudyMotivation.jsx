import React from "react";

class StudyMotivation extends React.Component {
  render() {
    return (
      <div className="motivation-card">
        <div className="motivation-icon">✨</div>

        <div>
          <p className="motivation-label">TODAY'S MOTIVATION</p>

          <h3>Small progress is still progress.</h3>

          <p className="motivation-text">
            Stay consistent, focus on one task at a time, and let your
            progress build up.
          </p>
        </div>
      </div>
    );
  }
}

export default StudyMotivation;