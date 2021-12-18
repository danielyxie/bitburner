import React, { useState, useEffect, useRef, useMemo } from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
type IStandaloneCodeEditor = monaco.editor.IStandaloneCodeEditor;
type ITextModel = monaco.editor.ITextModel;
import { OptionsModal } from "./OptionsModal";
import { Options } from "./Options";
import { isValidFilePath } from "../../Terminal/DirectoryHelpers";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { IRouter } from "../../ui/Router";
import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { isScriptFilename } from "../../Script/isScriptFilename";
import { Script } from "../../Script/Script";
import { TextFile } from "../../TextFile";
import { calculateRamUsage, checkInfiniteLoop } from "../../Script/RamCalculations";
import { RamCalculationErrorCode } from "../../Script/RamCalculationErrorCodes";
import { numeralWrapper } from "../../ui/numeralFormat";
import { CursorPositions } from "../CursorPositions";

import { NetscriptFunctions } from "../../NetscriptFunctions";
import { WorkerScript } from "../../Netscript/WorkerScript";
import { Settings } from "../../Settings/Settings";
import { iTutorialNextStep, ITutorial, iTutorialSteps } from "../../InteractiveTutorial";
import { debounce } from "lodash";
import { saveObject } from "../../SaveObject";
import { loadThemes } from "./themes";
import { GetServer } from "../../Server/AllServers";

import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";

import libSource from "!!raw-loader!../NetscriptDefinitions.d.ts";

let symbolsLoaded = false;
let symbols: string[] = [];
export function SetupTextEditor(): void {
  const ns = NetscriptFunctions({} as WorkerScript);

  function populate(ns: any): string[] {
    let symbols: string[] = [];
    const keys = Object.keys(ns);
    for (const key of keys) {
      if (typeof ns[key] === "object") {
        symbols.push(key);
        symbols = symbols.concat(populate(ns[key]));
      }
      if (typeof ns[key] === "function") {
        symbols.push(key);
      }
    }
    return symbols;
  }
  symbols = populate(ns);

  const exclude = ["heart", "break", "exploit", "bypass", "corporation", "alterReality"];
  symbols = symbols.filter((symbol: string) => !exclude.includes(symbol)).sort();
}

interface IProps {
  filename: string;
  code: string;
  hostname: string;
  player: IPlayer;
  router: IRouter;
}

/*

*/

// How to load function definition in monaco
// https://github.com/Microsoft/monaco-editor/issues/1415
// https://microsoft.github.io/monaco-editor/api/modules/monaco.languages.html
// https://www.npmjs.com/package/@monaco-editor/react#development-playground
// https://microsoft.github.io/monaco-editor/playground.html#extending-language-services-custom-languages
// https://github.com/threehams/typescript-error-guide/blob/master/stories/components/Editor.tsx#L11-L39
// https://blog.checklyhq.com/customizing-monaco/

// Holds all the data for a open script
class openScript {
  fileName: string;
  code: string;
  hostname: string;
  lastPosition: monaco.Position;
  model: ITextModel;

  constructor(fileName: string, code: string, hostname: string, lastPosition: monaco.Position, model: ITextModel) {
    this.fileName = fileName;
    this.code = code;
    this.hostname = hostname;
    this.lastPosition = lastPosition;
    this.model = model;
  }
}

const openScripts = new Array<openScript>(); // Holds all open scripts
let currentScript = {} as openScript; // Script currently being viewed

