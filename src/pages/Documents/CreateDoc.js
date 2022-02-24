import React, { useState } from 'react'
import MainCont from '../../components/MainCont/MainCont'
import LeftNavbar from '../../components/LeftNavbar'

import "./style.css"
import Layout from '../../components/Layout/Layout'
import TopNavbar from '../../components/TopNavbar/Top'


function CreateDocument() {
    const [toggleAction, setToggleAction] = useState(false)

    return (
        <Layout>
            <LeftNavbar active="addDocument" />
            <MainCont>
                <TopNavbar activeBar="Submit Document" />

                <h4>Submit Document</h4>
                <hr />
                <br />
            </MainCont>
        </Layout>
    )
}

export default CreateDocument