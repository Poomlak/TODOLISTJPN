import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import "./Todomain.css";
import { useLocation } from "react-router-dom";
import NavbartodomainAndprofile from "../allnavbars/Navbartodomain&profile";

const Todomain = () => {
  const location = useLocation();
  const { diaryName } = location.state || {};
  console.log('hello',diaryName);
  const [diary, setDiary] = useState({
    diary_namebook: "",
    member_createdbook: "",
    member_lastupdatedbook: "",
  });
  const [user, setUser] = useState({
    diary_namebook: "",
    member_createdbook: "",
    member_lastupdatedbook: "",
  });
  
  const [tasks, setTasks] = useState([]); // State สำหรับเก็บ tasks
  const [selectedDateTime, setSelectedDateTime] = useState(""); // State สำหรับวันที่และเวลาที่เลือก

  const fetchUser = async () => {
    const username = localStorage.getItem("username"); // ดึง username จาก localStorage
    const diaryName = location.state?.diaryName; // ดึง diaryName
  
    if (!diaryName) {
      console.error("diaryName is undefined");
      return;
    }
  
    try {
      const response = await axios.get("http://localhost:5000/api/userDiary", {
        params: { username, diaryName } // ส่ง username และ diaryName ใน params
      });
      setUser(response.data); // สมมติว่า response.data เป็น object
      console.log(response.data)
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };
  
  

  
  const fetchDiary = async () => {
    
    try {
      // ตรวจสอบว่า diaryName มีค่าหรือไม่
      if (diaryName) {
        const response = await axios.get(`http://localhost:5000/api/diary?diaryName=${diaryName}`);
        setDiary(response.data);
        console.log(response.data); // ส่งข้อมูลทั้งหมดที่พบ

      } else {
        console.error("diaryName is undefined");
      }
    } catch (error) {
      console.error("Error fetching diary:", error);
    }
  };
  
  useEffect(() => {
    
    if (diaryName) {
      fetchDiary();
      fetchUser();
      

    } else {
      console.error("diaryName is undefined in useEffect");
    }
    
  }, [diaryName]);
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleString("en-GB", {
      // ใช้รูปแบบวัน/เดือน/ปี
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // ฟังก์ชันเพื่ออัปเดต last updated timestamp
  const handleUpdateTimestamp = async () => {
    try {
      const response = await axios.put(
        "http://localhost:5000/api/diary/update-timestamp",
        {} // ส่ง request ว่างๆ เพราะไม่มีข้อมูลที่ต้องส่ง
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


  

  const handleSelectDateTime = async () => {
    const { value: dateTime } = await Swal.fire({
      title: "Select Date and Time",
      html: `
        <input type="date" id="date-input" class="swal2-input" />
        <input type="time" id="time-input" class="swal2-input" />
      `,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      showCancelButton: true,
      confirmButtonColor: "#4CAF50",
      cancelButtonColor: "#f44336",
      preConfirm: () => {
        const date = document.getElementById("date-input").value;
        const time = document.getElementById("time-input").value;
        if (!date || !time) {
          Swal.showValidationMessage("Please select both date and time!");
        }
        return `${date} ${time}`; // รวมวันที่และเวลา
      },
    });

    if (dateTime) {
      setSelectedDateTime(dateTime); // เก็บวันที่และเวลาที่เลือก
      Swal.fire(`You selected: ${dateTime}`);
    }
  };

  const handleAddTask = async () => {
    if (!selectedDateTime) {
      Swal.fire("Please select date and time first!"); // แจ้งเตือนหากยังไม่เลือกวันที่และเวลา
      return;
    }

    const { value: title } = await Swal.fire({
      title: "Enter Task Title",
      input: "text",
      inputPlaceholder: "Enter task title here...",
      showCancelButton: true,
      confirmButtonText: "Next",
      cancelButtonText: "Cancel",
      preConfirm: (inputValue) => {
        if (!inputValue) {
          Swal.showValidationMessage("Please enter a title!");
        }
        return inputValue;
      },
    });

    if (title) {
      const { value: detail } = await Swal.fire({
        title: "Enter Task Details",
        input: "text",
        inputPlaceholder: "Enter task details here...",
        showCancelButton: true,
        confirmButtonText: "Add Task",
        cancelButtonText: "Cancel",
        preConfirm: (inputValue) => {
          if (!inputValue) {
            Swal.showValidationMessage("Please enter task details!");
          }
          return inputValue;
        },
      });

      if (detail) {
        const { value: color } = await Swal.fire({
          title: "Select Task Importance Color",
          html: `
            <input type="color" id="color-input" style="width: 100%;" />
          `,
          confirmButtonText: "Confirm",
          cancelButtonText: "Cancel",
          preConfirm: () => {
            const colorValue = document.getElementById("color-input").value;
            if (!colorValue) {
              Swal.showValidationMessage("Please select a color!");
            }
            return colorValue;
          },
        });

        if (color) {
          const createdTime = new Date().toLocaleString(); // รับวันที่และเวลาปัจจุบัน
          const newTask = {
            title: title, // เพิ่มชื่อ task
            details: detail, // เพิ่มรายละเอียดของ task
            color: color, // เพิ่มสีที่เลือก
            created: createdTime, // ใช้เวลาที่สร้าง
            updated: selectedDateTime, // ใช้วันที่และเวลาที่เลือก
          };
          setTasks([...tasks, newTask]); // เพิ่ม Task ใหม่เข้าไปใน state
          Swal.fire(
            "Task Added!",
            `Your task: "${title}" has been added!`,
            "success"
          );
        }
      }
    }
  };

  const handleUpdateTask = async (index) => {
    const taskToUpdate = tasks[index];

    const { value: updatedTitle } = await Swal.fire({
      title: "Update Task Title",
      input: "text",
      inputValue: taskToUpdate.title,
      showCancelButton: true,
      confirmButtonText: "Update",
      cancelButtonText: "Cancel",
      preConfirm: (inputValue) => {
        if (!inputValue) {
          Swal.showValidationMessage("Please enter a title!");
        }
        return inputValue;
      },
    });

    if (updatedTitle) {
      const { value: updatedDetail } = await Swal.fire({
        title: "Update Task Details",
        input: "text",
        inputValue: taskToUpdate.details,
        showCancelButton: true,
        confirmButtonText: "Update",
        cancelButtonText: "Cancel",
        preConfirm: (inputValue) => {
          if (!inputValue) {
            Swal.showValidationMessage("Please enter task details!");
          }
          return inputValue;
        },
      });

      if (updatedDetail) {
        const { value: updatedColor } = await Swal.fire({
          title: "Select Task Importance Color",
          html: `
            <input type="color" id="color-input" value="${taskToUpdate.color}" style="width: 100%;" />
          `,
          confirmButtonText: "Confirm",
          cancelButtonText: "Cancel",
          preConfirm: () => {
            const colorValue = document.getElementById("color-input").value;
            if (!colorValue) {
              Swal.showValidationMessage("Please select a color!");
            }
            return colorValue;
          },
        });

        if (updatedColor) {
          const updatedTask = {
            ...taskToUpdate,
            title: updatedTitle,
            details: updatedDetail,
            color: updatedColor,
          };
          const updatedTasks = [...tasks];
          updatedTasks[index] = updatedTask; // แทนที่ task เดิม
          setTasks(updatedTasks);
          Swal.fire("Task Updated!", "Your task has been updated!", "success");
        }
      }
    }
  };

  const handleDeleteTask = (index) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedTasks = tasks.filter((_, i) => i !== index); // ลบ task ที่เลือก
        setTasks(updatedTasks);
        Swal.fire("Deleted!", "Your task has been deleted.", "success");
      }
    });
  };

  const handleApply = async () => {
   
    const diaryNamebook = diaryName; // เปลี่ยนเป็น username ที่คุณต้องการ
    const username = localStorage.getItem("username");
    
    try {
      const response = await axios.put(
        "http://localhost:5000/api/diary/update-timestamp",
        {
          data: {
            diary_namebook: diaryNamebook,
            diary_username: username,
          },
        }
      );
      console.log("testtt",response.data.member_lastupdatedbook)
      if (response.data) {
        setUser((prevState) => ({
          ...prevState,
          member_lastupdatedbook: response.data.member_lastupdatedbook 
        }));
        Swal.fire("Success!", "Timestamp has been updated!", "success");
      }
    } catch (error) {
      console.error("Error updating timestamp:", error.response ? error.response.data : error.message);
      Swal.fire("Error!", "Failed to update timestamp!", "error");
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
                <h3>{user.diary_namebook || "Diary Todo"}</h3>
              </div>
              <div className="timestamp-container">
                <p>
                  Created: <i>{formatDate(user.member_createdbook)}</i>
                </p>
                <p>
                  Last update: <i>{formatDate(user.member_lastupdatedbook)}</i>
                </p>
              </div>
            </div>
            <div className="button-group-Todo">
              <button className="add-button-Todo" onClick={handleAddTask}>
                +
              </button>
              <button className="date-button-Todo" onClick={handleSelectDateTime}>
                Select Date & Time
              </button>
            </div>
          </div>
          {tasks.map((task, index) => (
            <div className="todo-card-task" key={index} style={{ backgroundColor: task.color }}>
              <h3>{task.title}</h3>
              <div className="task-grid">
                <div className="details-container-task">
                  <p>
                    Details: <i>{task.details}</i>
                  </p>
                </div>
                <div></div>
                <div className="timestamp-container-task">
                  <p>
                    Created: <i>{task.created}</i>
                  </p>
                  <p>
                    Notification Time: <i>{task.updated}</i>
                  </p>
                </div>
                <div className="button-group-task">
                  <button onClick={() => handleUpdateTask(index)}>Update</button>
                  <button onClick={() => handleDeleteTask(index)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
          <div className="add-task">Add some first book list Click +</div>
        </div>
        <div className="button-apply" onClick={handleApply}>
          Apply
        </div>
      </div>
    </>
  );
};

export default Todomain;