import React, { useState } from 'react'
import MainCont from '../../components/MainCont/MainCont'
import Profile from '../../components/ProfileBar/Profile'
import LeftNavbar from '../../components/LeftNavbar'

import "./style.css"
import Layout from '../../components/Layout/Layout'
import { UserCards } from '../../components/Cards'

function Users() {

    const [toggleAction, setToggleAction] = useState(false)

    return (
        <Layout>
            <LeftNavbar active="users" />
            <MainCont>
                <div className="head">
                    <h5>Registered Users</h5>
                </div>
                <hr />
                <br />

                <div className="users-cards-cont">
                    <UserCards setToggleAction={setToggleAction} toggleAction={toggleAction} />
                </div>
            </MainCont>
            <Profile />
        </Layout>
    )
}

export default Users
