import React from "react";
import "./Aboutus.css";
import neww from "./6430300480.jpg";
import jame from "./6430300633.jpg";
import poom from "./6430300749.jpg";

const Aboutus = () => {
  const profiles = [
    { img: neww, name: "นายน่านฟ้า สุทธิภูล", id: "6430300480" },
    { img: jame, name: "นายพัชรพล ขจรกลิ่น", id: "6430300633" },
    { img: poom, name: "นายภูมิลักษณ์ พรหมดนตรี", id: "6430300749" },
  ];

  const getNameStyle = (name) => {
    if (name === "นายภูมิลักษณ์ พรหมดนตรี") {
      return { fontSize: "1.1rem" };
    }
    return {};
  };

  return (
    <div className="aboutus-container">
      <h1 className="aboutus-title">About us</h1>
      <div className="profiles">
        {profiles.map((profile, index) => (
          <div key={index} className="profile">
            <div className="profile-image-container">
              <img src={profile.img} alt={profile.name} className="profile-image" />
            </div>
            <div className="profile-info">
              <h2 
                className="profile-name"
                style={getNameStyle(profile.name)}
              >
                {profile.name}
              </h2>
              <p className="profile-id">{profile.id}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Aboutus;