import React, { useState, useRef, useEffect } from "react";

interface ILineProps {
    content: any;
}

function Line(props: ILineProps): React.ReactElement {
    return (<tr>
        <td className="bladeburner-console-line" style={{color: 'var(--my-font-color)', whiteSpace: 'pre-wrap'}}>{props.content}</td>
    </tr>)
}

interface IProps {
    bladeburner: any;
}

export function Console(props: IProps): React.ReactElement {
    const lastRef = useRef<HTMLDivElement>(null);
    const setRerender = useState(false)[1];

    const [consoleHistoryIndex, setConsoleHistoryIndex] = useState(props.bladeburner.consoleHistory.length);

    // TODO: Figure out how to actually make the scrolling work correctly.
    function scrollToBottom() {
        if(lastRef.current)
            lastRef.current.scrollTop = lastRef.current.scrollHeight;
    }

    function rerender() {
        setRerender(old => !old);
    }

    useEffect(() => {
        const id = setInterval(rerender, 1000);
        const id2 = setInterval(scrollToBottom, 100);
        return () => {
            clearInterval(id);
            clearInterval(id2);
        };
    }, []);

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
        if (event.keyCode === 13) {
            event.preventDefault();
            const command = event.currentTarget.value;
            event.currentTarget.value = "";
            if (command.length > 0) {
                props.bladeburner.postToConsole("> " + command);
                props.bladeburner.executeConsoleCommands(command);
                setConsoleHistoryIndex(props.bladeburner.consoleHistory.length);
                rerender();
            }
        }

        const consoleHistory = props.bladeburner.consoleHistory;

        if (event.keyCode === 38) { // up
            let i = consoleHistoryIndex;
            const len = consoleHistory.length;
            if (len === 0) {return;}
            if (i < 0 || i > len) {
                setConsoleHistoryIndex(len);
            }

            if (i !== 0) {
                i = i-1;
            }
            setConsoleHistoryIndex(i);
            const prevCommand = consoleHistory[i];
            event.currentTarget.value = prevCommand;
        }

        if (event.keyCode === 40) {
            const i = consoleHistoryIndex;
            const len = consoleHistory.length;

            if (len == 0) {return;}
            if (i < 0 || i > len) {
                setConsoleHistoryIndex(len);
            }

            // Latest command, put nothing
            if (i == len || i == len-1) {
                setConsoleHistoryIndex(len);
                event.currentTarget.value = "";
            } else {
                setConsoleHistoryIndex(consoleHistoryIndex+1);
                const prevCommand = consoleHistory[consoleHistoryIndex+1];
                event.currentTarget.value = prevCommand;
            }
        }
    }

    return (<div ref={lastRef} className="bladeburner-console-div">
        <table className="bladeburner-console-table">
            <tbody>
                {/*
                    TODO: optimize this.
                    using `i` as a key here isn't great because it'll re-render everything
                    everytime the console reaches max length.
                */}
                {props.bladeburner.consoleLogs.map((log: any, i: number) => <Line key={i} content={log} />)}
                <tr key="input" id="bladeburner-console-input-row" className="bladeburner-console-input-row">
                    <td className="bladeburner-console-input-cell">
                        <pre>{"> "}</pre><input autoFocus className="bladeburner-console-input" tabIndex={1} type="text" onKeyDown={handleKeyDown} />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>);
}