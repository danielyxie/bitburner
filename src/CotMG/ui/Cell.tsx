import * as React from "react";

type IProps = {
    onMouseEnter?: () => void;
    onClick?: () => void;
    color: string;
}

export function Cell(cellProps: IProps) {
    return (
        <div
            className="staneksgift_cell"
            style={{backgroundColor: cellProps.color}}
            onMouseEnter={cellProps.onMouseEnter}
            onClick={cellProps.onClick}
        />
    )
}
