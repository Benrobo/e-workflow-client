import React from 'react'
import MainCont from '../../components/MainCont/MainCont'
import Profile from '../../components/ProfileBar/Profile'
import LeftNavbar from '../../components/LeftNavbar'

import "./style.css"
import Layout from '../../components/Layout/Layout'
import { BsTrashFill } from 'react-icons/bs'


function Evidence() {
    return (
        <Layout>
            <LeftNavbar active="evidence" />
            <MainCont>
                <h4>View Evidence</h4>
                <br />
                <div className="evidence-top-head">
                    <div className="bx">
                        <label htmlFor="">Case ID</label>
                        <select name="" id="" className="select">
                            <option value="">-- case id ---</option>
                        </select>
                    </div>
                    <br />
                    <EvidenceTable />
                </div>
            </MainCont>
            <Profile />
        </Layout>
    )
}

export default Evidence


function EvidenceTable() {

    return (
        <div className="evidence-cont mt-5">
            <div className="head">
                <p>All Cases</p>
                <br />
                <div className="head-action">
                    clear all
                    <BsTrashFill className="icon" />
                </div>
            </div>
            <br />
            <div className="body">
                <table className="tbl-body table-hover table-striped">
                    <thead>
                        <th>Case Id</th>
                        <th>Evidence</th>
                        <th>Suspect Name</th>
                        <th>Note</th>
                        <th>Rank</th>
                        <th>Officer Name</th>
                        <th>Action</th>
                    </thead>
                    <tbody>
                        {Array.from("123vfvv").map((_, i) => {
                            return (
                                <tr className="mt-3" key={i}>
                                    <td>
                                        <small>sdsdf43fvfdv</small>
                                    </td>
                                    <td>
                                        <small>Knife and Bottle</small>
                                    </td>
                                    <td>
                                        <small>Husband Wife</small>
                                    </td>
                                    <td className="status">
                                        <small>Badass Guy</small>
                                    </td>
                                    <td>
                                        <small>7</small>
                                    </td>
                                    <td>
                                        <small>John Doe</small>
                                    </td>
                                    <td className="action">
                                        <BsTrashFill className="icon" />
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}