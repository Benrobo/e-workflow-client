import React from "react";
import { Link } from "react-router-dom";
import "./style.css";
import { AiOutlineDashboard } from 'react-icons/ai'
import { RiBellFill, RiNotification2Fill, RiSendToBack, RiUser6Fill } from 'react-icons/ri'
import { FiGitPullRequest, FiSend } from 'react-icons/fi'
import { FaCog, FaLock, FaUsers, FaUsersCog, FaVideo } from 'react-icons/fa'
import { IoMdDocument } from 'react-icons/io'
import { TiZoomOutline } from 'react-icons/ti'
import { Util } from "../../helpers/util"

const util = new Util()

function LeftNavbar({ active }) {

    let { type, role, refreshToken } = JSON.parse(localStorage.getItem("e-workflow"));


    return (
        <div className="left-navbar-container">
            <div className="head">
                <h3> <span className="brd"></span> <span className="txt">e-flow</span></h3>
            </div>
            <br />
            <div className="list-cont">
                {role !== undefined && role === "admin" && <Link to="/user/dashboard/sdcc" className={active === "dashboard" ? "link active" : "link"}>
                    <AiOutlineDashboard className="icon" />
                    Dashboard
                </Link>}
                <Link to="/user/notifications" className={active === "notifications" ? "link active" : "link"}>
                    <RiNotification2Fill className="icon" />
                    Notification
                </Link>
                <Link to="/user/settings" className={active === "settings" ? "link active" : "link"}>
                    <FaCog className="icon" />
                    Settings
                </Link>
                {role !== undefined && role === "admin" && <Link to="/user/code" className={active === "code" ? "link active" : "link"}>
                    <RiSendToBack className="icon" />
                    Code / Token
                </Link>}
                {role !== undefined && role === "admin" && <Link to="/user/sendMail" className={active === "sendMail" ? "link active" : "link"}>
                    <FiSend className="icon" />
                    Send Mail
                </Link>}
                {type !== "student" && type === "student" && <Link to="/user/submissions" className={active === "submissions" ? "link active" : "link"}>
                    <IoMdDocument className="icon" />
                    Submissions
                </Link>}
                <Link to="/user/collab" className={active === "collab" ? "link active" : "link"}>
                    <FaVideo className="icon" />
                    Collab
                </Link>
                <Link to="/user/addDocument" className={active === "addDocument" ? "link active" : "link"}>
                    <IoMdDocument className="icon" />
                    Documents
                </Link>
                {role !== undefined && role === "admin" && <Link to="/user/request" className={active === "request" ? "link active" : "link"}>
                    <FiGitPullRequest className="icon" />
                    Request
                </Link>}
                {role !== undefined && role === "user" && type === "student" && <Link to="/user/groups" className={active === "groups" ? "link active" : "link"}>
                    <FaUsers className="icon" />
                    Group
                </Link>}
                {role !== undefined && role === "admin" && <Link to="/user/permission" className={active === "permission" ? "link active" : "link"}>
                    <FaLock className="icon" />
                    Permission
                </Link>}
                {role !== undefined && role === "admin" && <Link to="/user/users" className={active === "users" ? "link active" : "link"}>
                    <FaUsersCog className="icon" />
                    Users
                </Link>}
                {role !== undefined && role === "admin" && <Link to="/user/roles" className={active === "roles" ? "link active" : "link"}>
                    <RiUser6Fill className="icon" />
                    Set Roles
                </Link>}
            </div>
        </div>
    );
}

export default LeftNavbar;
