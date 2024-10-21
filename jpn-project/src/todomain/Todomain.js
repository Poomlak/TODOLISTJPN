import React from "react";
import Swal from "sweetalert2";
import "./Todomain.css";
import NavbartodomainAndprofile from "../allnavbars/Navbartodomain&profile";

const Todomain = () => {
  const handleSelectDate = async () => {
    const { value: selectedDate } = await Swal.fire({
      title: "Select Date",
      html: '<input type="date" id="date-input" className="swal2-input" />',
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      showCancelButton: true,
      confirmButtonColor: "#4CAF50",
      cancelButtonColor: "#f44336",
      preConfirm: () => {
        const date = document.getElementById("date-input").value;
        if (!date) {
          Swal.showValidationMessage("Please select a date!");
        }
        return date;
      },
    });

    if (selectedDate) {
      Swal.fire(`You selected: ${selectedDate}`);
    }
  };

  return (
    <>
      <NavbartodomainAndprofile />
      <div className="center-content">
        <div className="todo-container">
          <div className="todo-card">
            <div>
              <div>
                <h3>Jame Diary Todo</h3>
              </div>
              <div className="timestamp-container">
                <p>
                  Created: <i>ตั้ว timestamp</i>
                </p>
                <p>
                  Last update: <i>ตั้ว timestamp</i>
                </p>
              </div>
            </div>
            <div className="button-group-Todo">
              <button className="add-button-Todo">+</button>
              <button className="date-button-Todo" onClick={handleSelectDate}>
                Select Date
              </button>
            </div>
          </div>
          <div className="add-task">Add some first book list Click +</div>
        </div>
      </div>
    </>
  );
};

export default Todomain;
