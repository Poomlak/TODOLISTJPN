// Todomain.js

import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import "./Todomain.css";
import NavbartodomainAndprofile from "../allnavbars/Navbartodomain&profile";

const Todomain = () => {
  const [diary, setDiary] = useState({
    diary_namebook: "",
    member_createdbook: "",
    member_lastupdatedbook: "",
  });

  // ฟังก์ชันเพื่อดึงข้อมูลไดอารีจากฐานข้อมูล
  const fetchDiary = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/diary");
      setDiary(response.data);
    } catch (error) {
      console.error("Error fetching diary:", error);
    }
  };

  // ฟังก์ชันเพื่ออัปเดต last updated timestamp
  const handleUpdateTimestamp = async () => {
    try {
      const response = await axios.put(
        "http://localhost:5000/api/diary/update-timestamp",
        {}, // ส่ง request ว่างๆ เพราะไม่มีข้อมูลที่ต้องส่ง
      );

      if (response.data) {
        setDiary((prevState) => ({
          ...prevState,
          member_lastupdatedbook: response.data.member_lastupdatedbook, // อัปเดต timestamp ใน state
        }));
      }
    } catch (error) {
      console.error("Error updating timestamp:", error);
    }
  };

  useEffect(() => {
    fetchDiary(); // ดึงข้อมูลเมื่อ component ถูก mount
  }, []);

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
                <h3>{diary.diary_namebook || "Diary Todo"}</h3> {/* ชื่อไดอารี */}
              </div>
              <div className="timestamp-container">
                <p>
                  Created: <i>{diary.member_createdbook || "N/A"}</i> {/* เวลาเริ่มสร้าง */}
                </p>
                <p>
                  Last update: <i>{diary.member_lastupdatedbook || "N/A"}</i> {/* เวลาอัปเดตล่าสุด */}
                </p>
              </div>
            </div>
            <div className="button-group-Todo">
              <button
                className="add-button-Todo"
                onClick={handleUpdateTimestamp} // อัปเดต last updated timestamp
              >
                +
              </button>
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