export function Root(props: IProps): React.ReactElement {
  const editorRef = useRef<IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const [filename, setFilename] = useState(props.filename);
  const [code, setCode] = useState<string>(props.code);
  const [decorations, setDecorations] = useState<string[]>([]);
  const [ram, setRAM] = useState("RAM: ???");
  const [updatingRam, setUpdatingRam] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [options, setOptions] = useState<Options>({
    theme: Settings.MonacoTheme,
    insertSpaces: Settings.MonacoInsertSpaces,
    fontSize: Settings.MonacoFontSize,
  });

  const debouncedSetRAM = useMemo(
    () =>
      debounce((s) => {
        setRAM(s);
        setUpdatingRam(false);
      }, 300),
    [],
  );

  function save(): void {
    // this is duplicate code with saving later.
    if (ITutorial.isRunning && ITutorial.currStep === iTutorialSteps.TerminalTypeScript) {
      //Make sure filename + code properly follow tutorial
      if (currentScript.fileName !== "n00dles.script") {
        dialogBoxCreate("Leave the script name as 'n00dles.script'!");
        return;
      }
      if (currentScript.code.replace(/\s/g, "").indexOf("while(true){hack('n00dles');}") == -1) {
        dialogBoxCreate("Please copy and paste the code from the tutorial!");
        return;
      }

      //Save the script
      saveScript(currentScript);

      iTutorialNextStep();

      props.router.toTerminal();
      return;
    }

    if (currentScript.fileName == "") {
      dialogBoxCreate("You must specify a filename!");
      return;
    }

    if (!isValidFilePath(currentScript.fileName)) {
      dialogBoxCreate(
        "Script filename can contain only alphanumerics, hyphens, and underscores, and must end with an extension.",
      );
      return;
    }

    const server = GetServer(currentScript.hostname);
    if (server === null) throw new Error("Server should not be null but it is.");
    if (isScriptFilename(currentScript.fileName)) {
      //If the current script already exists on the server, overwrite it
      for (let i = 0; i < server.scripts.length; i++) {
        if (currentScript.fileName == server.scripts[i].filename) {
          server.scripts[i].saveScript(
            currentScript.fileName,
            currentScript.code,
            props.player.currentServer,
            server.scripts,
          );
          if (Settings.SaveGameOnFileSave) saveObject.saveGame();
          return;
        }
      }

      //If the current script does NOT exist, create a new one
      const script = new Script();
      script.saveScript(currentScript.fileName, currentScript.code, props.player.currentServer, server.scripts);
      server.scripts.push(script);
    } else if (currentScript.fileName.endsWith(".txt")) {
      for (let i = 0; i < server.textFiles.length; ++i) {
        if (server.textFiles[i].fn === currentScript.fileName) {
          server.textFiles[i].write(currentScript.code);
          if (Settings.SaveGameOnFileSave) saveObject.saveGame();
          return;
        }
      }
      const textFile = new TextFile(currentScript.fileName, currentScript.code);
      server.textFiles.push(textFile);
    } else {
      dialogBoxCreate("Invalid filename. Must be either a script (.script, .js, or .ns) or " + " or text file (.txt)");
      return;
    }

    if (Settings.SaveGameOnFileSave) saveObject.saveGame();
  }

  function beautify(): void {
    if (editorRef.current === null) return;
    editorRef.current.getAction("editor.action.formatDocument").run();
  }

  function infLoop(newCode: string): void {
    if (editorRef.current === null) return;
    if (!currentScript.fileName.endsWith(".ns") && !currentScript.fileName.endsWith(".js")) return;
    const awaitWarning = checkInfiniteLoop(newCode);
    if (awaitWarning !== -1) {
      const newDecorations = editorRef.current.deltaDecorations(decorations, [
        {
          range: {
            startLineNumber: awaitWarning,
            startColumn: 1,
            endLineNumber: awaitWarning,
            endColumn: 10,
          },
          options: {
            isWholeLine: true,
            glyphMarginClassName: "myGlyphMarginClass",
            glyphMarginHoverMessage: {
              value: "Possible infinite loop, await something.",
            },
          },
        },
      ]);
      setDecorations(newDecorations);
    } else {
      const newDecorations = editorRef.current.deltaDecorations(decorations, []);
      setDecorations(newDecorations);
    }
  }

  function updateCode(newCode?: string): void {
    if (newCode === undefined) return;
    updateRAM(newCode);
    currentScript.code = newCode;
    try {
      if (editorRef.current !== null) {
        infLoop(newCode);
      }
    } catch (err) {}
  }

  // calculate it once the first time the file is loaded.
  useEffect(() => {
    updateRAM(currentScript.code);
  }, []);

  async function updateRAM(newCode: string): Promise<void> {
    setUpdatingRam(true);
    const codeCopy = newCode + "";
    const ramUsage = await calculateRamUsage(codeCopy, props.player.getCurrentServer().scripts);
    if (ramUsage > 0) {
      debouncedSetRAM("RAM: " + numeralWrapper.formatRAM(ramUsage));
      return;
    }
    switch (ramUsage) {
      case RamCalculationErrorCode.ImportError: {
        debouncedSetRAM("RAM: Import Error");
        break;
      }
      case RamCalculationErrorCode.URLImportError: {
        debouncedSetRAM("RAM: HTTP Import Error");
        break;
      }
      case RamCalculationErrorCode.SyntaxError:
      default: {
        debouncedSetRAM("RAM: Syntax Error");
        break;
      }
    }
    return new Promise<void>(() => undefined);
  }

  useEffect(() => {
    function maybeSave(event: KeyboardEvent): void {
      if (Settings.DisableHotkeys) return;
      //Ctrl + b
      if (event.keyCode == 66 && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        save();
      }
    }
    document.addEventListener("keydown", maybeSave);
    return () => document.removeEventListener("keydown", maybeSave);
  });

  // Generates a new model for the script
  function regenerateModel(script: openScript): void {
    if (monacoRef.current !== null) {
      script.model = monacoRef.current.editor.createModel(script.code, "javascript");
    }
  }

  // Sets the currently viewed script
  function setCurrentScript(script: openScript): void {
    // Update last position
    if (editorRef.current !== null) {
      if (currentScript !== null) {
        const currentPosition = editorRef.current.getPosition();
        if (currentPosition !== null) {
          currentScript.lastPosition = currentPosition;
        }
      }

      editorRef.current.setModel(script.model);
      currentScript = script;
      editorRef.current.setPosition(currentScript.lastPosition);
      editorRef.current.revealLine(currentScript.lastPosition.lineNumber);
      updateRAM(currentScript.code);
    }
  }

  // Gets a currently opened script
  function getOpenedScript(fileName: string, hostname: string): openScript | null {
    for (const script of openScripts) {
      if (script.fileName === fileName && script.hostname === hostname) {
        return script;
      }
    }

    return null;
  }

  function saveScript(script: openScript): void {
    const server = GetServer(script.hostname);
    if (server === null) throw new Error("Server should not be null but it is.");
    let found = false;
    for (let i = 0; i < server.scripts.length; i++) {
      if (script.fileName == server.scripts[i].filename) {
        server.scripts[i].saveScript(script.fileName, script.code, script.hostname, server.scripts);
        found = true;
      }
    }

    if (!found) {
      const newScript = new Script();
      newScript.saveScript(script.fileName, script.code, script.hostname, server.scripts);
      server.scripts.push(newScript);
    }
  }

  function onMount(editor: IStandaloneCodeEditor, monaco: Monaco): void {
    editorRef.current = editor;
    monacoRef.current = monaco;
    if (editorRef.current === null) return;
    const position = CursorPositions.getCursor(filename);
    if (position.row !== -1)
      editorRef.current.setPosition({
        lineNumber: position.row,
        column: position.column,
      });
    editorRef.current.focus();

    const script = getOpenedScript(filename, props.player.getCurrentServer().hostname);

    // Check if script is already opened, if so switch to that model
    if (script !== null) {
      if (script.model.isDisposed()) {
        regenerateModel(script);
      }

      setCurrentScript(script);
    } else {
      if (filename !== undefined) {
        // Create new model
        if (monacoRef.current !== null) {
          const newScript = new openScript(
            filename,
            code,
            props.player.getCurrentServer().hostname,
            new monaco.Position(0, 0),
            monacoRef.current.editor.createModel(code, "javascript"),
          );
          setCurrentScript(newScript);
          openScripts.push(newScript);
        }
      } else {
        // Script Editor was opened by the sidebar button
        if (currentScript.model !== undefined) {
          if (currentScript.model.isDisposed()) {
            // Create new model, old one was disposed of
            regenerateModel(currentScript);
          }

          setCurrentScript(currentScript);
        } else {
          // Create a new temporary file
          if (monacoRef.current !== null) {
            const newScript = new openScript(
              "newfile.script",
              "",
              props.player.getCurrentServer().hostname,
              new monaco.Position(0, 0),
              monacoRef.current.editor.createModel("", "javascript"),
            );
            setCurrentScript(newScript);
            openScripts.push(newScript);
          }
        }
      }
    }
  }

  function beforeMount(monaco: any): void {
    if (symbolsLoaded) return;
    symbolsLoaded = true;
    monaco.languages.registerCompletionItemProvider("javascript", {
      provideCompletionItems: () => {
        const suggestions = [];
        for (const symbol of symbols) {
          suggestions.push({
            label: symbol,
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: symbol,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          });
        }
        return { suggestions: suggestions };
      },
    });
    (async function () {
      // We have to improve the default js language otherwise theme sucks
      const l = await monaco.languages
        .getLanguages()
        .find((l: any) => l.id === "javascript")
        .loader();
      l.language.tokenizer.root.unshift(["ns", { token: "ns" }]);
      for (const symbol of symbols) l.language.tokenizer.root.unshift([symbol, { token: "netscriptfunction" }]);
      const otherKeywords = ["let", "const", "var", "function"];
      const otherKeyvars = ["true", "false", "null", "undefined"];
      otherKeywords.forEach((k) => l.language.tokenizer.root.unshift([k, { token: "otherkeywords" }]));
      otherKeyvars.forEach((k) => l.language.tokenizer.root.unshift([k, { token: "otherkeyvars" }]));
      l.language.tokenizer.root.unshift(["this", { token: "this" }]);
    })();

    const source = (libSource + "").replace(/export /g, "");
    monaco.languages.typescript.javascriptDefaults.addExtraLib(source, "netscript.d.ts");
    monaco.languages.typescript.typescriptDefaults.addExtraLib(source, "netscript.d.ts");
    loadThemes(monaco);
  }

  // Change tab highlight from old tab to new tab
  function changeTabButtonColor(
    oldButtonFileName: string,
    oldButtonHostname: string,
    newButtonFileName: string,
    newButtonHostname: string,
  ): void {
    const oldTabButton = document.getElementById("tabButton" + oldButtonFileName + oldButtonHostname);
    if (oldTabButton !== null) {
      oldTabButton.style.backgroundColor = "";
    }

    const oldTabCloseButton = document.getElementById("tabCloseButton" + oldButtonFileName + oldButtonHostname);
    if (oldTabCloseButton !== null) {
      oldTabCloseButton.style.backgroundColor = "";
    }

    const newTabButton = document.getElementById("tabButton" + newButtonFileName + newButtonHostname);
    if (newTabButton !== null) {
      newTabButton.style.backgroundColor = "#666";
    }

    const newTabCloseButton = document.getElementById("tabCloseButton" + newButtonFileName + newButtonHostname);
    if (newTabCloseButton !== null) {
      newTabCloseButton.style.backgroundColor = "#666";
    }
  }

  // Called when a script tab was clicked
  function onTabButtonClick(e: React.MouseEvent<HTMLButtonElement>): void {
    const valSplit = e.currentTarget.value.split(":");
    const fileName = valSplit[0];
    const hostname = valSplit[1];

    // Change tab highlight from old tab to new tab
    changeTabButtonColor(currentScript.fileName, currentScript.hostname, fileName, hostname);

    // Update current script
    const clickedScript = getOpenedScript(fileName, hostname);

    if (clickedScript !== null) {
      if (clickedScript.model.isDisposed()) {
        regenerateModel(clickedScript);
      }

      setCurrentScript(clickedScript);
    }
  }

  // Called when a script tab close button was clicked
  function onCloseButtonClick(e: React.MouseEvent<HTMLButtonElement>): void {
    const valSplit = e.currentTarget.value.split(":");
    const fileName = valSplit[0];
    const hostname = valSplit[1];

    const scriptToClose = getOpenedScript(fileName, hostname);

    // Save and remove script from openScripts
    if (scriptToClose !== null) {
      saveScript(scriptToClose);

      openScripts.splice(openScripts.indexOf(scriptToClose), 1);
    }

    if (openScripts.length === 0) {
      // No other scripts are open, create a new temporary file
      if (monacoRef.current !== null) {
        const newScript = new openScript(
          "newfile.script",
          "",
          props.player.getCurrentServer().hostname,
          new monacoRef.current.Position(0, 0),
          monacoRef.current.editor.createModel("", "javascript"),
        );

        setCurrentScript(newScript);
        openScripts.push(newScript);

        // Modify button for temp file
        const parent = e.currentTarget.parentElement;
        if (parent !== null) {
          (parent.children[0] as HTMLButtonElement).value = "newfile.script:home";
          (parent.children[0] as HTMLButtonElement).textContent = "newfile.script";
          e.currentTarget.value = "newfile.script:home";
        }
      }
    } else {
      if (openScripts[0].model.isDisposed()) {
        regenerateModel(openScripts[0]);
      }

      changeTabButtonColor(
        currentScript.fileName,
        currentScript.hostname,
        openScripts[0].fileName,
        openScripts[0].hostname,
      );

      setCurrentScript(openScripts[0]);
    }
  }

  // Generate a button for each open script
  const scriptButtons = [];
  for (let i = 0; i < openScripts.length; i++) {
    if (openScripts[i].fileName !== "") {
      const fileName2 = openScripts[i].fileName;
      const hostname = openScripts[i].hostname;
      if (openScripts[i].fileName === currentScript.fileName && openScripts[i].hostname === currentScript.hostname) {
        // Set special background color for current script tab button
        scriptButtons.push(
          <Tooltip
            title={
              <Typography>
                {hostname}:~/{fileName2}
              </Typography>
            }
          >
            <div key={fileName2 + hostname} style={{ paddingRight: "5px" }}>
              <Button style={{ backgroundColor: "#666" }} value={fileName2 + ":" + hostname} onClick={onTabButtonClick}>
                {openScripts[i].fileName}
              </Button>
              <Button
                value={fileName2 + ":" + hostname}
                onClick={onCloseButtonClick}
                style={{ maxWidth: "20px", minWidth: "20px", backgroundColor: "#666" }}
              >
                x
              </Button>
            </div>
          </Tooltip>,
        );
      } else {
        scriptButtons.push(
          <div id={"scriptEditorTab" + fileName2 + hostname} key={"tabButton" + i} style={{ paddingRight: "5px" }}>
            <Button
              id={"tabButton" + openScripts[i].fileName + openScripts[i].hostname}
              value={fileName2 + ":" + hostname}
              onClick={onTabButtonClick}
            >
              {openScripts[i].fileName}
            </Button>
            <Button
              id={"tabCloseButton" + openScripts[i].fileName + openScripts[i].hostname}
              value={fileName2 + ":" + hostname}
              onClick={onCloseButtonClick}
              style={{ maxWidth: "20px", minWidth: "20px" }}
            >
              x
            </Button>
          </div>,
        );
      }
    }
  }

  // 370px  71%, 725px  85.1%, 1085px 90%, 1300px 91.7%
  // fuck around in desmos until you find a function
  const p = 11000 / -window.innerHeight + 100;
  return (
    <>
      <Box display="flex" flexDirection="row" alignItems="center" paddingBottom="5px">
        {scriptButtons}
      </Box>
      <Editor
        beforeMount={beforeMount}
        onMount={onMount}
        loading={<Typography>Loading script editor!</Typography>}
        height={p + "%"}
        defaultLanguage="javascript"
        defaultValue={code}
        onChange={updateCode}
        theme={options.theme}
        options={{ ...options, glyphMargin: true }}
      />
      <Box display="flex" flexDirection="row" sx={{ m: 1 }} alignItems="center">
        <Button onClick={beautify}>Beautify</Button>
        <Typography color={updatingRam ? "secondary" : "primary"} sx={{ mx: 1 }}>
          {ram}
        </Typography>
        <Button onClick={save}>Save (Ctrl/Cmd + b)</Button>
        <Typography sx={{ mx: 1 }}>
          {" "}
          Documentation:{" "}
          <Link target="_blank" href="https://bitburner.readthedocs.io/en/latest/index.html">
            Basic
          </Link>{" "}
          |
          <Link target="_blank" href="https://github.com/danielyxie/bitburner/blob/dev/markdown/bitburner.ns.md">
            Full
          </Link>
        </Typography>
        <IconButton style={{ marginLeft: "auto" }} onClick={() => setOptionsOpen(true)}>
          <>
            <SettingsIcon />
            options
          </>
        </IconButton>
      </Box>
      <OptionsModal
        open={optionsOpen}
        onClose={() => setOptionsOpen(false)}
        options={{
          theme: Settings.MonacoTheme,
          insertSpaces: Settings.MonacoInsertSpaces,
          fontSize: Settings.MonacoFontSize,
        }}
        save={(options: Options) => {
          setOptions(options);
          Settings.MonacoTheme = options.theme;
          Settings.MonacoInsertSpaces = options.insertSpaces;
          Settings.MonacoFontSize = options.fontSize;
        }}
      />
    </>
  );
}
