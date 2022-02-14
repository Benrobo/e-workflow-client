import React, { useContext, useState } from 'react'
import "./style.css"
import DataContext from '../../context/DataContext'

function EditProfile() {

    const { showeditprofile, setShowEditProfile } = useContext(DataContext)

    const [showpwd, setShowPwd] = useState(false)

    return (
        <div className="edit-container">
            <div className="head">
                <h3>Edit Profile</h3>
            </div>
            <div className="bx">
                <label htmlFor="">Full Name</label>
                <input type="text" placeholder="John Doe" className="input" />
            </div>
            <div className="bx">
                <label htmlFor="">Mail</label>
                <input type="text" placeholder="john@mail.com" className="input" />
            </div>
            <div className="bx">
                <label htmlFor="">Type</label>
                <input type="text" placeholder="Inpector General" className="input" />
            </div>
            <div className="bx">
                <small>edit password <input type="checkbox" className="check" onChange={(e) => {
                    if (e.target.checked === true) {
                        return setShowPwd(true)
                    }
                    return setShowPwd(false)

                }} /> </small>
                {showpwd && <>
                    <label htmlFor="">Password</label>
                    <input type="text" placeholder="John Doe" className="input" />
                </>}
            </div>
            <div className="action">
                <button className="cancel btn" onClick={() => setShowEditProfile(!showeditprofile)}>Cancel</button>
                <button className="save btn">Save Changes</button>
            </div>
        </div>
    )
}

export default EditProfile