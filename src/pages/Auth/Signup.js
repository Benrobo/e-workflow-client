import React, { useState } from "react";
import { Link } from "react-router-dom";

import { SuccessBtn } from "../../helpers/buttons";
import "./style.css";
import img from "../../assets/img/police.png"
import { Notification, Util } from "../../helpers/util";
import apiRoutes from "../../api_routes";
import Request from "../../helpers/Request";
// instance
const notif = new Notification(6000);
const util = new Util();

export function UserSignUp() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [phonenumber, setPhonenumber] = useState("");
    const [token, setToken] = useState("");
    const [userType, setUserType] = useState("student")

    function handleClick() {
        // validate input
        if (phonenumber === "") {
            setPhonenumber("");
            return notif.error("phonenumber is required");
        }
        if (token === "" && userType === "staff") {
            setToken("");
            return notif.error("token is required");
        }
        if (userType === "") {
            setUserType("");
            return notif.error("officer rank is required");
        }
        if (password === "") {
            setPassword("");
            return notif.error("password is required");
        }
        if (name === "") {
            setName("");
            return notif.error("name is required");
        }
        if (email === "") {
            setEmail("");
            return notif.error("email is required");
        }

        // validate phonenumber
        if (!util.validatePhonenumber(phonenumber)) {
            return notif.error("Invalid phonenumber: eg 07056448763");
        }
        // else if every condition was met
        // make request to server
        const userData = {};

        userData["userName"] = name;
        userData["phoneNumber"] = phonenumber;
        userData["email"] = email;
        userData["password"] = password;
        userData["type"] = userType;

        if (userType === "staff") userData["token"] = token

        // return console.log(apiRoutes.userAuth);
        async function signinUser() {
            const url = apiRoutes.userAuth;
            let options = {
                method: "post",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(userData)
            }
            try {
                setLoading(true)
                let req = await fetch(url, options);
                let res = await req.json();

                if (req.status !== 200 && res.error === true) {
                    setLoading(false)
                    return notif.error(res.message);
                }
                setLoading(false)
                notif.success("registeration sucessful");

                util.redirect(`/signin`, 1500);
                return;
            } catch (e) {
                setLoading(false)
                notif.error(e.message);
            }
        }
        signinUser();
    }

    return (
        <>
            <div className="auth-cont">
                <Head />
                <div className="left bx">
                    <div className="form-container mt-2">
                        <div className="head mb-4">
                            <h3>Create Account</h3>
                        </div>
                        <div className="user-form form">
                            <input
                                type="text"
                                placeholder="Full Name"
                                defaultValue={name}
                                maxLength="20"
                                className="input"
                                onChange={(e) => {
                                    setName(e.target.value);
                                }}
                            />
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="input"
                                defaultValue={email}
                                maxLength={60}
                                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                                required
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }}
                            />
                            <br />
                            <div className="user-type-box">
                                <label htmlFor="">
                                    <small>are you staff ?</small>
                                    <input type="checkbox" onChange={(e) => {
                                        if (e.target.checked) {
                                            return setUserType("staff")
                                        }
                                        setUserType("student")
                                    }} className="ml-2" />
                                    <br />
                                </label>
                                {userType === "staff" &&
                                    <>
                                        <label htmlFor="">
                                            <small>Enter token code sent to your mail</small>
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="Code"
                                            className="input"
                                            defaultValue={token}
                                            maxLength={60}
                                            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                                            required
                                            onChange={(e) => {
                                                setToken(e.target.value);
                                            }}
                                        />
                                    </>
                                }
                            </div>
                            <input
                                type="number"
                                placeholder="Phone Number"
                                className="input"
                                defaultValue={phonenumber}
                                maxLength={11}
                                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                                required
                                onChange={(e) => {
                                    setPhonenumber(e.target.value);
                                }}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                defaultValue={password}
                                maxLength="20"
                                className="input mb-2"
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                }}
                            />
                            <SuccessBtn
                                text={loading ? "Creating your account..." : "Create Account"}
                                onClick={handleClick}
                                className={"btn-block success"}
                            />
                            <small>
                                have an account? <Link to="/signin">Sign In</Link>
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}


export function AdminSignUp() {
    const [loading, setLoading] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [phonenumber, setPhonenumber] = useState("");

    function handleClick() {
        // validate input
        if (phonenumber === "") {
            setPhonenumber("");
            return notif.error("phonenumber is required");
        }
        if (password === "") {
            setPassword("");
            return notif.error("password is required");
        }
        if (name === "") {
            setName("");
            return notif.error("name is required");
        }
        if (email === "") {
            setEmail("");
            return notif.error("email is required");
        }

        // validate phonenumber
        if (!util.validatePhonenumber(phonenumber)) {
            return notif.error("Invalid phonenumber: eg 07056448763");
        }
        // else if every condition was met
        // make request to server
        const userData = {};

        userData["userName"] = name;
        userData["phoneNumber"] = phonenumber;
        userData["email"] = email;
        userData["password"] = password;
        userData["type"] = "admin";

        // return console.log(apiRoutes.userAuth);
        async function signinUser() {
            const url = apiRoutes.adminAuth;
            const options = {
                method: "post",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(userData),
            }
            try {
                setLoading(true)
                let req = await fetch(url, options);
                let res = await req.json();

                if (req.status !== 200 && res.error === true) {
                    setLoading(false)
                    return notif.error(res.message);
                }
                setLoading(false)
                notif.success("registeration sucessful");

                util.redirect(`/signin`, 1500);
                return;
            } catch (e) {
                setLoading(false)
                notif.error(e.message);
            }
        }
        signinUser();
    }

    return (
        <>
            <div className="auth-cont">
                <Head />
                <div className="left bx">
                    <div className="form-container mt-2">
                        <div className="head mb-4">
                            <h3>Admin Signup</h3>
                        </div>
                        <div className="user-form form">
                            <input
                                type="text"
                                placeholder="Full Name"
                                defaultValue={name}
                                maxLength="20"
                                className="input"
                                onChange={(e) => {
                                    setName(e.target.value);
                                }}
                            />
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="input"
                                defaultValue={email}
                                maxLength={60}
                                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                                required
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }}
                            />
                            <input
                                type="number"
                                placeholder="Phone Number"
                                className="input"
                                defaultValue={phonenumber}
                                maxLength={11}
                                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                                required
                                onChange={(e) => {
                                    setPhonenumber(e.target.value);
                                }}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                defaultValue={password}
                                maxLength="20"
                                className="input mb-2"
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                }}
                            />
                            <SuccessBtn
                                text={loading ? "Creating your account..." : "Create Account"}
                                onClick={handleClick}
                                className={"btn-block success"}
                            />
                            <small>
                                have an account? <Link to="/signin">Sign In</Link>
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}


function Head() {
    return (
        <div>
            <h3>
                <span className="grn-clr">E-workflow</span> System
            </h3>
            <br />
        </div>
    )
}