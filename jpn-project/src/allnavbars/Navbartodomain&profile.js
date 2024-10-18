import React from "react";
import "./Navbartodomain&profile.css";
import jpnLogo from "./jpn_logo.png";
import { useNavigate } from "react-router-dom";

const NavbartodomainAndprofile = () => {
  const navigate = useNavigate(); // useNavigate ต้องทำงานภายใน <Router>

  const goMenu = () => {
    navigate("/Menu");
  };

  const goHome = () => {
    localStorage.removeItem("token"); // หรือชื่อที่คุณใช้เก็บ token
    localStorage.removeItem("username"); // ลบ username ออกจาก localStorage
    navigate("/signin"); // เปลี่ยนเส้นทางไปยังหน้าลงชื่อเข้าใช้
  };
 
  return (
    <nav className="navbar navbar-expand-lg navbar-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          <img src={jpnLogo} alt="JPN Logo" className="navbar-logo" />
          <div className="brand-text">
            <div className="brand-text-main">โปรแกรมรายการสิ่งที่ต้องทำ</div>
            <div className="brand-text-sub">(JPN Todolist)</div>
          </div>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse justify-content-center"
          id="navbarNav"
        >
          <ul className="navbar-nav">
            <li className="nav-itemm">
              <a className="nav-link" href="/">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/aboutus">
                About Us
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/Menu">
                Menu
              </a>
            </li>
          </ul>
        </div>
        <div className="navbar-nav">
          <button className="btn btn-logout" onClick={goHome}>
            Log Out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavbartodomainAndprofile;
