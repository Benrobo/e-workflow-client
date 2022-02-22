import React, { useState } from 'react'
import img from "../../assets/img/police.png"
import "./style.css"

function TopNavbar({ activeBar }) {

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
                        <li>Logout</li>
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default TopNavbar