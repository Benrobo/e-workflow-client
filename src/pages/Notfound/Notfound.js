import React, { useState } from 'react'
import "./style.css"

import { Util } from "../../helpers/util"

const util = new Util()

function Notfound() {
    return (
        <div className="notfound">
            <h3>Are you lost ?</h3>
            <br />
            <button className="btn" onClick={() => {
                if (util.isLoggedIn()) {
                    return window.location = ("http://localhost:3000/user/settings")
                }
                window.location = ("http://localhost:3000/signin")
            }}>
                Go Home
            </button>
        </div>
    )
}

export default Notfound