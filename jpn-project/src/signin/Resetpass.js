import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import Navbaraboutus from "../allnavbars/Navbarsaboutus";
import "./Resetpass.css"; // สำหรับ styling เพิ่มเติม

const Resetpass = () => {
  const [formData, setFormData] = useState({
    identifier: "",
    otp: "",
    newPassword: "",
  });
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpExpiryTime, setOtpExpiryTime] = useState(180); // 3 minutes in seconds

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSendOtp = async () => {
    try {
      const response = await axios.post("http://localhost:5000/send-otp", {
        identifier: formData.identifier,
      });
      Swal.fire({
        icon: "success",
        title: "OTP Sent",
        html: "Your OTP has been sent successfully<br>Please check your email.",
        confirmButtonText: "OK",
      });
      setIsOtpSent(true); // Enable OTP input field
      setOtpExpiryTime(180); // Reset the countdown timer
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        html: "Username or email not found!<br>Please try again.",
        confirmButtonText: "Try Again",
      });
    }
  };

  const handleResetPassword = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/reset-password",
        {
          otp: formData.otp,
          newPassword: formData.newPassword,
        }
      );
      Swal.fire({
        icon: "success",
        title: "Password Reset",
        text: "Your password has been successfully reset!",
        confirmButtonText: "Login",
      }).then(() => {
        window.location.pathname = "/signin"; // Redirect to sign in page
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Invalid OTP or don't use the same password",
        confirmButtonText: "Try Again",
      });
    }
  };

  // Timer effect for OTP expiry
  useEffect(() => {
    let timer;
    if (isOtpSent && otpExpiryTime > 0) {
      timer = setInterval(() => {
        setOtpExpiryTime((prev) => prev - 1);
      }, 1000);
    }

    // Clear interval on cleanup
    return () => clearInterval(timer);
  }, [isOtpSent, otpExpiryTime]);

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
                <button onClick={handleSendOtp} className="btn-send-otp">
                  Send OTP
                </button>
              </div>
            </div>
          ) : (
            <div className="reset-password-section">
              <label>Enter OTP {otpExpiryTime > 0 ? `(${Math.floor(otpExpiryTime / 60)}:${(otpExpiryTime % 60).toString().padStart(2, '0')})` : "(OTP Expired)"}</label>
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
              <button
                onClick={handleResetPassword}
                className="btn-reset-password"
                disabled={otpExpiryTime <= 0} // Disable button if OTP has expired
              >
                Reset Password
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Resetpass;
