import React from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "./menutodo.css";
import Navbarmenutodo from "./../allnavbars/Navbarmenutodo";
import logo from "../allnavbars/jpn_logo.png"; // นำเข้ารูป
import { useNavigate } from "react-router-dom";

const MySwal = withReactContent(Swal);

const Menutodo = () => {
  const navigate = useNavigate(); // useNavigate ต้องทำงานภายใน <Router>
  const goTodomain = () => {
    navigate("/todomain");
  };
  const handleCreate = async () => {
    const { value: listName } = await MySwal.fire({
      //   title: <strong>JPN</strong>,
      html: (
        <div>
          <p>กรอกชื่อสมุดรายการ :</p>
          <input
            type="text"
            id="list-name"
            className="swal2-input"
            placeholder="ชื่อสมุด"
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

    if (listName) {
      Swal.fire({
        title: `สมุดรายการ: ${listName}`, // เปลี่ยนชื่อกล่องเป็นค่าที่กรอกมา
        text: "บันทึกเรียบร้อย!",
        icon: "success",
        customClass: {
          popup: "custom-success-popup",
        },
      });
      goTodomain();
    }
  };

  return (
    <div className="menu-container">
      <Navbarmenutodo />
      <div className="list-container">
        <h2 className="list-title">List-Book</h2>
        <div className="button-container">
          <button className="create-button" onClick={handleCreate}>
            Create #1
          </button>
          <button className="create-button" onClick={handleCreate}>
            Create #2
          </button>
          <button className="create-button" onClick={handleCreate}>
            Create #3
          </button>
          <button className="create-button" onClick={handleCreate}>
            Create #4
          </button>
        </div>
      </div>
    </div>
  );
};

export default Menutodo;
