import React, { useState } from 'react'
import MainCont from '../../components/MainCont/MainCont'
import Profile from '../../components/ProfileBar/Profile'
import LeftNavbar from '../../components/LeftNavbar'

import "./style.css"
import Layout from '../../components/Layout/Layout'
import { SuspectCards } from '../../components/Cards'


function Suspects() {
    const [toggleAction, setToggleAction] = useState(false)

    return (
        <Layout>
            <LeftNavbar active="suspects" />
            <MainCont>
                <h4>Suspects</h4>
                <hr />
                <br />
                <SuspectCards setToggleAction={setToggleAction} toggleAction={toggleAction} />
            </MainCont>
            <Profile />
        </Layout>
    )
}

export default Suspects