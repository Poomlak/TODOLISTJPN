import logo from "./logo.svg";
import Home from "./Home";
import Signin from "./signin/Signin";
import Signup from "./signup/Signup";
import Aboutus from "./aboutus/Aboutus";
import Todo from "./todo/Todo";
import Todomain from "./todomain/Todomain";
import Profile from "./profile/Profile";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import Navbar from "./navbars/Navbar";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
<<<<<<< HEAD
=======

>>>>>>> 228cb2852b69673622102634e77b495344f20309
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/aboutus" element={<Aboutus />} />
        <Route path="/todo" element={<Todo />} />
        <Route path="/todomain" element={<Todomain />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
