import React from 'react'
import MainCont from '../../components/MainCont/MainCont'
import Profile from '../../components/ProfileBar/Profile'
import LeftNavbar from '../../components/LeftNavbar'

import "./style.css"
import Layout from '../../components/Layout/Layout'
import { FiRefreshCcw } from 'react-icons/fi'


function Cases() {
    return (
        <Layout>
            <LeftNavbar active="cases" />
            <MainCont>
                <AddCases />
            </MainCont>
            <Profile />
        </Layout>
    )
}

export default Cases

function AddCases() {

    return (
        <div className="cases-cont">
            <div className="head">
                <h3>Add Cases</h3>
            </div>
            <br />
            <div className="form-cont">
                <div className="box">
                    <label htmlFor="">Case ID</label>
                    <div className="genid">
                        <input type="text" defaultValue={"23425r2r"} className="input" />
                        <FiRefreshCcw className="icon" />
                    </div>
                </div>
                <div className="box">
                    <label htmlFor="">Case Name</label>
                    <input type="text" placeholder="Murder" defaultValue={"Murder"} className="input" />
                </div>
                <div className="box">
                    <label htmlFor="">Officer ID</label>
                    <select className="select">
                        <option value=""> --- officer id ---</option>
                    </select>
                </div>
                <div className="box">
                    <label htmlFor="">Officer Name</label>
                    <input type="text" disabled className="input" />
                </div>
                <div className="box">
                    <label htmlFor="">Note</label>
                    <textarea cols="30" rows="3" defaultValue={"some note here"} className="note"></textarea>
                </div>
                <div className="action">
                    <button className="cancel btn">Cancel</button>
                    <button className="add btn">Add Case</button>
                </div>
            </div>
        </div>
    )
}