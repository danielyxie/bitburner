import React, { useState, useEffect, useRef } from 'react';
import { StdButton } from "../../ui/React/StdButton";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import IStandaloneCodeEditor = monaco.editor.IStandaloneCodeEditor;
import { createPopup } from "../../ui/React/createPopup";
import { OptionsPopup } from "./OptionsPopup";
import { Options } from "./Options";
import { js_beautify as beautifyCode } from 'js-beautify';
import { isValidFilePath } from "../../Terminal/DirectoryHelpers";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { IEngine } from "../../IEngine";
import { dialogBoxCreate } from "../../../utils/DialogBox";
import { parseFconfSettings } from "../../Fconf/Fconf";
import { isScriptFilename } from "../../Script/ScriptHelpersTS";
import { Script } from "../../Script/Script";
import { TextFile } from "../../TextFile";
import { calculateRamUsage } from "../../Script/RamCalculations";
import { RamCalculationErrorCode } from "../../Script/RamCalculationErrorCodes";
import { numeralWrapper } from "../../ui/numeralFormat";
import { CursorPositions } from "../../ScriptEditor/CursorPositions";
import * as NetscriptDefinitions from "../NetscriptDefinitions";

interface IProps {
    filename: string;
    code: string;
    player: IPlayer;
    engine: IEngine;
};

// How to load function definition in monaco
// https://github.com/Microsoft/monaco-editor/issues/1415
// https://microsoft.github.io/monaco-editor/api/modules/monaco.languages.html
// https://www.npmjs.com/package/@monaco-editor/react#development-playground
// https://microsoft.github.io/monaco-editor/playground.html#extending-language-services-custom-languages

