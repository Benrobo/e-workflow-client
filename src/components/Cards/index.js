import React from 'react'

import "./style.css"
import { FiMoreVertical } from 'react-icons/fi'
import img from "../../assets/img/police.png"

export function UserCards({ setToggleAction, toggleAction }) {

    return (
        <div className="user-box">
            <div className="top">
                <img src={img} alt="" className="img" />
                {toggleAction && <div className="more-cont">
                    <li>Delete</li>
                </div>}
                <br />
                <FiMoreVertical className="icon" onClick={() => setToggleAction(!toggleAction)} />
                <p className="name">John Doe</p>
                <small>john@mail.com</small>
                <div className="officer-type">
                    <div className="left">Type</div>
                    <div className="right">Inspector General</div>
                </div>
            </div>
            <div className="bottom">
                <div className="box">
                    <small>Cases</small>
                    <h6>6</h6>
                </div>
                <div className="box">
                    <small>Member since</small>
                    <h6>Feb 2, 2020</h6>
                </div>
            </div>
        </div>
    )
}

export function SuspectCards({ setToggleAction, toggleAction }) {

    return (
        <div className="user-box">
            <div className="top">
                <img src={img} alt="" className="img" />
                {toggleAction && <div className="more-cont">
                    <li>Delete</li>
                </div>}
                <br />
                <FiMoreVertical className="icon" onClick={() => setToggleAction(!toggleAction)} />
                <p className="name">John Doe</p>
                <small>June 10, 2022</small>
                <div className="officer-type">
                    <div className="left">Case Id</div>
                    <div className="right">2345454365346</div>
                </div>
            </div>
            <div className="bottom">
                <div className="box">
                    <small>Physical Score</small>
                    <h6>9/10</h6>
                </div>
                <div className="box mid">
                    <small>Logical Score</small>
                    <h6>5/10</h6>
                </div>
                <div className="box">
                    <small>Probability</small>
                    <h6>70%</h6>
                </div>
            </div>
        </div>
    )
}