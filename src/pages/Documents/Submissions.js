import React, { useState } from 'react'
import MainCont from '../../components/MainCont/MainCont'
import LeftNavbar from '../../components/LeftNavbar'

import "./style.css"
import Layout from '../../components/Layout/Layout'
import TopNavbar from '../../components/TopNavbar/Top'


function Submissions() {

    return (
        <Layout>
            <LeftNavbar active="submissions" />
            <MainCont>
                <TopNavbar activeBar="Submissions" />

                <h4>Submissions</h4>
                <hr />
                <br />
            </MainCont>
        </Layout>
    )
}

export default Submissions