export function Root(props: IProps): React.ReactElement {
    const editorRef = useRef<IStandaloneCodeEditor | null>(null);
    const [filename, setFilename] = useState(props.filename);
    const [code, setCode] = useState<string>(props.code);
    const [ram, setRAM] = useState('');
    const [options, setOptions] = useState<Options>({theme: 'vs-dark', insertSpaces: false});

    function save(): void {
        if(editorRef.current !== null) {
            const position = editorRef.current.getPosition();
            if(position !== null) {
                CursorPositions.saveCursor(filename, {
                    row: position.lineNumber,
                    column: position.column,
                });
            }
        }

        // TODO(hydroflame): re-enable the tutorial.
        // if (ITutorial.isRunning && ITutorial.currStep === iTutorialSteps.TerminalTypeScript) {
        //     //Make sure filename + code properly follow tutorial
        //     if (filename !== "n00dles.script") {
        //         dialogBoxCreate("Leave the script name as 'n00dles'!");
        //         return;
        //     }
        //     code = code.replace(/\s/g, "");
        //     if (code.indexOf("while(true){hack('n00dles');}") == -1) {
        //         dialogBoxCreate("Please copy and paste the code from the tutorial!");
        //         return;
        //     }

        //     //Save the script
        //     let s = Player.getCurrentServer();
        //     for (var i = 0; i < s.scripts.length; i++) {
        //         if (filename == s.scripts[i].filename) {
        //             s.scripts[i].saveScript(getCurrentEditor().getCode(), Player.currentServer, Player.getCurrentServer().scripts);
        //             Engine.loadTerminalContent();
        //             return iTutorialNextStep();
        //         }
        //     }

        //     // If the current script does NOT exist, create a new one
        //     let script = new Script();
        //     script.saveScript(getCurrentEditor().getCode(), Player.currentServer, Player.getCurrentServer().scripts);
        //     s.scripts.push(script);

        //     return iTutorialNextStep();
        // }

        if (filename == "") {
            dialogBoxCreate("You must specify a filename!");
            return;
        }

        if (filename !== ".fconf" && !isValidFilePath(filename)) {
            dialogBoxCreate("Script filename can contain only alphanumerics, hyphens, and underscores, and must end with an extension.");
            return;
        }

        const s = props.player.getCurrentServer();
        if (filename === ".fconf") {
            try {
                parseFconfSettings(code);
            } catch(e) {
                dialogBoxCreate(`Invalid .fconf file: ${e}`);
                return;
            }
        } else if (isScriptFilename(filename)) {
            //If the current script already exists on the server, overwrite it
            for (let i = 0; i < s.scripts.length; i++) {
                if (filename == s.scripts[i].filename) {
                    s.scripts[i].saveScript(code, props.player.currentServer, props.player.getCurrentServer().scripts);
                    props.engine.loadTerminalContent();
                    return;
                }
            }

            //If the current script does NOT exist, create a new one
            const script = new Script();
            script.saveScript(code, props.player.currentServer, props.player.getCurrentServer().scripts);
            s.scripts.push(script);
        } else if (filename.endsWith(".txt")) {
            for (let i = 0; i < s.textFiles.length; ++i) {
                if (s.textFiles[i].fn === filename) {
                    s.textFiles[i].write(code);
                    props.engine.loadTerminalContent();
                    return;
                }
            }
            const textFile = new TextFile(filename, code);
            s.textFiles.push(textFile);
        } else {
            dialogBoxCreate("Invalid filename. Must be either a script (.script) or " +
                            " or text file (.txt)")
            return;
        }
        props.engine.loadTerminalContent();
    }

    function beautify(): void {
        setCode(code => beautifyCode(code, {
            indent_with_tabs: !options.insertSpaces,
            indent_size: 4,
            brace_style: "preserve-inline",
        }));
    }

    function onFilenameChange(event: React.ChangeEvent<HTMLInputElement>): void {
        setFilename(event.target.value);
    }

    function openOptions(): void {
        const id="script-editor-options-popup";
        createPopup(id, OptionsPopup, {
            id: id,
            options: {
                theme: options.theme,
                insertSpaces: options.insertSpaces,
            },
            save: (options: Options) => setOptions(options),
        });
    }

    function updateCode(newCode?: string): void {
        if(newCode === undefined) return;
        setCode(newCode);
    }

    async function updateRAM(): Promise<void> {
        const codeCopy = code+"";
        const ramUsage = await calculateRamUsage(codeCopy, props.player.getCurrentServer().scripts);
        if (ramUsage > 0) {
            setRAM("RAM: " + numeralWrapper.formatRAM(ramUsage));
            return;
        }
        switch (ramUsage) {
            case RamCalculationErrorCode.ImportError: {
                setRAM("RAM: Import Error");
                break;
            }
            case RamCalculationErrorCode.URLImportError: {
                setRAM("RAM: HTTP Import Error");
                break;
            }
            case RamCalculationErrorCode.SyntaxError: 
            default: {
                setRAM("RAM: Syntax Error");
                break;
            }
        }
        return new Promise<void>(() => undefined);
    }

    useEffect(() => {
        const id = setInterval(updateRAM, 1000);
        return () => clearInterval(id);
    }, [code]);

    function onMount(editor: IStandaloneCodeEditor): void {
        editorRef.current = editor;
        if(editorRef.current === null) return;
        const position = CursorPositions.getCursor(filename);
        editorRef.current.setPosition({lineNumber: position.row, column: position.column});
        editorRef.current.focus();
    }

    return (<div id="script-editor-wrapper">
        <div id="script-editor-filename-wrapper">
            <p id="script-editor-filename-tag" className="noselect"> <strong style={{backgroundColor:'#555'}}>Script name: </strong></p>
            <input id="script-editor-filename" type="text" maxLength={100} tabIndex={1} value={filename} onChange={onFilenameChange} />
            <StdButton text={"options"} onClick={openOptions} />
        </div>
        <Editor
            onMount={onMount}
            loading={<p>Loading script editor!</p>}
            height="80%"
            defaultLanguage="javascript"
            defaultValue={code}
            value={code}
            onChange={updateCode}
            theme="vs-dark"
            options={options}
        />
        <div id="script-editor-buttons-wrapper">
            <StdButton text={"Beautify"} onClick={beautify} />
            <p id="script-editor-status-text" style={{display:"inline-block", margin:"10px"}}>{ram}</p>
            <button className="std-button" style={{display: "inline-block"}} onClick={save}>Save & Close (Ctrl/Cmd + b)</button>
            <a className="std-button" style={{display: "inline-block"}} target="_blank" href="https://bitburner.readthedocs.io/en/latest/index.html">Netscript Documentation</a>
        </div>
    </div>);
}