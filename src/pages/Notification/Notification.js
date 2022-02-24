import React, { useState } from 'react'
import MainCont from '../../components/MainCont/MainCont'
import LeftNavbar from '../../components/LeftNavbar'

import "./style.css"
import Layout from '../../components/Layout/Layout'
import TopNavbar from '../../components/TopNavbar/Top'


function Notifications() {

    return (
        <Layout>
            <LeftNavbar active="notifications" />
            <MainCont>
                <TopNavbar activeBar="Notification" />

                <h4>Notifications</h4>
                <hr />
                <br />
            </MainCont>
        </Layout>
    )
}

export default Notifications