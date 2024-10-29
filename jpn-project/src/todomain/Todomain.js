import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import "./Todomain.css";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Navbarprofile from "../allnavbars/Navbarprofile";

const Todomain = () => {
  const location = useLocation();
  const { diaryName } = location.state || {};
  console.log("hello", diaryName);

  // const [diary, setDiary] = useState({
  //   diary_namebook: "",
  //   member_createdbook: "",
  //   member_lastupdatedbook: "",
  // });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // เก็บสถานะการโหลด
  const [error, setError] = useState(null); // เก็บข้อผิดพลาด
  const [diaryData, setDiary] = useState([]);
  const [user, setUser] = useState({
    diary_namebook: "",
    member_createdbook: "",
    member_lastupdatedbook: "",
  });
  const goMenutodo = () => {
    navigate("/menutodo");
  };
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
        params: { username, diaryName }, // ส่ง username และ diaryName ใน params
      });
      setUser(response.data); // สมมติว่า response.data เป็น object
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchDiary = async () => {
    try {
      // ตรวจสอบว่า diaryName มีค่าหรือไม่
      if (diaryName) {
        const response = await axios.get(
          `http://localhost:5000/api/diary?diaryName=${diaryName}`
        );

        // ตรวจสอบว่ามีข้อมูลใน response หรือไม่
        if (response.data && response.data.length > 0) {
          setDiary(response.data);
          console.log(response.data); // ส่งข้อมูลทั้งหมดที่พบ
        } else {
          setError("ไม่พบข้อมูลสมุดบันทึก"); // ตั้งค่าข้อความเมื่อไม่มีข้อมูล
        }
      } else {
        console.error("diaryName is undefined");
        setError("ชื่อสมุดบันทึกไม่ถูกต้อง");
      }
    } catch (error) {
      console.error("Error fetching diary:", error);
      setError("เกิดข้อผิดพลาดในการดึงข้อมูล");
    } finally {
      setLoading(false); // เปลี่ยนสถานะการโหลด
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // เริ่มโหลดข้อมูล
      Swal.fire({
        title: "Loading...",
        text: "กำลังดึงข้อมูล...",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading(); // แสดง loading animation
        },
      });

      try {
        if (!diaryName) {
          console.error("diaryName is undefined in useEffect");
          setError("ชื่อสมุดบันทึกไม่ถูกต้อง");
          Swal.close(); // ปิด SweetAlert เมื่อมีข้อผิดพลาด
          return;
        }

        await fetchDiary();
        await fetchUser(); // แฟนชั่นนี้ยังต้องเช็คว่ามีการจัดการเหมือนกัน

        // ปิด SweetAlert เมื่อข้อมูลโหลดเสร็จ
        Swal.close();
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("เกิดข้อผิดพลาดในการดึงข้อมูล");
        Swal.close(); // ปิด SweetAlert เมื่อมีข้อผิดพลาด
      }
    };

    fetchData();
  }, [diaryName]);

  // เช็คสถานะการโหลด
  if (loading) {
    Swal.fire({
      title: "มีข้อผิดพลาด!",
      text: "ไม่พบข้อมูลสมุดบันทึก",
      icon: "warning", // ใช้ไอคอนตกใจ
      confirmButtonText: "OK",
    }).then((result) => {
      if (result.isConfirmed) {
        goMenutodo(); // เรียกฟังก์ชันเมื่อผู้ใช้กด OK
      }
    });
  }
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

  // const handleSelectDateTime = async () => {
  //   const { value: dateTime } = await Swal.fire({
  //     title: "Select Date and Time",
  //     html: `
  //       <input type="date" id="date-input" class="swal2-input" />
  //       <input type="time" id="time-input" class="swal2-input" />
  //     `,
  //     confirmButtonText: "Confirm",
  //     cancelButtonText: "Cancel",
  //     showCancelButton: true,
  //     confirmButtonColor: "#4CAF50",
  //     cancelButtonColor: "#f44336",
  //     preConfirm: () => {
  //       const date = document.getElementById("date-input").value;
  //       const time = document.getElementById("time-input").value;
  //       if (!date || !time) {
  //         Swal.showValidationMessage("Please select both date and time!");
  //       }
  //       return `${date} ${time}`; // รวมวันที่และเวลา
  //     },
  //   });

  //   if (dateTime) {
  //     setSelectedDateTime(dateTime); // เก็บวันที่และเวลาที่เลือก
  //     Swal.fire(`You selected: ${dateTime}`);
  //   }
  // };

  // const handleAddTask = async () => {
  //   if (!selectedDateTime) {
  //     Swal.fire("Please select date and time first!"); // แจ้งเตือนหากยังไม่เลือกวันที่และเวลา
  //     return;
  //   }

  //   const { value: title } = await Swal.fire({
  //     title: "Enter Task Title",
  //     input: "text",
  //     inputPlaceholder: "Enter task title here...",
  //     showCancelButton: true,
  //     confirmButtonText: "Next",
  //     cancelButtonText: "Cancel",
  //     preConfirm: (inputValue) => {
  //       if (!inputValue) {
  //         Swal.showValidationMessage("Please enter a title!");
  //       }
  //       return inputValue;
  //     },
  //   });

  //   if (title) {
  //     const { value: detail } = await Swal.fire({
  //       title: "Enter Task Details",
  //       input: "text",
  //       inputPlaceholder: "Enter task details here...",
  //       showCancelButton: true,
  //       confirmButtonText: "Add Task",
  //       cancelButtonText: "Cancel",
  //       preConfirm: (inputValue) => {
  //         if (!inputValue) {
  //           Swal.showValidationMessage("Please enter task details!");
  //         }
  //         return inputValue;
  //       },
  //     });

  //     if (detail) {
  //       const { value: color } = await Swal.fire({
  //         title: "Select Task Importance Color",
  //         html: `
  //           <div style="text-align: center;">
  //             <label for="color-input" style="display: block; margin-bottom: 10px;">Please pick a color:</label>
  //             <input type="color" id="color-input" style="width: 50%; height: 50px; border: none; cursor: pointer;"/>
  //             <p style="margin-top: 10px; color: grey;">This color will be used to represent task importance.</p>
  //           </div>
  //         `,
  //         confirmButtonText: "Confirm",
  //         cancelButtonText: "Cancel",
  //         showCancelButton: true,
  //         preConfirm: () => {
  //           const colorValue = document.getElementById("color-input").value;
  //           if (!colorValue) {
  //             Swal.showValidationMessage("Please select a color!");
  //           }
  //           return colorValue;
  //         },
  //       });

  //       if (color) {
  //         const createdTime = new Date().toLocaleString(); // รับวันที่และเวลาปัจจุบัน
  //         const newTask = {
  //           title: title, // เพิ่มชื่อ task
  //           details: detail, // เพิ่มรายละเอียดของ task
  //           color: color, // เพิ่มสีที่เลือก
  //           created: createdTime, // ใช้เวลาที่สร้าง
  //           updated: selectedDateTime, // ใช้วันที่และเวลาที่เลือก
  //         };
  //         setTasks([...tasks, newTask]); // เพิ่ม Task ใหม่เข้าไปใน state
  //         Swal.fire(
  //           "Task Added!",
  //           `Your task: "${title}" has been added!`,
  //           "success"
  //         );
  //       }
  //     }
  //   }
  // };

  const handleUpdateTask = async (index) => {
    const taskToUpdate = diaryData[index]; // ใช้ diaryData เพื่อดึงข้อมูล Task

    if (!taskToUpdate) {
      console.error("Task not found");
      return;
    }

    // สร้าง HTML ที่กำหนดเองพร้อม input หลายตัว
    const { value: updatedFields } = await Swal.fire({
      title: "Update Task",
      html: `
        <label for="swal-input1" style="display: block; margin: 5px 0;">Title:</label>
        <input id="swal-input1" class="swal2-input" placeholder="Task Title" value="${taskToUpdate.diary_todoTopic}">
    
        <label for="swal-input2" style="display: block; margin: 5px 0;">Detail:</label>
        <input id="swal-input2" class="swal2-input" placeholder="Task Details" value="${taskToUpdate.diary_todo}">
    
        <label for="swal-input3" style="display: block; margin: 5px 0;">Time and Date:</label>
        <input type="datetime-local" id="swal-input3" class="swal2-input" value="${taskToUpdate.diary_reminder}">
    
        <label for="swal-input4" style="display: block; margin: 5px 0;">Color:</label>
        <input type="color" id="swal-input4" class="swal2-input" value="${taskToUpdate.diary_color}" style="width: 50%; height: 50px; border: none; cursor: pointer; margin-top: 10px;">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Update",
      preConfirm: () => {
        const title = document.getElementById("swal-input1").value;
        const details = document.getElementById("swal-input2").value;
        const reminder = document.getElementById("swal-input3").value;
        const color = document.getElementById("swal-input4").value;

        if (!title || !details || !reminder || !color) {
          Swal.showValidationMessage("Please fill in all fields!");
        }
        console.log(reminder);
        return { title, details, reminder, color }; // คืนค่าที่รวมทุกค่า
      },
    });

    if (updatedFields) {
      // แปลงค่า reminder จาก '2024-10-13T21:00' เป็นรูปแบบที่ต้องการ
      const reminder = document.getElementById("swal-input3").value;

      const UpdateTime = new Date(reminder);

      // แปลงเวลาให้เป็นรูปแบบที่ต้องการ
      const year = UpdateTime.getFullYear();
      const month = String(UpdateTime.getMonth() + 1).padStart(2, "0"); // เพิ่ม 1 เพราะ months เริ่มที่ 0
      const day = String(UpdateTime.getDate()).padStart(2, "0");
      const hours = String(UpdateTime.getHours()).padStart(2, "0");
      const minutes = String(UpdateTime.getMinutes()).padStart(2, "0");
      const seconds = String(UpdateTime.getSeconds()).padStart(2, "0");

      const formattedUpdateTime = `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;

      const updatedTask = {
        ...taskToUpdate,
        diary_todoTopic: updatedFields.title,
        diary_todo: updatedFields.details,
        diary_reminder: formattedUpdateTime,
        diary_color: updatedFields.color,
        diary_textColor: getContrastYIQ(updatedFields.color), // เพิ่มสีข้อความ
      };

      console.log("Updated Task:", updatedTask);

      // เรียกใช้ API อัพเดต
      try {
        const response = await axios.put(
          "http://localhost:5000/api/diarylist/update",
          updatedTask
        );

        if (response.status === 200) {
          // เช็คสถานะว่าเป็น 200
          const updatedDiaryData = [...diaryData];
          updatedDiaryData[index] = updatedTask; // แทนที่ Task ที่ตำแหน่งที่กำหนด
          setDiary(updatedDiaryData); // อัพเดต state

          Swal.fire("Task Updated!", "Your task has been updated!", "success");
        } else {
          // ถ้าสถานะไม่เป็น 200 ให้แสดงข้อผิดพลาด
          Swal.fire(
            "Update Failed!",
            "There was an error updating the task.",
            "error"
          );
        }
      } catch (error) {
        const updatedDiaryData = [...diaryData];
        updatedDiaryData[index] = updatedTask; // แทนที่ Task ที่ตำแหน่งที่กำหนด
        setDiary(updatedDiaryData); // อัพเดต state
        handleApply();
        console.error(
          "Error updating task:",
          error.response ? error.response.data : error.message
        );
        Swal.fire("Task Updated!", "Your task has been updated!", "success");
      }
    }
  };

  const handleDeleteTask = async (
    diary_id,
    diary_namebook,
    diary_todoTopic
  ) => {
    if (!diary_id) {
      console.error("Invalid diary ID:", diary_id);
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            "http://localhost:5000/api/diarylist/delete",
            {
              data: { diary_id, diary_namebook, diary_todoTopic },
            }
          );

          console.log("Response from server:", response.data);
          const updatedDiaryData = diaryData.filter(
            (task) => task.diary_id !== diary_id
          );
          setDiary(updatedDiaryData); // Update the state with the new array
          if (response.status === 200) {
            // Reload the page after successful deletion
            Swal.fire("Deleted!", "Your task has been deleted.", "success");
          }
        } catch (error) {
          console.error(
            "Error deleting task:",
            error.response ? error.response.data : error.message
          );
          Swal.fire("Error!", "Failed to delete task!", "error");
        }
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
      console.log("testtt", response.data.member_lastupdatedbook);
      if (response.data) {
        setUser((prevState) => ({
          ...prevState,
          member_lastupdatedbook: response.data.member_lastupdatedbook,
        }));
        Swal.fire("Success!", "Timestamp has been updated!", "success");
      }
    } catch (error) {
      console.error(
        "Error updating timestamp:",
        error.response ? error.response.data : error.message
      );
      Swal.fire("Error!", "Failed to update timestamp!", "error");
    }
  };

  const addNewDiary = (newDiary) => {
    // ใช้การกระจายเพื่อรวมข้อมูลเก่าและข้อมูลใหม่
    setDiary((prevDiaries) => [...prevDiaries, newDiary]);
  };

  const handleAddTaskWithDateTime = async () => {
    // ขั้นตอนแรก: ให้ผู้ใช้เลือกวันที่และเวลา
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

        // เช็คว่ามีการเลือกวันและเวลาหรือไม่
        if (!date || !time) {
          Swal.showValidationMessage("Please select both date and time!");
          return; // หยุดการประมวลผล
        }

        // แปลงรูปแบบวันที่และเวลา
        const formattedDateTime = `${date}T${time}`; // ใช้ T เพื่อรวมวันและเวลาในรูปแบบ ISO
        const dateTimeObject = new Date(formattedDateTime);

        // แปลงเป็นรูปแบบที่ต้องการ
        const year = dateTimeObject.getFullYear();
        const month = String(dateTimeObject.getMonth() + 1).padStart(2, "0"); // เพิ่ม 1 เพราะ months เริ่มที่ 0
        const day = String(dateTimeObject.getDate()).padStart(2, "0");
        const hours = String(dateTimeObject.getHours()).padStart(2, "0");
        const minutes = String(dateTimeObject.getMinutes()).padStart(2, "0");
        const seconds = String(dateTimeObject.getSeconds()).padStart(2, "0");

        // คืนค่าตามรูปแบบที่ต้องการ
        const formattedResult = `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
        console.log(`Selected Date and Time: ${formattedResult}`); // แสดงผลใน console
        return formattedResult; // ส่งคืนวันที่และเวลาในรูปแบบที่ต้องการ
      },
    });

    // ถ้าเลือกวันที่และเวลาแล้ว
    if (dateTime) {
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
        console.log(`Task Title: ${title}`);

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
          console.log(`Task Details: ${detail}`);

          const { value: color } = await Swal.fire({
            title: "Select Task Importance Color",
            html: `
            <div style="text-align: center;">
                <label for="color-input" style="display: block; margin-bottom: 10px;">Please pick a color:</label>
                <input type="color" id="color-input" style="width: 50%; height: 50px; border: none; cursor: pointer;"/>
                <p style="margin-top: 10px; color: grey;">This color will be used to represent task importance.</p>
            </div>
        `,
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
            showCancelButton: true,
            preConfirm: () => {
              const colorValue = document.getElementById("color-input").value;
              if (!colorValue) {
                Swal.showValidationMessage("Please select a color!");
              }
              return colorValue;
            },
          });
          console.log("hello หนังสือชื่อไรครับ?", user.diary_namebook);
          if (color) {
            console.log(`Task Color: ${color}`);
            const createdTime = formatDate(new Date()); // รับวันที่และเวลาปัจจุบันในรูปแบบ ISO
            const diaryName = user.diary_namebook; // แทนที่ด้วยชื่อไดอารี่ของคุณ
            console.log("สมุดไร", diaryName);

            // สร้างอ็อบเจ็กต์ใหม่สำหรับ Task
            const newTask = {
              diary_todoTopic: title,
              diary_todo: detail,
              diary_color: color,
              diary_reminder: dateTime,
              diary_namebook: diaryName,
              diary_created: createdTime,
              diary_textColor: getContrastYIQ(color), // เพิ่มสีข้อความ
            };
            // ส่งข้อมูลไปยัง API
            try {
              const response = await axios.post(
                "http://localhost:5000/api/diarylist/add",
                newTask
              );

              console.log(response);
              if (response.status === 201) {
                setTasks([...tasks, newTask]); // เพิ่ม Task ใหม่เข้าไปใน state
                addNewDiary(...tasks, newTask);
                Swal.fire(
                  "Task Added!",
                  `Your task: "${title}" has been added!`,
                  "success"
                );
              }
            } catch (error) {
              console.error("Error adding task:", error);
              Swal.fire("Error!", "Failed to add task!", "error");
            }
          }
        }
      }
    }
  };
  const getContrastYIQ = (hexcolor) => {
    // ลบ # ออกถ้ามี
    hexcolor = hexcolor.replace(/#/g, "");

    // แปลงเป็น RGB
    const r = parseInt(hexcolor.substr(0, 2), 16);
    const g = parseInt(hexcolor.substr(2, 2), 16);
    const b = parseInt(hexcolor.substr(4, 2), 16);

    // ใช้สูตร YIQ เพื่อคำนวณความสว่าง
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? "black" : "white"; // ถ้า YIQ >= 128 จะใช้สีดำ
  };

  return (
    <>
      <Navbarprofile />
      <div className="center-content">
        <div className="todo-container">
          <div className="todo-card">
            <div>
              <div>
                <h3>{user.diary_namebook || "No Diary Todo Found"}</h3>
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
            <button
              className="add-button-Todo"
              onClick={handleAddTaskWithDateTime}
            >
              Add Task
            </button>
          </div>
          <div className="scrollable-tasks">
            {diaryData.map((item, index) => (
              <div
                className="todo-card-task"
                key={`${item.diary_id}-${index}`}
                style={{ backgroundColor: item.diary_color }}
              >
                <h3 style={{ color: item.diary_textColor }}>
                  {item.diary_todoTopic || "No Diary Todo Found"}
                </h3>
                <div className="task-grid">
                  <div className="details-container-task">
                    <div className="p-1">
                      Details: <i>{item.diary_todo}</i>
                    </div>
                    <p>
                      Reminder: <i>{item.diary_reminder}</i>
                    </p>
                  </div>
                  <div></div>
                  <div className="timestamp-container-task">
                    <p>
                      Created: <i>{item.diary_created}</i>
                    </p>
                  </div>
                  <div className="button-group-task">
                    <button onClick={() => handleUpdateTask(index)}>
                      Update
                    </button>
                    <button
                      onClick={() =>
                        handleDeleteTask(
                          item.diary_id,
                          item.diary_namebook,
                          item.diary_todoTopic
                        )
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {/* แสดงข้อความนี้เฉพาะเมื่อไม่มีสมุดบันทึก */}
            {diaryData.length === 0 && (
              <div className="add-task">
                Add some first book list Click Red button
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Todomain;
