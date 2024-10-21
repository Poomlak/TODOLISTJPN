import logo from "./logo.svg";
import Home from "./Home";
import Signin from "./signin/Signin";
import Signup from "./signup/Signup";
import Aboutus from "./aboutus/Aboutus";

import Todomain from "./todomain/Todomain";
import Profile from "./profile/Profile";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import Resetpass from "./signin/Resetpass";
import "./App.css";
import NavbartodomainAndprofile from "./allnavbars/Navbartodomain&profile";
import Navbarmenutodo from "./allnavbars/Navbarmenutodo";
import Menutodo from "./menutodo/menutodo";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/aboutus" element={<Aboutus />} />
        <Route path="/todomain" element={<Todomain />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/resetpass" element={<Resetpass />} />
        <Route path="/menutodo" element={<Menutodo />} />
        <Route path="/todomain/:index" element={<Todomain />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
