import React, { useState, useRef } from 'react'
import MainCont from '../../components/MainCont/MainCont'
import Profile from '../../components/ProfileBar/Profile'
import LeftNavbar from '../../components/LeftNavbar'
import { Util, Notification } from "../../helpers/util"
import "./style.css"
import Layout from '../../components/Layout/Layout'

let util = new Util()
let notif = new Notification()

function Predict() {
    return (
        <Layout>
            <LeftNavbar active="predict" />
            <MainCont>
                <hr />
                <AddCases />
            </MainCont>
            <Profile />
        </Layout>
    )
}

export default Predict


function AddCases() {

    const [imageData, setImageData] = useState("")
    const file = useRef()

    function handlePreview() {
        file.current.click()

        file.current.addEventListener("change", (e) => {
            let fileData = file.current.files[0]
            let type = fileData.type.split("/")[1];
            let validType = ["png", "PNG", "JPEG", "JPG", "jpg", "jpeg"]

            if (!validType.includes(type)) {
                return notif.error("file isnt a valid type")
            }
            let reader = new FileReader()
            reader.readAsDataURL(fileData)
            reader.onload = () => {
                setImageData(reader.result)
            }

            reader.onerror = function () {
                return notif.error(reader.error);
            };

        })
    }

    return (
        <div className="predict-cont">
            <div className="head">
                <h3>Make Prediction</h3>
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
                    <label htmlFor="">Case Name</label>
                    <input type="text" disabled placeholder="Murder" defaultValue={"Murder"} className="input" />
                </div>
                <div className="box">
                    <label htmlFor="">Suspect Name</label>
                    <input type="text" placeholder="Suspect Name" defaultValue={"Husband Wife"} disabled className="input" />
                </div>
                <div className="box">
                    <div className="media-cont">
                        <div className="left">
                            <div className="bx">
                                <label htmlFor="">Suspect Image</label>
                                <button className="upload" onClick={() => {
                                    handlePreview()
                                }}>Upload</button>
                                <input type="file" accept="image/*" hidden className="file" ref={file} />
                            </div>
                            <div className="bx">
                                <label htmlFor="">Rank</label>
                                <select className="select">
                                    <option value={""}>1/10</option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, i) => {
                                        return (
                                            <option key={i} value={i}>{i}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="right">
                            <img src={imageData !== "" ? imageData : ""} alt="" className="preview" />
                        </div>
                    </div>
                </div>
                <hr />
                <div className="action">
                    <button className="cancel btn">Cancel</button>
                    <button className="add btn">Add Suspect</button>
                </div>
            </div>
        </div>
    )
}