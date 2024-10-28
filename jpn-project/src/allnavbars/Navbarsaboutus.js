import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbarsaboutus.css";
import jpnLogo from "./jpn_logo.png";

const Navbaraboutus = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const goSignIn = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/signin");
  };

  const goSignup = () => {
    navigate("/signup");
  };

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-container">
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
        </div>

        <div className="navbar-auth">
          <button className="btn-sign-upp" onClick={goSignup}>
            <i className="fas fa-user-plus"></i>
            <span>Sign Up</span>
          </button>
          <button className="btn-sign-inn" onClick={goSignIn}>
            <i className="fas fa-sign-in-alt"></i>
            <span>Sign In</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbaraboutus;