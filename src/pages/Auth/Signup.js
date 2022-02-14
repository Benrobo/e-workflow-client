import React, { useState } from "react";
import { Link } from "react-router-dom";

import { SuccessBtn } from "../../helpers/buttons";
import "./style.css";
import img from "../../assets/img/police.png"
import { Notification, Util } from "../../helpers/util";
import apiRoutes from "../../api_routes";
// instance
const notif = new Notification(5000);
const util = new Util();


const officerRanks = [
    "Inspector General",
    "Deputy Inspector-General of Police",
    "Assistant Inspector-General of Police",
    "Commissioner of Police",
    "Deputy Commissioner of Police",
    "Assistant Commissioner of Police",
    "Chief Superintendent of Police",
    "Superintendent of Police",
    "Deputy Superintendent of Police",
    "Assistant Superintendent of Police",
    "Inspector of Police",
    "Sergeant Major",
    "Sergeant",
    "Corporal",
    "Lance",
    "Constable"
]

export function UserSignUp() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [phonenumber, setPhonenumber] = useState("");
    const [officerranks, setOfficerRanks] = useState("")

    function handleClick() {
        // validate input
        if (phonenumber === "") {
            setPhonenumber("");
            return notif.error("phonenumber is required");
        }
        if (officerranks === "") {
            setOfficerRanks("");
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
        userData["rank"] = officerranks;

        // return console.log(apiRoutes.userAuth);
        async function signinUser() {
            const url = apiRoutes.userAuth;
            try {
                let req = await fetch(url, {
                    method: "post",
                    headers: {
                        "content-type": "application/json",
                    },
                    body: JSON.stringify(userData),
                });
                let res = await req.json();

                if (req.status !== 200 && res.error === true) {
                    return notif.error(res.message);
                }
                notif.success("registeration in sucessful");

                util.redirect(`/signin`, 1500);
                return;
            } catch (e) {
                notif.error(e.message);
            }
        }
        signinUser();
    }

    return (
        <>
            <div className="auth-cont">
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
                            <select name="" id="" className="input" onChange={(e) => setOfficerRanks(e.target.value)}>
                                <option value="">officer ranks</option>
                                {officerRanks.map((_, i) => (
                                    <option value={_} key={i}>{_}</option>
                                ))}
                            </select>
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
                                text="Create Account"
                                onClick={handleClick}
                                className={"btn-block success"}
                            />
                            <small>
                                have an account? <Link to="/signin">Sign In</Link>
                            </small>
                        </div>
                    </div>
                </div>
                <div className="right bx">
                    <h3>To <span className="br">Protect</span> And <span className="br">Serve</span></h3>
                    <span>Crime Tracker System</span>
                    <br />
                    <img src={img} alt="" />
                </div>
            </div>
        </>
    );
}


export function AdminSignUp() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [phonenumber, setPhonenumber] = useState("");
    const [officerranks, setOfficerRanks] = useState("")

    function handleClick() {
        // validate input
        if (phonenumber === "") {
            setPhonenumber("");
            return notif.error("phonenumber is required");
        }
        if (officerranks === "") {
            setOfficerRanks("");
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
        userData["rank"] = officerranks;

        // return console.log(apiRoutes.userAuth);
        async function signinUser() {
            const url = apiRoutes.adminAuth;
            try {
                let req = await fetch(url, {
                    method: "post",
                    headers: {
                        "content-type": "application/json",
                    },
                    body: JSON.stringify(userData),
                });
                let res = await req.json();

                if (req.status !== 200 && res.error === true) {
                    return notif.error(res.message);
                }
                notif.success("registeration in sucessful");

                util.redirect(`/signin`, 1500);
                return;
            } catch (e) {
                notif.error(e.message);
            }
        }
        signinUser();
        // signinUser();
    }

    return (
        <>
            <div className="auth-cont">
                <div className="left bx">
                    <div className="form-container mt-2">
                        <div className="head mb-4">
                            <h3>Admin SignUp</h3>
                        </div>
                        <br />
                        <div className="user-form form">
                            <input
                                type="text"
                                placeholder="Full Name"
                                maxLength="20"
                                className="input mb-2"
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
                            <select name="" id="" className="input" onChange={(e) => setOfficerRanks(e.target.value)}>
                                <option value="">officer ranks</option>
                                {officerRanks.map((_, i) => (
                                    <option value={_} key={i}>{_}</option>
                                ))}
                            </select>
                            <input
                                type="password"
                                placeholder="Password"
                                maxLength="20"
                                className="input mb-2"
                                defaultValue={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                }}
                            />
                            <SuccessBtn
                                text="Create Account"
                                onClick={handleClick}
                                className={"btn-block success"}
                            />
                            <small>
                                have an account? <Link to="/signin">Sign In</Link>
                            </small>
                        </div>
                    </div>
                </div>
                <div className="right bx">
                    <h3>To <span className="br">Protect</span> And <span className="br">Serve</span></h3>
                    <span>Crime Tracker System</span>
                    <br />
                    <img src={img} alt="" />
                </div>
            </div>
        </>
    );
}