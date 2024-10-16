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
        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="First Name"
            name="fname"
            value={formData.fname}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            name="lname"
            value={formData.lname}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            placeholder="Birthday"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            placeholder="E-mail"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            placeholder="Telephone"
            name="tel"
            value={formData.tel}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            placeholder="Re-password"
            name="rePassword"
            value={formData.rePassword}
            onChange={handleChange}
            required
          />
          <button className="sign-up" type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
