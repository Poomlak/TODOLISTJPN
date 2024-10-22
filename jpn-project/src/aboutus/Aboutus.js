import React, { useState, useEffect } from "react";
import "./Aboutus.css";
import neww from "./6430300480.jpg";
import jame from "./6430300633.jpg";
import poom from "./6430300749.jpg";
import Navbaraboutus from "../allnavbars/Navbarsaboutus";
import Navbarprofile from './../allnavbars/Navbarprofile';

const Aboutus = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) {
      setIsLoggedIn(true); // If username is present, the user is logged in
    }
  }, []);

  const profiles = [
    { img: neww, name: "นายน่านฟ้า สุทธิภูล", id: "6430300480" },
    { img: jame, name: "นายพัชรพล ขจรกลิ่น", id: "6430300633" },
    { img: poom, name: "นายภูมิลักษณ์ พรหมดนตรี", id: "6430300749" },
  ];

  const getNameStyle = (name) => {
    if (name === "นายภูมิลักษณ์ พรหมดนตรี") {
      return { fontSize: "1.3rem" };
    }
    return {};
  };

  return (
    <>
      {/* Conditional Navbar rendering based on login status */}
      {isLoggedIn ? <Navbarprofile /> : <Navbaraboutus />}
      
      <div className="aboutus-container">
        <h1 className="aboutus-title">About us</h1>
        <div className="profiles">
          {profiles.map((profile, index) => (
            <div key={index} className="profile">
              <div className="profile-image-container">
                <img
                  src={profile.img}
                  alt={profile.name}
                  className="profile-image"
                />
              </div>
              <div className="profile-info">
                <h2 className="profile-name" style={getNameStyle(profile.name)}>
                  {profile.name}
                </h2>
                <p className="profile-id">{profile.id}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Aboutus;
