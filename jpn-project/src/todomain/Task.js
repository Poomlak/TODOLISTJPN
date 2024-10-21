import React from "react";

const Task = ({ created, updated }) => {
  return (
    <div className="todo-card">
      <h3>Jame Diary Todo</h3>
      <div className="timestamp-container">
        <p>
          Created: <i>{created}</i>
        </p>
        <p>
          Last update: <i>{updated}</i>
        </p>
      </div>
    </div>
  );
};

export default Task;
