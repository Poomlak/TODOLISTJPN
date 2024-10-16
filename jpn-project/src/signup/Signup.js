import React, { useState } from "react";
import jpnLogo from "../navbars/jpn_logo.png";
import "./Signup.css";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    birthday: '',
    email: '',
    tel: '',
    username: '',
    password: '',
    rePassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ตรวจสอบว่ารหัสผ่านตรงกัน
    if (formData.password !== formData.rePassword) {
      alert('Passwords do not match');
      return;
    }

    // ส่งข้อมูลไปยัง API
    axios.post('http://localhost:5000/signup', {
      fname: formData.fname,
      lname: formData.lname,
      birthday: formData.birthday,
      email: formData.email,
      tel: formData.tel,
      username: formData.username,
      password: formData.password,
    })
      .then(response => {
        alert('Member registered successfully');
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
      })
      .catch(error => {
        console.error('There was an error registering the member!', error);
        alert('Error registering member');
      });
  };

  return (
    <div className="container-signup">
      <div className="logo-and-title">
        <img src={jpnLogo} alt="JPN Todolist Logo" className="logo" />
        <h1 className="app-title">Create an account</h1>
      </div>

      <div className="form-container">
        <form className="signup-form">
          <div className="input-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
            />
          </div>

          <div className="input-group">
            <label htmlFor="repassword">Re-password:</label>
            <input
              type="password"
              id="repassword"
              placeholder="Re-enter your password"
            />
          </div>

          <div className="input-group">
            <label htmlFor="birthday">Birthday:</label>
            <input type="date" id="birthday" />
          </div>

          <div className="input-group">
            <label htmlFor="email">E-mail:</label>
            <input type="email" id="email" placeholder="Enter your email" />
          </div>

          <div className="input-group">
            <label htmlFor="telephone">Telephone:</label>
            <input
              type="tel"
              id="telephone"
              placeholder="Enter your phone number"
            />
          </div>

          <button className="sign-up">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
