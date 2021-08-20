import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { killWorkerScript } from "../src/Netscript/killWorkerScript";
import { RunningScript } from "../src/Script/RunningScript";

import { createElement } from "./uiHelpers/createElement";
import { removeElementById } from "./uiHelpers/removeElementById";

let gameContainer: HTMLElement;

(function() {
    function getGameContainer(): void {
        const container = document.getElementById("entire-game-container");
        if (container == null) {
            throw new Error(`Failed to find game container DOM element`)
        }

        gameContainer = container;
        document.removeEventListener("DOMContentLoaded", getGameContainer);
    }

    document.addEventListener("DOMContentLoaded", getGameContainer);
})();

interface IProps {
    script: RunningScript;
    container: HTMLElement;
    id: string;
}

function ScriptLogPopup(props: IProps): React.ReactElement {
    const setRerender = useState(false)[1];

    function rerender(): void {
        setRerender(old => !old);
    }

    useEffect(() => {
        const id = setInterval(rerender, 1000);
        return () => clearInterval(id);
    }, []);


    function close(): void {
        const content = document.getElementById(props.id);
        if (content == null) return;
        ReactDOM.unmountComponentAtNode(content);
        removeElementById(props.id);
    }

    function kill(): void {
        killWorkerScript(props.script, props.script.server, true);
        close();
    }

    function drag(event: React.MouseEvent<HTMLElement, MouseEvent>): void {
        event.preventDefault();
        //console.log(props.container.clientWidth);
        //console.log(props.container.clientHeight);
        let x = event.clientX;
        let y = event.clientY;
        let left = props.container.offsetLeft+props.container.clientWidth/2;
        let top = props.container.offsetTop+props.container.clientHeight/2;
        function mouseMove(event: MouseEvent): void {
            left+=event.clientX-x;
            top+=event.clientY-y;
            props.container.style.left=left+'px';
            props.container.style.top=top+'px';
            // reset right and bottom to avoid the window stretching
            props.container.style.right='';
            props.container.style.bottom='';
            x=event.clientX;
            y=event.clientY;
        }
        function mouseUp(): void {
            document.removeEventListener('mouseup', mouseUp)
            document.removeEventListener('mousemove', mouseMove)
        }
        document.addEventListener('mouseup', mouseUp)
        document.addEventListener('mousemove', mouseMove)
    }

    return (<>
        <div className="log-box-header" onMouseDown={drag}>
            <p>{props.script.filename} {props.script.args.map((x: any): string => `${x}`).join(' ')}</p>
            <div>
                <button className="log-box-button" onClick={kill}>Kill Script</button>
                <button className="log-box-button" onClick={close}>Close</button>
            </div>
        </div>
        <div className="log-box-log-container">
            <p>{props.script.logs.map((line: string, i: number): JSX.Element => <span key={i}>{line}<br /></span>)}</p>
        </div>
    </>);
}

export function logBoxCreate(script: RunningScript): void {
    const id = script.filename+script.args.map((x: any): string => `${x}`).join('');
    const container = createElement("div", {
        class: "log-box-container",
        id: id,
    });
    gameContainer.appendChild(container);
    ReactDOM.render(<ScriptLogPopup script={script} id={id} container={container} />, container);
}

