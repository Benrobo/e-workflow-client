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

export default function Signin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function handleClick() {
        if (password === "") {
            setPassword("");
            return notif.error("password is required");
        }
        if (email === "") {
            setEmail("");
            return notif.error("email is required");
        }

        // else if every condition was met
        // make request to server
        const userData = {};

        userData["email"] = email;
        userData["password"] = password;

        async function signinUser() {
            const url = apiRoutes.logIn;
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
                notif.success("logged in sucessful");
                const { refreshToken } = res.data[0];
                if (
                    util.decodeJwt(refreshToken).error ||
                    util.decodeJwt(refreshToken).message
                ) {
                    notif.error(util.decodeJwt(refreshToken));
                    return Error(util.decodeJwt(refreshToken).message);
                }
                const { id, role, status, rank } = util.decodeJwt(refreshToken);
                const saveuserInfo = {
                    id,
                    role,
                    rank,
                    status,
                    refreshToken
                };
                // save data to localstorage
                util.saveLocalstorage(saveuserInfo);
                util.redirect(`/officer/dashboard/${id}`, 1500);
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
                            <h3>SignIn</h3>
                        </div>
                        <div className="user-form form">
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
                                text="Sign In"
                                onClick={handleClick}
                                className={"btn-block success"}
                            />
                            <small>
                                dont have an account? <Link to="/signup">Sign In</Link>
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
