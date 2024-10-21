import React, { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import Navbaraboutus from "../allnavbars/Navbarsaboutus";
import "./Resetpass.css"; // สำหรับ styling เพิ่มเติม

const Resetpass = () => {
  const [formData, setFormData] = useState({ identifier: "", otp: "", newPassword: "" });
  const [isOtpSent, setIsOtpSent] = useState(false); // State to track if OTP is sent

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSendOtp = async () => {
    try {
      const response = await axios.post("http://localhost:5000/send-otp", { identifier: formData.identifier });
      Swal.fire({
        icon: "success",
        title: "OTP Sent",
        text: "An OTP has been sent to your email!",
        confirmButtonText: "OK"
      });
      setIsOtpSent(true); // Enable OTP input field
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Username or email not found!",
        confirmButtonText: "Try Again"
      });
    }
  };

  const handleResetPassword = async () => {
    try {
      const response = await axios.post("http://localhost:5000/reset-password", {
        otp: formData.otp,
        newPassword: formData.newPassword
      });
      Swal.fire({
        icon: "success",
        title: "Password Reset",
        text: "Your password has been successfully reset!",
        confirmButtonText: "Login"
      }).then(() => {
        window.location.pathname = "/signin"; // Redirect to sign in page
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Invalid OTP or failed to reset password!",
        confirmButtonText: "Try Again"
      });
    }
  };

  return (
    <>
      <Navbaraboutus />
      <div className="resetpass-container">
        <h1>Reset Password</h1>
        <div className="resetpass-form">
          {!isOtpSent ? (
            <div className="send-otp-section">
            <label>Username or Email</label>
            <div className="input-btn-container">
              <input
                type="text"
                name="identifier"
                placeholder="Enter your username or email"
                value={formData.identifier}
                onChange={handleChange}
                required
              />
              <button onClick={handleSendOtp} className="btn-send-otp">Send OTP</button>
            </div>
          </div>
          ) : (
            <div className="reset-password-section">
              <label>Enter OTP</label>
              <input
                className="input-otp"
                type="text"
                name="otp"
                placeholder="Enter OTP sent to your email"
                value={formData.otp}
                onChange={handleChange}
                required
              />
              
              <label>New Password</label>
              <input
                className="input-password"
                type="password"
                name="newPassword"
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
              <button onClick={handleResetPassword} className="btn-reset-password">Reset Password</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Resetpass;
