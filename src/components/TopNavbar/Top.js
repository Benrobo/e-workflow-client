import React, { useState, useContext } from 'react'
import img from "../../assets/img/police.png"
import "./style.css"

import DataContext from "../../context/DataContext"

function TopNavbar({ activeBar }) {
    const { logout } = useContext(DataContext)
    const [visibility, setVisibility] = useState(false)

    return (
        <div className="top-navbar">
            <div className="left">
                <h4><b>{activeBar === undefined ? "Active Navbar" : activeBar}</b></h4>
            </div>
            <div className="right">
                <div className="profile-info">
                    <p>John Doe</p>
                    <img src={img} alt="user image" onClick={() => setVisibility(!visibility)} className="img" />

                    {visibility && <div className="more-action">
                        <li onClick={() => logout()}>Logout</li>
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default TopNavbar