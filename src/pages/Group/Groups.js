import React, { useState } from 'react'
import MainCont from '../../components/MainCont/MainCont'
import LeftNavbar from '../../components/LeftNavbar'

import "./style.css"
import Layout from '../../components/Layout/Layout'
import TopNavbar from '../../components/TopNavbar/Top'


function Groups() {

    return (
        <Layout>
            <LeftNavbar active="groups" />
            <MainCont>
                <TopNavbar activeBar="Groups" />

                <h4>Groups</h4>
                <hr />
                <br />
            </MainCont>
        </Layout>
    )
}

export default Groups