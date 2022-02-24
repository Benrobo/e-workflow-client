import React, { useState } from 'react'
import { Link } from "react-router-dom"
import MainCont from '../../components/MainCont/MainCont'
import LeftNavbar from '../../components/LeftNavbar'
import { Util, Notification } from "../../helpers/util"
import "./style.css"
import Layout from '../../components/Layout/Layout'
import TopNavbar from '../../components/TopNavbar/Top'
import { FiVideo } from 'react-icons/fi'
import { FaCopy } from 'react-icons/fa'

let util = new Util()
let notif = new Notification()

function Collab() {

    const [meetingId, setMeetingId] = useState("")
    const [startMeeting, setStartMeeting] = useState(false)

    function createMeeting() {
        let formated = `${util.genId(4)}-${util.genId(4)}-${util.genId(4)}`

        setMeetingId(formated)

        setStartMeeting(true)
    }

    return (
        <Layout>
            <LeftNavbar active="collab" />
            <MainCont>
                <TopNavbar activeBar="Collab" />
                <hr />
                <div className="collab-head">
                    <p>Collaborate faster with your teams.</p>
                    <button className="btn collab" onClick={() => createMeeting()}>
                        <FiVideo className="icon" /> Create Meeting
                    </button>
                </div>
                <hr />
                {startMeeting && <MeetingInfo id={meetingId} />}

            </MainCont>
        </Layout>
    )
}

export default Collab


function MeetingInfo({ id }) {

    let link = `/user/meeting/${id}`

    return (
        <div className="meeting-info">
            <FaCopy className='icon' />
            <br />
            <h2>Copy Link</h2>
            <br />
            <p>Please copy the link below.</p>
            <Link to={link} target="_blank" className="link">http://localhost:3000{link}</Link>
            <br />
            <button className="copy btn" onClick={() => {
                navigator.clipboard.writeText(link);
                notif.success("link coppied")
            }}>Copy</button>
            <button className="continue btn" onClick={() => {
                let a = document.createElement("a");
                a.href = link;
                a.target = "_blank"
                a.click()
            }}>Continue to meeting</button>
        </div>
    )
}