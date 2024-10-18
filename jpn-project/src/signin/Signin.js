import React, { useState, useEffect } from "react";
import jpnLogo from "../navbars/jpn_logo.png";
import "./Signin.css";
import axios from "axios";
import Navbarsignin from "../allnavbars/Navbarsignin";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Signin = () => {
  const navigate = useNavigate();

  const goReset = () => {
    navigate("/resetpass");
  };

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/login", {
        username: formData.username,
        password: formData.password,
      });
      await Swal.fire({
        icon: 'success',
        title: 'Login Success',
        text: 'คุณได้เข้าสู่ระบบเรียบร้อยแล้ว!',
        confirmButtonText: 'ตกลง'
      });

      // ทำการเปลี่ยนเส้นทางไปยังหน้าอื่น (เช่น หน้าโปรไฟล์)
      window.location.href = "/profile"; // เปลี่ยนเป็นเส้นทางที่ต้องการ
      
      // เก็บ username ลง localStorage
      localStorage.setItem("username", formData.username);
      
      // นำทางไปยังหน้าที่ต้องการหลังจากล็อกอินสำเร็จ
      navigate("/profile");
    } catch (error) {
      console.error("Error logging in:", error.response.data);
      await Swal.fire({
        icon: 'error',
        title: 'Invalid User',
        text: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง.',
        confirmButtonText: 'ตกลง'
      });
    }
  };

  return (
    <>
      <Navbarsignin />
      <div className="signin-container">
        <div className="signin-form">
          <div className="logo-container">
            <img src={jpnLogo} alt="JPN Logo" className="jpn-logo" />
          </div>
          <h2 className="signin-title">Sign in to your account</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder=""
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder=""
                  required
                />
                <button
                  type="button"
                  className="toggle-password-button"
                  onClick={togglePasswordVisibility}
                >
                  <img
                    src={showPassword
                      ? "https://cdn.discordapp.com/attachments/861532175925116928/1296001688376709130/image.png?ex=6710b321&is=670f61a1&hm=535724526a15ce2bbfea95b3f1785a3044f4336224c942bbe641957bede828c1&"
                      : "https://cdn.discordapp.com/attachments/861532175925116928/1296001359476166726/image.png?ex=6710b2d2&is=670f6152&hm=18d411368535db5cc89775501579453130649b5b4fbfc6d94298b5496aef480d&"}
                    alt="Toggle Password Visibility"
                    className="password-toggle-icon"
                  />
                </button>
              </div>
            </div>
            <div className="button-group">
              <button type="button " className="" onClick={goReset}>
                Resetpass
              </button>
              <button type="submit" className="signin-button">
                Sign in
              </button>
              <button type="button" className="sign_up">
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signin;
