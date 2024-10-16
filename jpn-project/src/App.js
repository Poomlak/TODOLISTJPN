import logo from "./logo.svg";
import Home from "./Home";
import Signin from "./signin/Signin";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import Navbar from "./navbars/Navbar";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
