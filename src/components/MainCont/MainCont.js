import React, { useContext } from 'react'
import Modal from '../Modal/Modal'

import "./style.css"

import DataContext from '../../context/DataContext'

function MainCont({ children }) {
    const { showeditprofile } = useContext(DataContext)

    return (
        <div className="main-container">
            {children}
        </div>
    )
}

export default MainCont


