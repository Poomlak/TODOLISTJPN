import React, { useState } from "react";
import jpnLogo from "../navbars/jpn_logo.png";
import "./Signin.css";
import axios from "axios"; 

const Signin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post('http://localhost:5000/login', {
            username: formData.username,
            password: formData.password
        });
        alert('Login successful');
        
    } catch (error) {
        console.error('Error logging in:', error.response.data);
        alert('Invalid username or password');
    }
};


  return (
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
                
              </button>
            </div>
          </div>
          <div className="button-group">
            <button type="submit" className="signin-button">
              Sign in
            </button>
            <button type="submit" className="sign_up">
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signin;
