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
    const [data, setData] = useState([]);

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
    }, []);

    return (
        <Layout>
            <LeftNavbar active="notifications" />
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
                                    <p>{error}</p>
                                    :
                                    data && data.length === 0 ?
                                        <p>No notifications.</p>
                                        :
                                        data.map((not) => {
                                            return (
                                                <li className={not.isSeen === "false" ? "list unread" : "list read"} dangerouslySetInnerHTML={not.message}>{not.message}</li>
                                            )
                                        })
                        }
                    </ul>
                </div>
            </MainCont>
        </Layout>
    )
}

export default Notifications