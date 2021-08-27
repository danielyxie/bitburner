import React from 'react';

interface IProps {
    current: boolean;
    text: string;
    onClick: () => void;
}

export function HeaderTab(props: IProps) {
    let className = "cmpy-mgmt-header-tab";
    if (props.current) {
        className += " current";
    }

    return (
        <button className={className} onClick={props.onClick}>
            {props.text}
        </button>
    )
}