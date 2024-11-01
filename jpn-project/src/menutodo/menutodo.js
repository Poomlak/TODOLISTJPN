import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "./menutodo.css";
import Navbarmenutodo from "./../allnavbars/Navbarmenutodo";
import logo from "../allnavbars/jpn_logo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MySwal = withReactContent(Swal);

const Menutodo = () => {
  const [list, setList] = useState([]); // Initialize with an empty array
  const [error, setError] = useState(null); // State for error handling
  const navigate = useNavigate();

  const username = localStorage.getItem("username");

  const fetchDiary = async () => {
    try {
      const token = localStorage.getItem("token"); // ดึง token จาก localStorage
      const response = await axios.get(
        `http://localhost:5000/api/diary/${username}`,
        {
          data: { token }, // ส่ง token ไปใน body
        }
      );

      setList(response.data);
    } catch (error) {
      console.error("Error fetching diary:", error);
      setError("Error fetching diary");
    }
  };

  // Format time function
  const formatTime = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
  };

  // Authentication check and data fetching
  useEffect(() => {
    // เพิ่มการตรวจสอบ authentication
    const checkAuth = () => {
      if (!username) {
        Swal.fire({
          icon: "error",
          title: "กรุณาเข้าสู่ระบบ",
          text: "คุณต้องเข้าสู่ระบบก่อนเข้าถึงหน้านี้",
          confirmButtonText: "ตกลง",
        }).then((result) => {
          navigate("/signin");
        });
        return;
      }
    };

    checkAuth();
    if (username) {
      fetchDiary();
    }
  }, [username, navigate]);

  // Navigate to "/todomain"
  const goTodomain = (index, diaryName) => {
    navigate(`/todomain/${index}`, { state: { diaryName } });
  };

  // Handle adding a new list
  const handleCreate = async () => {
    const username = localStorage.getItem("username");

    const { value: listName } = await MySwal.fire({
      html: (
        <div>
          <h4>กรอกชื่อสมุดรายการ:</h4>
          <input
            id="list-name"
            className="swal2-input"
            placeholder="ชื่อสมุดรายการ"
          />
        </div>
      ),
      imageUrl: logo,
      imageWidth: 80,
      imageHeight: 80,
      imageAlt: "Custom image",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#4CAF50",
      cancelButtonColor: "#f44336",
      preConfirm: () => {
        const inputVal = document.getElementById("list-name").value;
        if (!inputVal) {
          Swal.showValidationMessage("กรุณากรอกชื่อสมุดรายการ!");
        }
        return inputVal;
      },
    });

    if (listName && username) {
      try {
        const time_create=formatTime(new Date());
        const time_update=formatTime(new Date());
        await axios.post("http://localhost:5000/api/diary/create", {
          diaryName: listName,
          username: username,
          member_createdbook: time_create,
          member_lastupdatedbook: time_update,
        });

        const newItem = {
          diary_namebook: listName,
          member_createdbook: formatTime(new Date()),
          member_lastupdatedbook: formatTime(new Date()),
        };
        setList((prevList) => [...prevList, newItem]);

        Swal.fire({
          title: `สมุดรายการ: ${listName}`,
          text: "บันทึกเรียบร้อย!",
          icon: "success",
          customClass: {
            popup: "custom-success-popup",
          },
          confirmButtonColor: "#4CAF50",
        });
      } catch (error) {
        console.error("Error creating diary:", error);
        Swal.fire({
          title: "เกิดข้อผิดพลาดในการสร้างสมุดรายการ",
          icon: "error",
        });
      }
    }
  };

  // Handle renaming an item
  const handleRename = async (index) => {
    const oldName = list[index].diary_namebook;
    const username = localStorage.getItem("username");

    const { value: newName } = await MySwal.fire({
      title: "เปลี่ยนชื่อสมุดรายการ",
      input: "text",
      inputValue: oldName,
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#4CAF50",
      cancelButtonColor: "#f44336",
      inputValidator: (value) => {
        if (!value) {
          return "กรุณากรอกชื่อใหม่!";
        }
      },
    });

    if (newName && username) {
      try {
        await axios.put(`http://localhost:5000/api/diary/update/${oldName}`, {
          newName,
          username,
        });

        const updatedList = list.map((item, idx) =>
          idx === index
            ? {
                ...item,
                diary_namebook: newName,
                member_lastupdatedbook: formatTime(new Date()),
              }
            : item
        );
        setList(updatedList);

        Swal.fire({
          title: "เปลี่ยนชื่อสำเร็จ",
          icon: "success",
        });
      } catch (error) {
        console.error("Error renaming diary:", error);
        Swal.fire({
          title: "เกิดข้อผิดพลาดในการเปลี่ยนชื่อ",
          icon: "error",
        });
      }
    } else {
      console.error("Missing username or new name.");
    }
  };

  // Handle deleting an item
  const handleDelete = async (index) => {
    const itemName = list[index].diary_namebook;
    const username = localStorage.getItem("username");

    const result = await MySwal.fire({
      title: `ต้องการลบ "${itemName}" หรือไม่?`,
      imageUrl: logo,
      imageWidth: 80,
      imageHeight: 80,
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#4CAF50",
      cancelButtonColor: "#f44336",
    });

    if (result.isConfirmed && username) {
      try {
        await axios.delete("http://localhost:5000/api/diary/delete", {
          data: {
            name: itemName,
            username,
          },
        });

        const updatedList = list.filter((_, i) => i !== index);
        setList(updatedList);
        Swal.fire("ลบสำเร็จ!", "", "success");
      } catch (error) {
        console.error("Error deleting diary:", error);
        Swal.fire({
          title: "เกิดข้อผิดพลาดในการลบ",
          icon: "error",
        });
      }
    } else {
      console.error("No username or delete confirmation provided.");
    }
  };

  // ถ้าไม่มี username ให้แสดงหน้าว่างระหว่างที่ redirect
  if (!username) {
    return null;
  }

  return (
    <div className="menu-container">
      <Navbarmenutodo />
      <div className="list-header">
        <div className="list-title">
          List-Book : <span className="username">{username}</span>
        </div>

        <button className="main-create" onClick={handleCreate}>
          Create List
        </button>
      </div>
      <div className="list-container">
        <div className="list-wrappermenu">
          <div className="button-container">
            {list.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon" onClick={handleCreate}></div>
                <h3 className="empty-title">ยังไม่มีสมุดบันทึกในขณะนี้</h3>
                <p className="empty-subtitle">
                  เริ่มต้นสร้างสมุดบันทึกใหม่เพื่อจดบันทึกสิ่งที่ต้องทำกันเถอะ!
                </p>
                <div className="empty-dots">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              </div>
            ) : (
              list.map((item, index) => (
                <div key={index} className="list-item">
                  <div
                    className="list-content"
                    onClick={() => goTodomain(index, item.diary_namebook)}
                    style={{ cursor: "pointer" }}
                  >
                    <h3>{item.diary_namebook}</h3>
                    <p>Created: {item.member_createdbook}</p>
                    <p>Last Update: {item.member_lastupdatedbook}</p>
                  </div>
                  <div className="action-buttons">
                    <button
                      className="rename-button"
                      onClick={() => handleRename(index)}
                    >
                      Rename
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(index)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menutodo;