import React from "react";
import './button.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Modal from 'react-modal'
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import { useEffect } from "react";
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999
    },
};
const Button = (props) => {
    return (
        <div
            onClick={() => props.onClick && props.onClick()}
            className="buttonContainer "
            style={{
                background: props.backgroundColor || "white",
                width: props.width || "auto",
                display: props.inline ? "inline-block" : props.flex ? "flex" : "block",
                margin: props.margin || 0,
                marginLeft: props.marginLeft || 10,

            }}>

            <div className="buttonInnerContainer">
                <span className="buttonTitle" style={{ marginLeft: props.textMarginLeft || 0, textAlign: props.textAlign || "left" }}>{props.title}</span>
                {props.icon &&
                    <div className="button-icon-container">
                        <FontAwesomeIcon className="button-icon" size="sm" icon={faQuestionCircle} />
                    </div>
                }
            </div>

            <div>
            </div>

        </div>
    );
}

export default Button;
