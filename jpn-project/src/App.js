import logo from "./logo.svg";
import Home from "./Home";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <h1>JPN Todolist</h1>

      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
