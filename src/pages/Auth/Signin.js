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
    const [loading, setLoading] = useState(false);
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

                setLoading(false)

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
                    status,
                    refreshToken
                };
                // save data to localstorage
                util.saveLocalstorage(saveuserInfo);
                util.redirect(`/user/dashboard/${id}`, 1500);
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
                                text={loading ? "Signin you In" : "Sign In"}
                                onClick={handleClick}
                                className={"btn-block success"}
                            />
                            <small>
                                dont have an account? <Link to="/signup">Sign up</Link>
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