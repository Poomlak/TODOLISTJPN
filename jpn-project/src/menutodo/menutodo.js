import React, { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "./menutodo.css";
import Navbarmenutodo from "./../allnavbars/Navbarmenutodo";
import logo from "../allnavbars/jpn_logo.png";
import { useNavigate } from "react-router-dom";

const MySwal = withReactContent(Swal);

const Menutodo = () => {
  const [list, setList] = useState([
    {
      name: "Jame Diary Todo",
      created: new Date().toLocaleString(),
      updated: new Date().toLocaleString(),
    },
  ]); // State to store the list of items
  const navigate = useNavigate();

  // Go to "/todomain"
  const goTodomain = (listName) => {
    // คุณอาจจะส่งค่าชื่อของรายการไปยังหน้านั้นได้ตามต้องการ
    navigate("/todomain", { state: { listName } });
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
      const newItem = {
        name: listName,
        created: new Date().toLocaleString(),
        updated: new Date().toLocaleString(),
      };
      setList([...list, newItem]); // Add new item to the list
      Swal.fire({
        title: `สมุดรายการ: ${listName}`,
        text: "บันทึกเรียบร้อย!",
        icon: "success",
        customClass: {
          popup: "custom-success-popup",
        },
      });
    }
  };

  // Handle renaming an item
  const handleRename = async (index) => {
    const { value: newName } = await MySwal.fire({
      title: "เปลี่ยนชื่อสมุดรายการ",
      input: "text",
      inputValue: list[index].name,
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
      const updatedList = [...list];
      updatedList[index] = {
        ...updatedList[index],
        name: newName,
        updated: new Date().toLocaleString(),
      };
      setList(updatedList); // Update the name of the item
      Swal.fire({
        title: "เปลี่ยนชื่อสำเร็จ",
        icon: "success",
      });
    }
  };

  // Handle deleting an item
  const handleDelete = (index) => {
    MySwal.fire({
      title: "ต้องการลบสมุดบันทึกหรือไม่?",
      imageUrl: logo,
      imageWidth: 80,
      imageHeight: 80,
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#f44336",
      cancelButtonColor: "#4CAF50",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedList = list.filter((_, i) => i !== index);
        setList(updatedList); // Remove the item from the list
        Swal.fire("ลบสำเร็จ!", "", "success");
      }
    });
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
          {list.map((item, index) => (
            <div key={index} className="list-item"  >
              <div
                className="list-content"
                onClick={() => goTodomain(item.name)} // Navigate on click
                style={{ cursor: "pointer" }}
              >
                <h3>{item.name}</h3>
                <p>Created: {item.created}</p>
                <p>Last Update: {item.updated}</p>
              </div>
              <div className="action-buttons">
                <button className="rename-button" onClick={() => handleRename(index)}>Rename</button>
                <button className="delete-button" onClick={() => handleDelete(index)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menutodo;
