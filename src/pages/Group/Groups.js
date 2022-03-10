import React, { useState } from 'react'
import MainCont from '../../components/MainCont/MainCont'
import LeftNavbar from '../../components/LeftNavbar'

import "./style.css"
import Layout from '../../components/Layout/Layout'
import TopNavbar from '../../components/TopNavbar/Top'

// import { } from "react-icons/fa"
import { BiPlus } from "react-icons/bi"

function Groups() {

    return (
        <Layout>
            <LeftNavbar active="groups" />
            <MainCont>
                <TopNavbar activeBar="Groups" />

                <div className="group-list">
                    <div className="left">
                        <button className="btn create">
                            <BiPlus className="icon" />
                            Create Group
                        </button>
                    </div>
                    <div className="right">
                        {Array.from("sdcdsc").map((list, i) => {
                            return (
                                <div className="group-card" key={i}>
                                    <img src={`https://avatars.dicebear.com/api/initials/group-${i}.svg`} alt="" />
                                    <div className="more">
                                        <p>Group Falcon</p>
                                        <span className="mem">3</span>
                                        <br />
                                        <button className="btn view-member">view members</button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </MainCont>
        </Layout>
    )
}

export default Groups




function CreateGroup() {

}

