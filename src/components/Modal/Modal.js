
import React from 'react'
import "./style.css"

function Modal({ children, setVisibility }) {
    return (
        <div className="modal-cont" data-type="modal" onClick={(e) => {
            if (e.target.dataset.type !== undefined) {
                setVisibility(false)
            }
        }}>
            {children}
        </div>
    )
}

export default Modal


