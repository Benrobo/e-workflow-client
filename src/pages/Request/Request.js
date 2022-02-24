import React, { useState } from 'react'
import MainCont from '../../components/MainCont/MainCont'
import LeftNavbar from '../../components/LeftNavbar'

import "./style.css"
import Layout from '../../components/Layout/Layout'
import TopNavbar from '../../components/TopNavbar/Top'


function Request() {
    return (
        <Layout>
            <LeftNavbar active="request" />
            <MainCont>
                <TopNavbar activeBar="Requests" />

                <h4>Request</h4>
                <hr />
                <br />
            </MainCont>
        </Layout>
    )
}

export default Request