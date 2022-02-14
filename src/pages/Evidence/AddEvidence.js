import React from 'react'
import MainCont from '../../components/MainCont/MainCont'
import Profile from '../../components/ProfileBar/Profile'
import LeftNavbar from '../../components/LeftNavbar'

import "./style.css"
import Layout from '../../components/Layout/Layout'


function AddEvidence() {
    return (
        <Layout>
            <LeftNavbar active="addEvidence" />
            <MainCont>
                <AddEvidenceForm />
            </MainCont>
            <Profile />
        </Layout>
    )
}

export default AddEvidence



function AddEvidenceForm() {

    return (
        <div className="addevidence-cont">
            <div className="head">
                <h3>Add Evidence</h3>
            </div>
            <br />
            <div className="form-cont">
                <div className="box">
                    <label htmlFor="">Case ID</label>
                    <select className="select">
                        <option value=""> --- case id ---</option>
                    </select>
                </div>
                <div className="box">
                    <label htmlFor="">Evidence</label>
                    <input type="text" placeholder="Knife and bottle" defaultValue={"Knife and Bottle"} className="input" />
                </div>
                <div className="box">
                    <label htmlFor="">Suspect Name</label>
                    <select className="select">
                        <option value=""> --- suspect name---</option>
                        <option value="">husband wife</option>
                    </select>
                </div>
                <div className="box">
                    <label htmlFor="">Note</label>
                    <textarea cols="30" rows="2" defaultValue={"some note here"} className="note"></textarea>
                </div>
                <hr />
                <div className="action">
                    <button className="cancel btn">Cancel</button>
                    <button className="add btn">Add Evidence</button>
                </div>
            </div>
        </div>
    )
}


