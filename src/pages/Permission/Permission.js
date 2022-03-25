import React, { useState, useContext, useEffect } from 'react'
import MainCont from '../../components/MainCont/MainCont'
import LeftNavbar from '../../components/LeftNavbar'

import "./style.css"
import Layout from '../../components/Layout/Layout'
import TopNavbar from '../../components/TopNavbar/Top'
import { Notification, Util } from "../../helpers/util";
import DataContext from "../../context/DataContext";
import apiRoutes from "../../api_routes";

const notif = new Notification();
const util = new Util()

function Permissions() {

    const { locData, localData, fetchUser } = useContext(DataContext);
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [usersdata, setUserData] = useState([]);

    useEffect(() => {
        (async () => {
            let res = await fetchUser();
            const { loading, error, data } = res;
            let user = data[0][0];

            if (user.userId !== localData.id || user.userRole !== "admin") {
                window.location = "http://localhost:3000/user/settings"
                util.redirect("http://localhost:3000/user/settings")
            }
        })()

    }, [])

    async function fetchUsers() {
        try {
            let url = apiRoutes.getAllUsers;
            let options = {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localData.refreshToken}`,
                    "content-type": "application/json",
                }
            };
            setLoading(true);
            let res = await fetch(url, options);
            let data = await res.json();

            setLoading(false);

            if (data && data.error === true) {
                return setError(data.message)
            }
            setUserData(data.data);
            console.log(data);

        } catch (err) {
            setLoading(false);
            return setError(err.message)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    return (
        <Layout>
            <LeftNavbar active="permission" />
            <MainCont>
                <TopNavbar activeBar="Permissions" />

                {loading ?
                    <div className="loader-cont">
                        <span className="loader"></span>
                    </div>
                    :
                    error !== "" ?
                        <div className="loader-cont">
                            <p>{error}</p>
                        </div>
                        :
                        <div className="main">
                            <DocumentPermission data={usersdata} />
                            <RolesPermission data={usersdata} />
                        </div>}
            </MainCont>
        </Layout>
    )
}

export default Permissions

function DocumentPermission({ data }) {
    const { locData, localData } = useContext(DataContext);
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [staffid, setStaffId] = useState("")
    const [level, setLevel] = useState("")

    async function setPermisison() {

        if (staffid === "") {
            return notif.error("staff cant be empty")
        }
        if (level === "") {
            return notif.error("level cant be empty")
        }

        try {
            let url = apiRoutes.setPermission;
            let options = {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${localData.refreshToken}`,
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    userId: localData.id,
                    staffId: staffid,
                    permissionLevel: parseInt(level)
                })
            };
            setLoading(true);
            let res = await fetch(url, options);
            let data = await res.json();

            setLoading(false);

            if (data && data.error === true) {
                return notif.error(data.message)
            }

            return notif.success(data.message);
        } catch (err) {
            setLoading(false);
            return notif.error(err.message)
        }
    }

    return (
        <div className="doc-permission permission-card">
            <div className="head">
                <h4>Set Staff Document Permission</h4>
            </div>
            <hr />
            <br />
            <div className="bx">
                <label htmlFor="">All Staff</label>
                <select name="" id="" className="select" onChange={(e) => setStaffId(e.target.value)}>
                    <option value="">-----</option>
                    {
                        data && data.length === 0 ?
                            <option value="">No users available</option>
                            :
                            data.map((users) => {
                                if (users.type === "staff" && users.userStatus === "approved") {
                                    return <option value={users.userId} key={users.userId}>
                                        {users.userName} | {users.type} | {users.documentPermissions}
                                    </option>
                                }
                            })
                    }
                </select>
            </div>
            <div className="bx">
                <label htmlFor="">Permission Level</label>
                <select name="" id="" className="select" onChange={(e) => setLevel(e.target.value)}>
                    <option value="">-----</option>
                    <option value="1">1 [Student] default (student) </option>
                    <option value="2">2 [Cordinators, Lecturers] default (staff) </option>
                    <option value="3">3 [HOD's, VP, Pricipal etc...] </option>
                    <option value="4">4 [Dean, ..] </option>
                </select>
            </div>
            <br />
            <div className="action">
                <button className="btn btn-block set" onClick={() => setPermisison()} >
                    {loading ? "Setting permission..." : "Set Permission"}
                </button>
            </div>
        </div>
    )
}

function RolesPermission({ data }) {
    const { locData, localData } = useContext(DataContext);
    const [loading, setLoading] = useState(false)
    const [staffid, setStaffId] = useState("")
    const [role, setRole] = useState("")

    async function setUserRole() {
        if (staffid === "") {
            return notif.error("staff cant be empty")
        }
        if (role === "") {
            return notif.error("role cant be empty")
        }

        try {
            let url = apiRoutes.setRoles;
            let options = {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${localData.refreshToken}`,
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    userId: localData.id,
                    staffId: staffid,
                    role
                })
            };
            setLoading(true);
            let res = await fetch(url, options);
            let data = await res.json();

            setLoading(false);

            if (data && data.error === true) {
                return notif.error(data.message)
            }

            return notif.success(data.message);
        } catch (err) {
            setLoading(false);
            return notif.error(err.message)
        }
    }

    return (
        <div className="roles-permission permission-card">
            <div className="head">
                <h4>Set Users Roles</h4>
            </div>
            <hr />
            <br />
            <div className="bx">
                <label htmlFor="">All Users</label>
                <select name="" id="" className="select" onChange={(e) => setStaffId(e.target.value)}>
                    <option value="">-----</option>
                    {
                        data && data.length === 0 ?
                            <option value="">No users available</option>
                            :
                            data.map((users) => {
                                return <option value={users.userId} key={users.userId}>
                                    {users.userName} | {users.type}
                                </option>
                            })
                    }
                </select>
            </div>
            <div className="bx">
                <label htmlFor="">Roles</label>
                <select name="" id="" className="select" onChange={(e) => setRole(e.target.value)}>
                    <option value="">-----</option>
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                </select>
            </div>
            <br />
            <div className="action">
                <button className="btn btn-block set" onClick={() => setUserRole()}>
                    {loading ? "Setting Role..." : "Set Role"}
                </button>
            </div>
        </div>
    )
}