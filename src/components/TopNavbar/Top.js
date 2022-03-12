import React, { useState, useContext, useEffect } from 'react'
import img from "../../assets/img/police.png"
import "./style.css"
import DataContext from "../../context/DataContext"
import apiRoutes from '../../api_routes'
import { Notification } from "../../helpers/util";

const notif = new Notification();

function TopNavbar({ activeBar }) {
    const { logout, localData } = useContext(DataContext)
    const [visibility, setVisibility] = useState(false)
    const [loading, setLoading] = useState(false);
    const [userdata, setUserData] = useState([])

    async function getUser() {
        try {
            let url = apiRoutes.getUsersById;
            let options = {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localData.refreshToken}`,
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    userId: localData.id
                })
            };
            setLoading(true)
            let res = await fetch(url, options);
            let data = await res.json();

            setLoading(false)

            if (data && data.error === true) {
                return notif.error(data.message)
            }

            return setUserData(data.data)

        } catch (err) {
            setLoading(false)
            setUserData([])
        }
    }

    useEffect(() => {
        getUser()
        console.log(userdata);
    }, [])


    return (
        <div className="top-navbar">
            <div className="left">
                <h4><b>{activeBar === undefined ? "Active Navbar" : activeBar}</b></h4>
            </div>
            <div className="right">
                <div className="profile-info">
                    <p>{loading ? "..." : userdata && userdata.length > 0 ? userdata[0].userName : ""}</p>
                    <img src={`https://avatars.dicebear.com/api/initials/${userdata && userdata.length > 0 ? userdata[0].userName : ""}.svg`} alt="user image" onClick={() => setVisibility(!visibility)} className="img" />

                    {visibility && <div className="more-action">
                        <li onClick={() => logout()}>Logout</li>
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default TopNavbar