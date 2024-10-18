import React, { useState, useEffect } from "react";
import './menutodo.css';
import Navbarmenutodo from './../allnavbars/Navbarmenutodo';

const Menutodo = () => {
    return (
        <div className="menu-container">
            <Navbarmenutodo/>
            <div className="list-container">
                <h2 className="list-title">List-Book</h2>
                <div className="button-container">
                    <button className="create-button">Create #1</button>
                    <button className="create-button">Create #2</button>
                    <button className="create-button">Create #3</button>
                    <button className="create-button">Create #4</button>
                </div>
            </div>
        </div>
    );
}

export default Menutodo;