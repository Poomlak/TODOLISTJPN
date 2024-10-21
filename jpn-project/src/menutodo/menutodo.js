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

  const fetchDiary = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/diary");
      setList(response.data); // Set list with fetched data
    } catch (error) {
      console.error("Error fetching diary:", error);
      setError("Error fetching diary"); // Set error message
    }
  };

  // Fetch diary entries on component mount
  useEffect(() => {
    fetchDiary();
  }, []);

  // Navigate to "/todomain"
  const goTodomain = (listName) => {
    const username = "admin"; // Use the actual username if available
    navigate("/todomain", { state: { listName, username } });
  };

  // Handle adding a new list
  const handleCreate = async () => {
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

    if (listName) {
      try {
        // Send data to API to create a new diary
        await axios.post("http://localhost:5000/api/diary/create", {
          diaryName: listName,
          username: "admin" // Adjust username as necessary
        });

        // Update state with the new item
        const newItem = {
          diary_namebook: listName,
          member_createdbook: new Date().toLocaleString(),
          member_lastupdatedbook: new Date().toLocaleString(),
        };
        setList((prevList) => [...prevList, newItem]); // Add new item to the list

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
    const oldName = list[index].diary_namebook; // Get old name from list

    const { value: newName } = await MySwal.fire({
      title: "เปลี่ยนชื่อสมุดรายการ",
      input: "text",
      inputValue: oldName, // Use old name as default value
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

    if (newName) {
      try {
        // Call API to update name
        await axios.put(`http://localhost:5000/api/diary/update/${oldName}`, { newName });

        const updatedList = list.map((item, idx) =>
          idx === index
            ? { ...item, diary_namebook: newName, member_lastupdatedbook: new Date().toLocaleString() }
            : item
        );
        setList(updatedList); // Update the name of the item
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
    }
  };

  // Handle deleting an item
  const handleDelete = async (index) => {
    const itemName = list[index].diary_namebook;

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

    if (result.isConfirmed) {
      try {
        // Send request to API to delete
        await axios.delete("http://localhost:5000/api/diary/delete", {
          data: {
            name: itemName,
            username: "admin", // Adjust username as necessary
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
            list.map((item, index) => (
              <div key={index} className="list-item">
                <div
                  className="list-content"
                  onClick={() => goTodomain(item.diary_namebook)} // Pass diary name
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
