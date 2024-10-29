import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbarsignin.css";
import jpnLogo from "./jpn_logo.png";
import Swal from "sweetalert2";

const Navbarsignin = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    // Check login status
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const goSignup = () => {
    navigate("/signup");
  };

  const goToMenuTodo = () => {
    if (isLoggedIn) {
      navigate("/menutodo");
    } else {
      Swal.fire({
        title: "กรุณาเข้าสู่ระบบ!",
        text: "เข้าสู่ระบบก่อนเข้าใช้งาน JPN todolist",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3182ce",
        cancelButtonColor: "#718096",
        confirmButtonText: "เข้าสู่ระบบ",
        cancelButtonText: "ยกเลิก",
        customClass: {
          popup: 'custom-swal-popup',
          title: 'custom-swal-title',
          content: 'custom-swal-content',
          icon: 'custom-swal-icon',
          confirmButton: 'custom-swal-confirm-button',
          cancelButton: 'custom-swal-cancel-button',
          backdrop: 'custom-swal-backdrop'
        },
        background: '#ffffff',
        heightAuto: false,
        padding: '2rem',
        backdrop: `
          rgba(66, 153, 225, 0.4)
          backdrop-filter: blur(4px)
        `,
        showClass: {
          popup: 'swal2-show'
        },
        hideClass: {
          popup: 'swal2-hide'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/signin");
        }
      });
    }
  };

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="container-fluid">
        <a href="/" className="navbar-brand">
          <img src={jpnLogo} alt="JPN Logo" className="navbar-logo" />
          <div className="brand-text">
            <div className="brand-text-main">โปรแกรมรายการสิ่งที่ต้องทำ</div>
            <div className="brand-text-sub">(JPN Todolist)</div>
          </div>
        </a>

        <div className="navbar-links">
          <a 
            href="/" 
            className={`nav-linkk ${activeLink === "home" ? "active" : ""}`}
            onMouseEnter={() => setActiveLink("home")}
            onMouseLeave={() => setActiveLink("")}
          >
            <i className="fas fa-home"></i>
            <span>Home</span>
          </a>
          <a 
            href="/aboutus" 
            className={`nav-linkk ${activeLink === "about" ? "active" : ""}`}
            onMouseEnter={() => setActiveLink("about")}
            onMouseLeave={() => setActiveLink("")}
          >
            <i className="fas fa-info-circle"></i>
            <span>About Us</span>
          </a>
          <button 
            className={`nav-linkk ${activeLink === "menu" ? "active" : ""}`}
            onClick={goToMenuTodo}
            onMouseEnter={() => setActiveLink("menu")}
            onMouseLeave={() => setActiveLink("")}
          >
            <i className="fas fa-list"></i>
            <span>Menu</span>
          </button>
        </div>

        <div className="navbar-auth">
          <button className="btn-sign-up" onClick={goSignup}>
            <i className="fas fa-user-plus"></i>
            <span>Sign Up</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbarsignin;