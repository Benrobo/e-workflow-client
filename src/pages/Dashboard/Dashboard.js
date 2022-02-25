import React, { useState, useContext, useEffect } from 'react'
import MainCont from '../../components/MainCont/MainCont'
import LeftNavbar from '../../components/LeftNavbar'
import Badge from '../../components/Badge/badge'
import "./style.css"
import Layout from '../../components/Layout/Layout'
import { FiMoreVertical } from 'react-icons/fi'
import Modal from '../../components/Modal/Modal'
import TopNavbar from '../../components/TopNavbar/Top'
import { Link } from 'react-router-dom'
import { Util } from "../../helpers/util";
import apiRoutes from "../../api_routes";

import DataContext from '../../context/DataContext'

const util = new Util();

function Dashboard() {

    const { locData, localData } = useContext(DataContext)
    const [authUserInfo, setAuthUserInfo] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    console.log(localData);

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

    console.log(authUserInfo, loading);

    const [visibility, setVisibility] = useState(false)

    return (
        <Layout>
            <LeftNavbar active="dashboard" />
            <MainCont>
                <TopNavbar activeBar="Dashboard" />
                <br />
                <StatCards loading={loading} datalength={authUserInfo.length} />
                <br />
                <RequestContainer setVisibility={setVisibility} />
                {visibility && <Modal setVisibility={setVisibility}>
                    <RequestCard setVisibility={setVisibility} />
                </Modal>}
            </MainCont>
        </Layout>
    )
}

export default Dashboard

function StatCards({ loading, dataLength }) {

    return (
        <div className="cards-container">
            <div className="card-box">
                <p>Total Students</p>
                <h4>{loading}</h4>
            </div>
            <div className="card-box">
                <p>Total Staffs</p>
                <h4>26</h4>
            </div>
            <div className="card-box">
                <p>Total Documents</p>
                <h4>36</h4>
            </div>
        </div>
    )
}

function RequestContainer({ setVisibility }) {

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
                        {Array.from("1fvv").splice(0, 2).map((_, i) => {
                            return (
                                <tr className="mt-3" key={i}>
                                    <td className="user-info">
                                        <img src={`https://avatars.dicebear.com/api/micah/ben.svg`} alt="" />
                                        <small>John Doe</small>
                                    </td>
                                    <td className="contact">
                                        <small>johndoe@gmail.com</small>
                                    </td>
                                    <td className="type">
                                        <small>Senior Officer</small>
                                    </td>
                                    <td className="status">
                                        <Badge text={"pending"} color="p" />
                                    </td>
                                    <td className="action">
                                        <FiMoreVertical className="icon" onClick={() => {
                                            setVisibility(true)
                                        }} />
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <br />
                <br />
                <Link className="btn btn-info" to={"/user/request"}>See More</Link>
            </div>
        </div>
    )
}

function RequestCard({ setVisibility }) {

    return (
        <div className="request-card">
            <div className="user-info">
                <img src={`https://avatars.dicebear.com/api/micah/ben.svg`} alt="" />
                <h4>John Doe</h4>
                <small>john@mail.com</small>
                <br />
                <p className="type">admin</p>
            </div>
            <br />
            <div className="action">
                <button className="accept btn" onClick={() => {
                    setVisibility(false)
                }}>Accept</button>
                <button className="cancel btn" onClick={() => {
                    setVisibility(false)
                }}>Cancel</button>
            </div>
        </div>
    )
}
