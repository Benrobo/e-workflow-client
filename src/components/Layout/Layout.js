import React from 'react'
import "./style.css"


function Layout({ children }) {
    return (
        <div className="layout">{children}</div>
    )
}

export default Layout