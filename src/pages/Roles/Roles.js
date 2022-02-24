import React, { useState } from 'react'
import MainCont from '../../components/MainCont/MainCont'
import LeftNavbar from '../../components/LeftNavbar'

import "./style.css"
import Layout from '../../components/Layout/Layout'
import TopNavbar from '../../components/TopNavbar/Top'


function Roles() {

    return (
        <Layout>
            <LeftNavbar active="roles" />
            <MainCont>
                <TopNavbar activeBar="Roles" />

                <h4>Roles</h4>
                <hr />
                <br />
            </MainCont>
        </Layout>
    )
}

export default Roles