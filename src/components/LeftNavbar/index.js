import React from "react";
import { Link } from "react-router-dom";
import "./style.css";
import { AiOutlineDashboard } from 'react-icons/ai'
import { RiBellFill, RiNotification2Fill, RiSendToBack, RiUser6Fill } from 'react-icons/ri'
import { FiGitPullRequest, FiSend } from 'react-icons/fi'
import { FaCog, FaLock, FaUsers, FaUsersCog, FaVideo } from 'react-icons/fa'
import { IoMdDocument } from 'react-icons/io'
import { TiZoomOutline } from 'react-icons/ti'


function LeftNavbar({ active }) {
    return (
        <div className="left-navbar-container">
            <div className="head">
                <h3> <span className="brd"></span> <span className="txt">e-flow</span></h3>
            </div>
            <br />
            <div className="list-cont">
                <Link to="/user/dashboard/sdcc" className={active === "dashboard" ? "link active" : "link"}>
                    <AiOutlineDashboard className="icon" />
                    Dashboard
                </Link>
                <Link to="/user/notifications" className={active === "notifications" ? "link active" : "link"}>
                    <RiNotification2Fill className="icon" />
                    Notification
                </Link>
                <Link to="/user/settings" className={active === "settings" ? "link active" : "link"}>
                    <FaCog className="icon" />
                    Settings
                </Link>
                <Link to="/user/code" className={active === "code" ? "link active" : "link"}>
                    <RiSendToBack className="icon" />
                    Code / Token
                </Link>
                <Link to="/user/sendMail" className={active === "sendMail" ? "link active" : "link"}>
                    <FiSend className="icon" />
                    Send Mail
                </Link>
                <Link to="/user/submissions" className={active === "cases" ? "link active" : "link"}>
                    <IoMdDocument className="icon" />
                    Submissions
                </Link>
                <Link to="/user/collab" className={active === "cases" ? "link active" : "link"}>
                    <FaVideo className="icon" />
                    Collab
                </Link>
                <Link to="/user/addDocument" className={active === "addDocument" ? "link active" : "link"}>
                    <IoMdDocument className="icon" />
                    Documents
                </Link>
                <Link to="/user/request" className={active === "request" ? "link active" : "link"}>
                    <FiGitPullRequest className="icon" />
                    Request
                </Link>
                <Link to="/user/groups" className={active === "groups" ? "link active" : "link"}>
                    <FaUsers className="icon" />
                    Group
                </Link>
                <Link to="/user/permission" className={active === "permission" ? "link active" : "link"}>
                    <FaLock className="icon" />
                    Permission
                </Link>
                <Link to="/user/users" className={active === "users" ? "link active" : "link"}>
                    <FaUsersCog className="icon" />
                    Users
                </Link>
                <Link to="/user/roles" className={active === "roles" ? "link active" : "link"}>
                    <RiUser6Fill className="icon" />
                    Set Roles
                </Link>
            </div>
        </div>
    );
}

export default LeftNavbar;
