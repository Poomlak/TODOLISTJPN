import React, { useState, useEffect } from "react";
import "./Navbartodomain&profile.css";
import jpnLogo from "./jpn_logo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NavbartodomainAndprofile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    member_fname: "",
    member_lname: "",
    member_image_url: ""
  });
  const username = localStorage.getItem("username");

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

  const goMenu = () => {
    navigate("/Menu");
  };

  const goHome = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/signin");
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
              <a className="nav-link" href="/menutodo">
                Menu
              </a>
            </li>
          </ul>
        </div>
        <div className="navbar-nav d-flex align-items-center">
          <div className="d-flex align-items-center me-3">
            <span className="welcome-text me-2">ยินดีต้อนรับ, {profile.member_fname}</span>
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
          <button className="btn btn-logout" onClick={goHome}>
            Log Out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavbartodomainAndprofile;