import React, { useState } from "react";
import jpnLogo from "../navbars/jpn_logo.png";
import "./Signup.css";
import axios from "axios";
import Swal from 'sweetalert2'; // Import SweetAlert2
import Navbarsignup from "../allnavbars/Navbarsignup";

const Signup = () => {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    birthday: "",
    email: "",
    tel: "",
    username: "",
    password: "",
    rePassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ตรวจสอบว่ารหัสผ่านตรงกัน
    if (formData.password !== formData.rePassword) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Passwords do not match!',
      });
      return;
    }

    try {
      // ตรวจสอบว่า username, email, tel เคยมีในระบบหรือไม่
      const checkResponse = await axios.post('http://localhost:5000/checkUser', {
        username: formData.username,
        email: formData.email,
        tel: formData.tel
      });

      // ถ้า username, email, tel เคยมีในระบบ
      if (checkResponse.data.exists) {
        Swal.fire({
          icon: 'error',
          title: 'ผู้ใช้งานนี้ได้มีอยู่ในระบบแล้ว',
          text: 'username, email, หรือ phone number ได้มีลงทะเบียนไว้ในระบบแล้ว โปรดลองใหม่อีกครั้ง.',
        });
        return;
      }

      // ถ้าไม่มีในระบบ ก็ลงทะเบียนใหม่
      const registerResponse = await axios.post('http://localhost:5000/signup', {
        fname: formData.fname,
        lname: formData.lname,
        birthday: formData.birthday,
        email: formData.email,
        tel: formData.tel,
        username: formData.username,
        password: formData.password,
      });

      Swal.fire({
        icon: 'success',
        title: 'ลงทะเบียนสำเร็จ',
        text: 'โปรดรอสักครู่จะทำการเข้าไปหน้า login',
        confirmButtonText: 'OK'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.pathname = "/signin"; 
        }
    });
    

      setFormData({
        fname: '',
        lname: '',
        birthday: '',
        email: '',
        tel: '',
        username: '',
        password: '',
        rePassword: ''
      });
    } catch (error) {
      console.error('There was an error registering the member!', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an error registering the member!',
      });
    }
  };

  return (
    <>
      <Navbarsignup />
      <div className="container-signup">
        <div className="logo-and-title">
          <img src={jpnLogo} alt="JPN Todolist Logo" className="logo" />
          <h1 className="app-title">Create an account</h1>
        </div>

        <div className="form-container">
          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="fname">First Name:</label>
              <input
                type="text"
                id="fname"
                name="fname"
                value={formData.fname}
                onChange={handleChange}
                placeholder="Enter your first name"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="lname">Last Name:</label>
              <input
                type="text"
                id="lname"
                name="lname"
                value={formData.lname}
                onChange={handleChange}
                placeholder="Enter your last name"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="rePassword">Re-password:</label>
              <input
                type="password"
                id="rePassword"
                name="rePassword"
                value={formData.rePassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="birthday">Birthday:</label>
              <input
                type="date"
                id="birthday"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="email">E-mail:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="tel">Telephone:</label>
              <input
                type="tel"
                id="tel"
                name="tel"
                value={formData.tel}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
              />
            </div>

            <button className="sign-up" type="submit">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
