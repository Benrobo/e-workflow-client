import React from "react";
import "./style.css";

function Badge({ text, color }) {
    // p -- pending
    // r --- rejected
    // a --- approved

    return (
        <span
            className={
                color === "p"
                    ? "status pending"
                    : color === "r"
                        ? "status rejected"
                        : color === "a"
                            ? "status approved"
                            : "status"
            }
        >
            <span>{text === undefined ? "status-comp" : text}</span>
        </span>
    );
}

export default Badge;
