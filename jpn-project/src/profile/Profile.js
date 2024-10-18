import React, { useState, useEffect } from "react";
import "./Profile.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Profile = () => {
  const [profile, setProfile] = useState({
    username: "",
    password: "",
    birthday: "",
    email: "",
    telephone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // สถานะแก้ไข
  const [image, setImage] = useState(null); // เก็บรูปโปรไฟล์

  useEffect(() => {
    const fetchProfile = async () => {
      const data = {
        username: "Jame test",
        password: "password123",
        birthday: "12/03/45",
        email: "Jametest@gmail.com",
        telephone: "0812345678",
      };
      setProfile(data);
    };
    fetchProfile();
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSave = () => {
    console.log("บันทึกข้อมูล:", profile);
    setIsEditing(false); // ปิดโหมดแก้ไข
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="profile-container">
      <h1>สวัสดี , {profile.username}</h1>

      <div className="profile-image">
        <img
          src={image || "https://via.placeholder.com/150"}
          alt="Profile"
          className="profile-picture"
        />
        {isEditing && (
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="upload-button"
          />
        )}
      </div>

      <div className="profile-details">
        <div className="input-group">
          <label>Username :</label>
          <input
            type="text"
            name="username"
            value={profile.username}
            onChange={handleInputChange}
            readOnly={!isEditing}
          />
        </div>

        <div className="input-group">
          <label>Password :</label>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={profile.password}
              onChange={handleInputChange}
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
          <label>Birthday :</label>
          <input
            type="text"
            name="birthday"
            value={profile.birthday}
            onChange={handleInputChange}
            readOnly={!isEditing}
          />
        </div>

        <div className="input-group">
          <label>E-mail :</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleInputChange}
            readOnly={!isEditing}
          />
        </div>

        <div className="input-group">
          <label>Telephone :</label>
          <input
            type="text"
            name="telephone"
            value={profile.telephone}
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
      </div>
    </div>
  );
};

export default Profile;
