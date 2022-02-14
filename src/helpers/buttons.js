import React, { useState } from "react"



export function SuccessBtn({ onClick, text, className }) {
    function handleClick() {
        if (onClick) {
            onClick()
        }
    }

    return (
        <button className={"btn " + className} onClick={handleClick} >{text}</button>
    )
}

export function DangerBtn({ onClick, text, className }) {
    function handleClick() {
        if (onClick) {
            onClick()
        }
    }

    return (
        <button className={"btn " + className} onClick={handleClick}>{text}</button>
    )
}
