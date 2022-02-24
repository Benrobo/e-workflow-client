import React, { useContext, useState } from 'react'
import MainCont from '../../components/MainCont/MainCont'
import LeftNavbar from '../../components/LeftNavbar'
import Layout from '../../components/Layout/Layout'
import TopNavbar from '../../components/TopNavbar/Top'
import { BsTrashFill } from 'react-icons/bs'
import { Notification } from '../../helpers/util'
import "./style.css"

import DataContext from '../../context/DataContext'

const notyf = new Notification()

const template = `
    <h3>Hello, from e-workflow system.</h3>
    <p> You've requested a one time token for authentication. </p>
    <br />

    Here is your one time 6-digit token.

    Token: <h2><b> #token-here </b></h2>
`

function SendMail() {
    const { sendMail } = useContext(DataContext)
    const [loading, setLoading] = useState(false)
    const [subject, setSubject] = useState("E-workflow System")
    const [from, setFrom] = useState("")
    const [to, setTo] = useState("")
    const [message, setMessage] = useState(template)

    async function handleMail() {
        if (subject === "") {
            return notyf.error("mail subject cant be empty")
        }
        if (from === "") {
            return notyf.error("mail {from} cant be empty")
        }
        if (to === "") {
            return notyf.error("mail {to} cant be empty")
        }
        if (message === "") {
            return notyf.error("mail {body} cant be empty")
        }

        let payload = {
            from,
            to,
            subject,
            body: message
        }

        setLoading(true)

        let result = await sendMail(payload)

        setLoading(false)

        if (result && result.error === true && result.message !== undefined) {
            return notyf.error(result.message)
        }
        return notyf.success(result.message)
    }

    return (
        <Layout>
            <LeftNavbar active="sendMail" />
            <MainCont>
                <TopNavbar activeBar="SendMail" />
                <br />
                <div className="sendmail-cont">
                    <div className="bx">
                        <label htmlFor="">Subject</label>
                        <input type="text" className="input" placeholder='mail subject' defaultValue={subject} onChange={(e) => setSubject(e.target.value)} />
                    </div>
                    <div className="d-flex">
                        <div className="bx">
                            <label htmlFor="">From</label>
                            <input type="text" className="input" placeholder='address@gmail.com' defaultValue={from} onChange={(e) => setFrom(e.target.value)} />
                        </div>
                        <div className="bx">
                            <label htmlFor="">To</label>
                            <input type="text" className="input" placeholder='address@gmail.com' defaultValue={to} onChange={(e) => setTo(e.target.value)} />
                        </div>
                    </div>
                    <div className="bx">
                        <label htmlFor="">Message</label>
                        <textarea className='message input' id="" cols="30" rows="10" maxLength={700} defaultValue={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                    </div>
                    <div className="action bx">
                        <button className="btn-block send-btn" onClick={() => {
                            handleMail()
                        }}>
                            {loading ? "Sending...." : "Send Mail"}
                        </button>
                    </div>
                </div>
            </MainCont>
        </Layout>
    )
}


export default SendMail;