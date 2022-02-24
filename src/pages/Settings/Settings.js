import React, { useState } from 'react'
import MainCont from '../../components/MainCont/MainCont'
import LeftNavbar from '../../components/LeftNavbar'

import "./style.css"
import Layout from '../../components/Layout/Layout'
import TopNavbar from '../../components/TopNavbar/Top'


function Settings() {
    return (
        <Layout>
            <LeftNavbar active="settings" />
            <MainCont>
                <TopNavbar activeBar="Settings" />
                <h4>Settings</h4>
                <hr />
                <br />
            </MainCont>
        </Layout>
    )
}

export default Settings