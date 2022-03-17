import React, { useState, useEffect, useContext } from 'react'
import MainCont from '../../components/MainCont/MainCont'
// import Profile from '../../components/ProfileBar/Profile'
import LeftNavbar from '../../components/LeftNavbar'

import "./style.css"
import Layout from '../../components/Layout/Layout'
import DataContext from '../../context/DataContext'
import Badge from '../../components/Badge/badge'
import apiRoutes from '../../api_routes'

function Users() {
    const { locData, localData, fetchUser } = useContext(DataContext);
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);




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
                setData([])
                return
            }

            setLoading(false);
            setData(res.data);
            setError("")
        })()
    }, [])

    return (
        <Layout>
            <LeftNavbar active={"users"} />
            <MainCont>
                <div className="head">
                    <h5>Registered Users</h5>
                </div>
                <hr />

                {loading ?
                    <p>Loading</p>
                    :
                    error !== "" ?
                        <p>{error}</p>
                        :
                        <table className="">
                            <thead>
                                <tr>
                                    <th>Avatar</th>
                                    <th>Username</th>
                                    <th>Type</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data && data.length === 0 ?
                                        <tr>
                                            <td>No user found</td>
                                        </tr>
                                        :
                                        data.map((user) => {
                                            return (
                                                <tr>
                                                    <td>
                                                        <img src={`https://avatars.dicebear.com/api/initials/${user.userName}.svg`} alt="" />
                                                    </td>
                                                    <td>
                                                        {user.userName}
                                                    </td>
                                                    <td>
                                                        {user.type}
                                                    </td>
                                                    <td>
                                                        {user.userRole}
                                                    </td>
                                                    <td>
                                                        <Badge text={user.userStatus}
                                                            color={user.userStatus === "pending" ? "p" : "a"}
                                                        />
                                                    </td>
                                                </tr>
                                            )
                                        })
                                }
                            </tbody>
                        </table>
                }

            </MainCont>
        </Layout>
    )
}

export default Users


