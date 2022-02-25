import React, { createContext, useState, useEffect } from "react";
import apiRoutes from "../api_routes";

import { Util } from "../helpers/util";

const DataContext = createContext();

export default DataContext;

const util = new Util();

export function DataContextProvider(props) {
    const [authUserInfo, setAuthUserInfo] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // localstorageData
    const locData = util.getLocalstorageData();
    const localData = JSON.parse(localStorage.getItem("e-workflow"))

    //   togle profile edit container
    const [showeditprofile, setShowEditProfile] = useState(false)


    // log the user out
    function logout() {
        localStorage.clear();
        util.redirect("/signin", 100);
    }

    // handle users data
    async function getUsersId(userId) {
        try {
            setLoading(true)
            let url = apiRoutes.getUsersById;
            const data = {
                method: "post",
                headers: {
                    "content-type": "application/json",
                    "Authorization": `Bearer ${localData.refreshToken}`
                },
                body: JSON.stringify({ userId })
            }

            let req = await fetch(url, data);
            let res = await req.json();

            if (res && res.message && res.error === true) {
                setLoading(false);
                setError(res.message)
                setAuthUserInfo([])
                return { loading, data: authUserInfo, error }
            }

            setLoading(false);
            setAuthUserInfo(res.data);
            setError("")

            return { loading, data: authUserInfo, error }

        } catch (err) {
            setLoading(false)
            setError(err.message)
            setAuthUserInfo([])
            return { loading, data: authUserInfo, error }
        }
    }


    // handle sending of mail
    async function sendMail(payload) {
        const data = {}
        // verify
        if (Object.entries(payload).length === 0) {
            data["error"] = true;
            data["message"] = "sending of mail requires a valid payload but got none"
            return data;
        }

        try {
            let url = apiRoutes.sendMail;
            const data = {
                method: "post",
                headers: {
                    "content-type": "application/json",
                    "Authorization": `Bearer ${localData.refreshToken}`
                },
                body: JSON.stringify(payload)
            }

            let req = await fetch(url, data);
            let res = await req.json();

            return res;

        } catch (err) {
            data["error"] = true;
            data["message"] = err.message;
            return data;
        }
    }

    return (
        <DataContext.Provider value={{ logout, locData, localData, showeditprofile, setShowEditProfile, sendMail, getUsersId }}>
            {props.children}
        </DataContext.Provider>
    );
}
