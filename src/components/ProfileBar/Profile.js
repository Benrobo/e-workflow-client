import React, { useContext } from 'react'


import "./style.css"

import { HiOutlineCog } from 'react-icons/hi'
import { FiEdit } from 'react-icons/fi'
import DataContext from '../../context/DataContext'

function Profile() {
    const { showeditprofile, setShowEditProfile } = useContext(DataContext)

    return (
        <div className="profile-container">
            <div className="user-info">
                <img src={`https://avatars.dicebear.com/api/micah/ben.svg`} alt="" />
                <h4>John Doe</h4>
                <small>john@mail.com</small>
                <p className="type">admin</p>
            </div>
            <br />
            <div className="action">
                {/* <HiOutlineCog className="icon" /> */}
                <FiEdit className="icon" onClick={() => setShowEditProfile(!showeditprofile)} />
            </div>
        </div>
    )
}

export default Profile