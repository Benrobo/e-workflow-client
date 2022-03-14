import React, { useState, useEffect, useContext } from "react";
import MainCont from "../../components/MainCont/MainCont";
import LeftNavbar from "../../components/LeftNavbar";

import "./style.css";
import Layout from "../../components/Layout/Layout";
import TopNavbar from "../../components/TopNavbar/Top";
import { Notification, Util } from "../../helpers/util";
import DataContext from "../../context/DataContext";
import apiRoutes from "../../api_routes";
import Badge from "../../components/Badge/badge";

const notif = new Notification(4000);
const util = new Util();

function Settings() {
    const { localData } = useContext(DataContext);
    const [fetchloading, setFetchLoading] = useState(false);
    const [error, setError] = useState("");
    const [userdata, setUserData] = useState([]);

    const [showedit, setShowEdit] = useState(false);

    async function fetchUsers() {
        try {
            setFetchLoading(true);
            let url = apiRoutes.getUsersById;
            let options = {
                method: "post",
                headers: {
                    Authorization: `Bearer ${localData.refreshToken}`,
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    userId: localData.id,
                }),
            };
            let res = await fetch(url, options);
            let result = await res.json();

            setFetchLoading(false);

            if (result && result.error === true) {
                setError(result.message);
                return notif.error(result.message);
            }
            setUserData(result.data);
        } catch (err) {
            setFetchLoading(false);
            setError(err.message);
            return notif.error(err.message);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <Layout>
            <LeftNavbar active="settings" />
            <MainCont>
                <TopNavbar activeBar="Settings" />
                <br />
                {fetchloading ? (
                    "fetching users.."
                ) : error !== "" ? (
                    <p>{error}</p>
                ) : userdata && userdata.length === 0 ? (
                    <p>No user found</p>
                ) : (
                    <>
                        <Profile data={userdata} setShowEdit={setShowEdit} />
                        {showedit && (
                            <EditProfile data={userdata} setShowEdit={setShowEdit} />
                        )}
                    </>
                )}
            </MainCont>
        </Layout>
    );
}

export default Settings;

function Profile({ data, setShowEdit }) {
    const { userName, type, userRole, joined, mail, phoneNumber } = data[0];

    return (
        <div className="profile-cont">
            <div className="head">
                <img
                    src={`https://avatars.dicebear.com/api/initials/${userName}.svg`}
                    alt=""
                />
                <div className="right">
                    <h4>{userName.toUpperCase()}</h4>
                    <span className="badge p-2">{type}</span>
                    <span className="badge p-2">{userRole}</span>
                </div>
            </div>
            <br />
            <div className="info-card">
                <div className="list">
                    <li>
                        <small>User Name</small>
                        <p>{userName.toUpperCase()}</p>
                    </li>
                    <li>
                        <small>Email</small>
                        <p>{mail}</p>
                    </li>
                    <li>
                        <small>Phone Number</small>
                        <p>{phoneNumber}</p>
                    </li>
                    <li>
                        <small>Joined Since</small>
                        <p>{joined}</p>
                    </li>
                </div>
                <button className="btn edit" onClick={() => setShowEdit(true)}>
                    Update Profile
                </button>
                <div className="action mt-4">
                    <button className="btn logout">Logout</button>
                    <button className="btn delete">Delete Account</button>
                </div>
            </div>
            <br />
        </div>
    );
}

function EditProfile({ data, setShowEdit }) {
    const { localData } = useContext(DataContext);
    const [pwdvisibility, setPwdVisibility] = useState(false);
    const { userName, type, userRole, joined, mail, phoneNumber } = data[0];
    const [error, setError] = useState("");
    const [username, setUserName] = useState("");
    const [usermail, setMail] = useState("");
    const [userphonenumber, setPhoneNumber] = useState("");
    const [pwd, setPwd] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setUserName(userName);
        setMail(mail);
        setPhoneNumber(phoneNumber);
    }, []);

    async function updateAccount() {
        try {
            setLoading(true);
            let url = apiRoutes.updateAccount;
            let options = {
                method: "put",
                headers: {
                    Authorization: `Bearer ${localData.refreshToken}`,
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    userId: localData.id,
                    userName: username,
                    mail: usermail,
                    phoneNumber: userphonenumber,
                    passwordState: pwdvisibility,
                    password: pwd
                }),
            };
            let res = await fetch(url, options);
            let result = await res.json();

            setLoading(false);

            if (result && result.error === true) {
                setError(result.message);
                return notif.error(result.message);
            }

            notif.success(result.message);
            setTimeout(() => {
                window.localStorage.clear();
                window.location.reload(true);
            }, 1300);
        } catch (err) {
            setLoading(false);
            setError(err.message);
            return notif.error(err.message);
        }
    }

    return (
        <div className="edit-profile-cont">
            <div className="main">
                <div className="head">
                    <h3>Update Account</h3>
                </div>
                <br />
                <div className="bx">
                    <label htmlFor="">Username</label>
                    <input
                        type="text"
                        defaultValue={username === "" ? userName : username}
                        onChange={(e) => setUserName(e.target.value)}
                        className="input"
                    />
                </div>
                <div className="bx">
                    <label htmlFor="">Mail</label>
                    <input
                        type="mail"
                        defaultValue={usermail === "" ? mail : usermail}
                        onChange={(e) => setMail(e.target.value)}
                        className="input"
                    />
                </div>
                <div className="bx">
                    <label htmlFor="">Phone Number</label>
                    <input
                        type="number"
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        defaultValue={
                            userphonenumber === "" ? phoneNumber : userphonenumber
                        }
                        className="input"
                    />
                </div>
                <br />
                <div className="option">
                    <span>update password</span>
                    <input
                        type="checkbox"
                        onChange={(e) => {
                            let target = e.target;
                            if (target.checked) {
                                return setPwdVisibility(!pwdvisibility);
                            }
                            return setPwdVisibility(!pwdvisibility);
                        }}
                        className="check ml-2"
                    />
                </div>
                <br />
                {pwdvisibility && (
                    <div className="bx">
                        <label htmlFor="">Password</label>
                        <input
                            type="password"
                            defaultValue={pwd}
                            onChange={(e) => setPwd(e.target.value)}
                            className="input"
                        />
                    </div>
                )}
                <div className="action mt-2">
                    <button className="btn logout" onClick={() => setShowEdit(false)}>
                        Cancel
                    </button>
                    <button
                        className="btn update"
                        onClick={async () => {
                            await updateAccount();
                        }}
                    >
                        {loading ? "Updating..." : "Update Account"}
                    </button>
                </div>
            </div>
        </div>
    );
}
