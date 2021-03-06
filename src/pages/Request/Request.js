import React, { useState, useEffect, useContext } from 'react'
import MainCont from '../../components/MainCont/MainCont'
import LeftNavbar from '../../components/LeftNavbar'
import Badge from '../../components/Badge/badge'
import { FiMoreVertical } from 'react-icons/fi'
import "./style.css"
import Layout from '../../components/Layout/Layout'
import TopNavbar from '../../components/TopNavbar/Top'
import { Util, Notification } from "../../helpers/util";
import apiRoutes from "../../api_routes";
import Modal from '../../components/Modal/Modal'
import DataContext from '../../context/DataContext'

const util = new Util();
const notif = new Notification();



function Request() {
    const { locData, localData, fetchUser } = useContext(DataContext);
    const [authUserInfo, setAuthUserInfo] = useState([]);
    const [docdata, setDocData] = useState([])
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [targetUserId, setTargetId] = useState("");

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

    // get users data
    useEffect(() => {
        (async () => {
            setLoading(true)
            let url = apiRoutes.getAllUsers;
            const data = {
                method: "post",
                headers: {
                    "content-type": "application/json",
                    "Authorization": `Bearer ${localData.refreshToken}`
                },
            }

            let req = await fetch(url, data);
            let res = await req.json();

            if (res && res.message && res.error === true) {
                setLoading(false);
                setError(res.message)
                setAuthUserInfo([])
                return
            }

            setLoading(false);
            setAuthUserInfo(res.data);
            setError("")
        })()
    }, [])

    const [visibility, setVisibility] = useState(false)

    return (
        <Layout>
            <LeftNavbar active="request" />
            <MainCont>
                <TopNavbar activeBar="Requests" />

                <RequestContainer setVisibility={setVisibility} loading={loading} data={authUserInfo} setTargetId={setTargetId} />
                {visibility && <Modal setVisibility={setVisibility}>
                    <RequestCard setVisibility={setVisibility} targetUserId={targetUserId} />
                </Modal>}
            </MainCont>
        </Layout>
    )
}

export default Request

function RequestContainer({ setVisibility, data, loading, setTargetId }) {

    let request = data.filter((users) => {
        if (users.type === "staff" && users.userStatus === "pending") {
            return users
        }
    })

    function handleTargetedUserId(e) {
        let target = e.target.dataset;

        setTargetId(target.id)
    }

    return (
        <div className="request-cont mt-5">
            <div className="head">
                <p>Staffs Request</p>
                <small>registeration</small>
            </div>
            <br />
            <div className="body">
                <table className="tbl-body table-hover table-striped">
                    <thead>
                        <tr>
                            <th>Full Name</th>
                            <th>Contacts</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading === false ?
                            request.length > 0 ? request.map((list, i) => {
                                return (
                                    <tr className="mt-3" key={i}>
                                        <td className="user-info">
                                            <img src={`https://avatars.dicebear.com/api/micah/${list.userName}.svg`} alt="" />
                                            <small>{list.userName}</small>
                                        </td>
                                        <td className="contact">
                                            <small>{list.mail}</small>
                                        </td>
                                        <td className="type">
                                            <small>Senior Officer</small>
                                        </td>
                                        <td className="status">
                                            <Badge text={"pending"} color="p" />
                                        </td>
                                        <td className="action">
                                            <FiMoreVertical className="icon" data-id={list.userId} onClick={(e) => {
                                                handleTargetedUserId(e)
                                                if (Object.entries(e.target.dataset).length > 0) {
                                                    setVisibility(true)
                                                }
                                            }} />
                                        </td>
                                    </tr>
                                )
                            }) : <p>No staff requests.</p> : "Loading...."}
                    </tbody>
                </table>
            </div>
        </div>
    )
}


function RequestCard({ setVisibility, targetUserId }) {
    const { localData } = useContext(DataContext)
    const [authUserInfo, setAuthUserInfo] = useState([]);
    const [loading, setLoading] = useState(false);
    const [approvedloading, setApprovedLoading] = useState(false);
    const [error, setError] = useState("");


    useEffect(() => {
        // handle users data
        (async function getUsersId() {
            try {
                setLoading(true)
                let url = apiRoutes.getUsersById;
                const data = {
                    method: "post",
                    headers: {
                        "content-type": "application/json",
                        "Authorization": `Bearer ${localData.refreshToken}`
                    },
                    body: JSON.stringify({ userId: targetUserId })
                }

                let req = await fetch(url, data);
                let res = await req.json();

                console.log(res);

                if (res && res.message && res.error === true) {
                    setLoading(false);
                    setError(res.message)
                    setAuthUserInfo([])
                    return { loading, data: authUserInfo, error }
                }

                setLoading(false);
                setAuthUserInfo(res.data);
                setError("")

            } catch (err) {
                setLoading(false)
                setError(err.message)
                setAuthUserInfo([])
            }
        })()
    }, [])

    async function approvedStaffRegisteration(staffId) {
        try {
            setApprovedLoading(true)
            let url = apiRoutes.approveRegRequest;
            const data = {
                method: "post",
                headers: {
                    "content-type": "application/json",
                    "Authorization": `Bearer ${localData.refreshToken}`
                },
                body: JSON.stringify({ userId: staffId })
            }

            let req = await fetch(url, data);
            let res = await req.json();

            if (res && res.message && res.error === true) {
                setApprovedLoading(false);
                return notif.error(res.message)
            }
            setApprovedLoading(false);
            notif.success(res.message)
            setTimeout(window.location.reload(true), 1200)
        } catch (err) {
            setApprovedLoading(false)
            notif.error(err.message)
        }
    }

    return (
        <div className="request-card">
            {loading === false ?
                error !== "" ?
                    <p>{error}</p>
                    :
                    authUserInfo.length > 0 ?
                        authUserInfo.map((list) => {
                            return (
                                <>
                                    <div className="user-info">
                                        <img src={`https://avatars.dicebear.com/api/micah/${list.userName}.svg`} alt="" />
                                        <h4>{list.userName}</h4>
                                        <small>{list.mail}</small>
                                        <br />
                                        <p className="type">{list.type}</p>
                                    </div>
                                    <br />
                                    <div className="action">
                                        <button className="accept btn" data-id={list.userId} onClick={async (e) => {
                                            let target = e.target.dataset;
                                            if (target.id !== undefined || target.id !== null || target.id !== "") {
                                                await approvedStaffRegisteration(target.id)
                                                setVisibility(false)
                                            }
                                        }}>{approvedloading === true ? "Approving request..." : "Accept"} </button>
                                        <button className="cancel btn" onClick={(e) => {
                                            setVisibility(false)
                                        }}>Cancel</button>
                                    </div>
                                </>
                            )
                        })
                        :
                        <p></p>
                :
                <p>Loading....</p>
            }
        </div>
    )
}
