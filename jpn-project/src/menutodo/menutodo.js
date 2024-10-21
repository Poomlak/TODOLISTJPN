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
      const username = localStorage.getItem("username"); // ดึง username จาก token ที่ decode หรือที่เก็บไว้
      console.error("test:", username);
      const response = await axios.get(`http://localhost:5000/api/diary/${username}`, {
        data: { token },  // ส่ง token ไปใน body
      });

      setList(response.data);
    } catch (error) {
      console.error("Error fetching diary:", error);
      setError("Error fetching diary");
    }
  };

  // Fetch diary entries on component mount
  useEffect(() => {
    fetchDiary();
  }, [username]);

  // Navigate to "/todomain"
  const goTodomain = (index, diaryName) => {
    navigate(`/todomain/${index}`, { state: { diaryName } });
  };

  // Handle adding a new list
  const handleCreate = async () => {
    const username = localStorage.getItem("username"); // ดึง username จาก localStorage หรือที่อื่น ๆ

    const { value: listName } = await MySwal.fire({
      html: (
        <div>
          <h4>กรอกชื่อสมุดรายการ:</h4>
          <input id="list-name" className="swal2-input" placeholder="ชื่อสมุดรายการ" />
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

    if (listName && username) {  // ตรวจสอบว่ามี listName และ username
      try {
        // ส่ง request ไปยัง API พร้อมกับ username และ listName
        await axios.post("http://localhost:5000/api/diary/create", {
          diaryName: listName,
          username: username, // ใช้ username ที่ดึงมา
        });

        // อัปเดต state ด้วยรายการใหม่
        const newItem = {
          diary_namebook: listName,
          member_createdbook: new Date().toLocaleString(),
          member_lastupdatedbook: new Date().toLocaleString(),
        };
        setList((prevList) => [...prevList, newItem]); // เพิ่ม item ใหม่ใน list

        Swal.fire({
          title: `สมุดรายการ: ${listName}`,
          text: "บันทึกเรียบร้อย!",
          icon: "success",
          customClass: {
            popup: "custom-success-popup",
          },
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
    const oldName = list[index].diary_namebook; // ชื่อสมุดเดิม
    const username = localStorage.getItem("username"); // ดึง username จาก localStorage หรือจากแหล่งอื่นๆ

    const { value: newName } = await MySwal.fire({
      title: "เปลี่ยนชื่อสมุดรายการ",
      input: "text",
      inputValue: oldName, // ใช้ชื่อเดิมเป็นค่าเริ่มต้น
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
        // ส่ง request ไปที่ API เพื่อเปลี่ยนชื่อสมุดรายการ
        await axios.put(`http://localhost:5000/api/diary/update/${oldName}`, {
          newName,
          username, // ส่ง username ไปพร้อมกับชื่อใหม่
        });

        // อัปเดต list ด้วยชื่อใหม่และเวลาแก้ไขล่าสุด
        const updatedList = list.map((item, idx) =>
          idx === index
            ? { ...item, diary_namebook: newName, member_lastupdatedbook: new Date().toLocaleString() }
            : item
        );
        setList(updatedList); // อัปเดตชื่อในรายการ

        // แจ้งเตือนว่าเปลี่ยนชื่อสำเร็จ
        Swal.fire({
          title: "เปลี่ยนชื่อสำเร็จ",
          icon: "success",
        });
      } catch (error) {
        // กรณีเกิดข้อผิดพลาดขณะเปลี่ยนชื่อ
        console.error("Error renaming diary:", error);
        Swal.fire({
          title: "เกิดข้อผิดพลาดในการเปลี่ยนชื่อ",
          icon: "error",
        });
      }
    } else {
      // กรณีที่ไม่มี username หรือ newName
      console.error("Missing username or new name.");
    }
  };

  // Handle deleting an item
  const handleDelete = async (index) => {
    const itemName = list[index].diary_namebook;
    const username = localStorage.getItem("username"); // ดึง username จาก localStorage หรือแหล่งอื่น ๆ

    const result = await MySwal.fire({
      title: `ต้องการลบ "${itemName}" หรือไม่?`,
      imageUrl: logo,
      imageWidth: 80,
      imageHeight: 80,
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#f44336",
      cancelButtonColor: "#4CAF50",
    });

    if (result.isConfirmed && username) {
      try {
        // Send request to API to delete the diary with the current username
        await axios.delete("http://localhost:5000/api/diary/delete", {
          data: {
            name: itemName,
            username, // ส่ง username จากที่ดึงมาไปด้วย
          },
        });

        const updatedList = list.filter((_, i) => i !== index);
        setList(updatedList); // Remove the item from the list
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

  return (
    <div className="menu-container">
      <Navbarmenutodo />
      <div className="list-header">
        <h1 className="list-title">List-Book</h1>
        <button className="main-create" onClick={handleCreate}>
          Create List
        </button>
      </div>
      <div className="list-container">
        <div className="button-container">
          {list.length === 0 ? (
            <p>กด "Create List" เพื่อสร้างรายการใหม่</p>
          ) : (
            list.map((item, index) => (  // ใช้ item และ index ในการ map
              <div key={index} className="list-item">
                <div
                  className="list-content"
                  onClick={() => goTodomain(index, item.diary_namebook)} // ส่ง index และ diary_namebook
                  style={{ cursor: "pointer" }}
                >
                  <h3>{item.diary_namebook}</h3>
                  <p>Created: {item.member_createdbook}</p>
                  <p>Last Update: {item.member_lastupdatedbook}</p>
                </div>
                <div className="action-buttons">
                  <button className="rename-button" onClick={() => handleRename(index)}>Rename</button>
                  <button className="delete-button" onClick={() => handleDelete(index)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Menutodo;