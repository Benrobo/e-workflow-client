import React, { useState, useEffect, useContext } from 'react'
import MainCont from '../../components/MainCont/MainCont'
import LeftNavbar from '../../components/LeftNavbar'

import "./style.css"
import Layout from '../../components/Layout/Layout'
import TopNavbar from '../../components/TopNavbar/Top'
import { Notification, Util } from "../../helpers/util";
import DataContext from "../../context/DataContext";
import apiRoutes from "../../api_routes";

const notif = new Notification();
const util = new Util();

function Notifications() {
    const { locData, localData, fetchUser } = useContext(DataContext);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [updatingloading, setUpdatingLoading] = useState(false);
    const [data, setData] = useState([]);

    // update state
    const [update, setUpdate] = useState("notupdated")

    async function fetchNotifications() {
        try {
            let url = apiRoutes.getNotifications;
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
            setLoading(true);
            let res = await fetch(url, options);
            let data = await res.json();

            setLoading(false);

            if (data && data.error === true) {
                return setError(data.message);
            }
            setData(data.data);
            console.log(data);
        } catch (err) {
            setLoading(false);
            return setError(err.message);
        }
    }

    useEffect(() => {
        fetchNotifications();
    }, [update]);

    async function markAsRead(id, userid) {

        try {
            let url = apiRoutes.updateNotification;
            let options = {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${localData.refreshToken}`,
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    userId: userid,
                    notificationId: id
                })
            };
            let res = await fetch(url, options);
            let data = await res.json();

            if (data && data.error === true) {
                return notif.error(data.message);
            }
            setUpdate(update === "notupdated" ? "updated" : "notupdated")
        } catch (err) {
            return console.error(err.message);
        }
    }

    async function deleteNotification(id, userid) {
        try {
            let url = apiRoutes.deleteNotification;
            let options = {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localData.refreshToken}`,
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    userId: userid,
                    notificationId: id
                })
            };
            let res = await fetch(url, options);
            let data = await res.json();

            if (data && data.error === true) {
                return notif.error(data.message);
            }
            setUpdate(update === "notupdated" ? "updated" : "notupdated")
        } catch (err) {
            return console.error(err.message);
        }
    }

    const unreadNotifications = data.filter((not) => not.isSeen === "false").length

    return (
        <Layout>
            <LeftNavbar active="notifications" notificationCount={unreadNotifications} />
            <MainCont>
                <TopNavbar activeBar="Notification" />

                <hr />
                <br />
                <div className="notification-cont">
                    <div className="head">
                        <h4>Notifications</h4>
                        <hr />
                    </div>
                    <ul className="not-list">
                        {
                            loading ?
                                <p>Loading...</p>
                                :
                                error !== "" ?
                                    <p className='ml-5'>{error}</p>
                                    :
                                    data && data.length === 0 ?
                                        <p className='ml-3'>No notifications.</p>
                                        :
                                        data.map((not) => {
                                            return (
                                                <li key={not.id} className={not.isSeen === "false" ? "list unread" : "list read"}
                                                    data-not_id={not.id}
                                                    data-user_id={not.userId}
                                                    onClick={(async (e) => {

                                                        let tgt = e.target.dataset
                                                        if (Object.entries(tgt).length > 1) {
                                                            const { not_id, user_id } = tgt;

                                                            if (e.target.classList.contains("list")) {
                                                                return await markAsRead(not_id, user_id)
                                                            }
                                                        }
                                                    })}
                                                >
                                                    {not.message}
                                                    {not.isSeen === "false" && <kbd>unread</kbd>}

                                                    <button className="btn btn-danger"
                                                        data-not_id={not.id}
                                                        data-user_id={not.userId}
                                                        onClick={(async (e) => {

                                                            let tgt = e.target.dataset
                                                            if (Object.entries(tgt).length > 1) {
                                                                const { not_id, user_id } = tgt;

                                                                await deleteNotification(not_id, user_id)
                                                            }
                                                        })}>delete</button>
                                                </li>
                                            )
                                        })
                        }
                    </ul>
                </div>
            </MainCont>
        </Layout >
    )
}

export default Notifications