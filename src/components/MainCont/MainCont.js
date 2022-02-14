import React, { useContext } from 'react'
import Modal from '../Modal/Modal'
import EditProfile from '../ProfileBar/EditProfile'

import "./style.css"

import DataContext from '../../context/DataContext'

function MainCont({ children }) {
    const { showeditprofile } = useContext(DataContext)

    return (
        <div className="main-container">
            {showeditprofile && <Modal>
                <EditProfile />
            </Modal>}
            {children}
        </div>
    )
}

export default MainCont


