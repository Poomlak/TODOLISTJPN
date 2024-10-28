import React, { useState, useEffect } from "react";
import "./Profile.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom"; // นำเข้า Link จาก react-router-dom
import axios from "axios";
import Swal from "sweetalert2";
import Navbarprofile from "../allnavbars/Navbarprofile";

const Profile = () => {
  const [profile, setProfile] = useState({
    member_id: null,
    member_fname: "",
    member_lname: "",
    member_birthday: "",
    member_email: "",
    member_tel: "",
    member_username: "",
    member_password: "",
    member_image_url: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchProfile = async () => {
      if (username) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/profile/${username}`
          );
          setProfile(response.data);
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    };
    fetchProfile();
  }, [username]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/profile/${profile.member_username}`,
        {
          password: profile.member_password,
          birthday: profile.member_birthday,
          email: profile.member_email,
          telephone: profile.member_tel,
          imageUrl: profile.member_image_url,
        }
      );

      await Swal.fire({
        icon: "success",
        title: "อัปเดตสำเร็จ!",
        text: "โปรไฟล์ของคุณได้ถูกอัปเดตแล้ว.",
        confirmButtonText: "ตกลง",
      });

      await axios.post("http://localhost:5000/send-update-email", {
        email: profile.member_email,
        username: profile.member_username,
        changes: {
          birthday: profile.member_birthday,
          telephone: profile.member_tel,
          imageUrl: profile.member_image_url,
        },
      });

      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire(
        "Failed to update profile. Please check your input or try again later."
      );
    }
  };

  return (
    <>
      <Navbarprofile />
      <div className="profile-container">
        <h1>
          สวัสดี , {profile.member_fname} {profile.member_lname}
        </h1>

        <div className="profile-image">
          <img
            src={
              profile.member_image_url &&
              profile.member_image_url.startsWith("http")
                ? profile.member_image_url
                : "https://via.placeholder.com/150"
            }
            alt="Profile"
            className="profile-picture"
          />
          {isEditing && (
            <input
              type="text"
              name="member_image_url"
              value={profile.member_image_url}
              onChange={handleInputChange}
              placeholder="Enter image URL"
              className="url-input"
            />
          )}
        </div>

        <div className="profile-details">
          {/* ข้อมูลโปรไฟล์ */}
          <div className="input-group">
            <label htmlFor="username">Username :</label>
            <input
              type="text"
              id="username"
              name="member_username"
              value={profile.member_username}
              onChange={handleInputChange}
              readOnly={!isEditing}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Change Password :</label>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="member_password"
                onChange={handleInputChange}
                placeholder="You can change password here"
                readOnly={!isEditing}
              />
              <span
                onClick={togglePasswordVisibility}
                className="password-toggle"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="birthday">Birthday :</label>
            <input
              type="text"
              id="birthday"
              name="member_birthday"
              value={profile.member_birthday}
              onChange={handleInputChange}
              readOnly={!isEditing}
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">E-mail :</label>
            <input
              type="email"
              id="email"
              name="member_email"
              value={profile.member_email}
              onChange={handleInputChange}
              readOnly={!isEditing}
            />
          </div>

          <div className="input-group">
            <label htmlFor="tel">Telephone :</label>
            <input
              type="text"
              id="tel"
              name="member_tel"
              value={profile.member_tel}
              onChange={handleInputChange}
              readOnly={!isEditing}
            />
          </div>
        </div>

        <div className="profile-buttons">
          {isEditing ? (
            <>
              <button className="btn save" onClick={handleSave}>
                บันทึก
              </button>
              <button className="btn back" onClick={() => setIsEditing(false)}>
                ย้อนกลับ
              </button>
            </>
          ) : (
            <button className="btn edit" onClick={() => setIsEditing(true)}>
              แก้ไข
            </button>
          )}

          {/* ปุ่มลิงก์ไปยังหน้า menutodo */}
          <Link to="/menutodo">
            <button className="btn menutodo-link">ไปยังหน้าเมนู To-do</button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Profile;
