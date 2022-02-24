import React, { useState } from 'react'
import MainCont from '../../components/MainCont/MainCont'
import LeftNavbar from '../../components/LeftNavbar'

import "./style.css"
import Layout from '../../components/Layout/Layout'
import TopNavbar from '../../components/TopNavbar/Top'


function Permissions() {

    return (
        <Layout>
            <LeftNavbar active="permission" />
            <MainCont>
                <TopNavbar activeBar="Permissions" />

                <h4>Permission</h4>
                <hr />
                <br />
            </MainCont>
        </Layout>
    )
}

export default Permissions