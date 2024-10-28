import React, { useState, useEffect } from "react";
import "./Navbarmenutodo.css";
import jpnLogo from "./jpn_logo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Navbarmenutodo = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const [profile, setProfile] = useState({
    member_fname: "",
    member_lname: "",
    member_image_url: ""
  });
  const username = localStorage.getItem("username");

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (username) {
        try {
          const response = await axios.get(`http://localhost:5000/api/profile/${username}`);
          setProfile(response.data);
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    };
    fetchProfile();
  }, [username]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/signin");
  };

  const goToProfile = () => {
    navigate("/Profile");
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

        <div className="profile-section">
          <div className="profile-content" onClick={goToProfile}>
            <div className="welcome-text">
              <i className="fas fa-star"></i>
              <span>ยินดีต้อนรับ {profile.member_fname}</span>
            </div>
            <div className="profile-image-containerr">
              <img
                src={profile.member_image_url && profile.member_image_url.startsWith('http') 
                  ? profile.member_image_url 
                  : "https://via.placeholder.com/150"}
                alt="Profile"
                className="profile-image-small"
              />
            </div>
          </div>
          <button className="btn-logouttt" onClick={handleLogout}>
            <i className="fas fa-power-off"></i>
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbarmenutodo;