import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";
type IStandaloneCodeEditor = monaco.editor.IStandaloneCodeEditor;
import { OptionsModal } from "./OptionsModal";
import { Options } from "./Options";
import { js_beautify as beautifyCode } from "js-beautify";
import { isValidFilePath } from "../../Terminal/DirectoryHelpers";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { IRouter } from "../../ui/Router";
import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { isScriptFilename } from "../../Script/isScriptFilename";
import { Script } from "../../Script/Script";
import { TextFile } from "../../TextFile";
import { calculateRamUsage } from "../../Script/RamCalculations";
import { RamCalculationErrorCode } from "../../Script/RamCalculationErrorCodes";
import { numeralWrapper } from "../../ui/numeralFormat";
import { CursorPositions } from "../CursorPositions";
import * as libSource from "!!raw-loader!../NetscriptDefinitions";
import { NetscriptFunctions } from "../../NetscriptFunctions";
import { WorkerScript } from "../../Netscript/WorkerScript";
import { Settings } from "../../Settings/Settings";
import { iTutorialNextStep, ITutorial, iTutorialSteps } from "../../InteractiveTutorial";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";

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

  const exclude = ["heart", "break", "exploit", "bypass", "corporation"];
  symbols = symbols.filter((symbol: string) => !exclude.includes(symbol));
}

interface IProps {
  filename: string;
  code: string;
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

// These variables are used to reload a script when it's clicked on. Because we
// won't have references to the old script.
let lastFilename = "";
let lastCode = "";
let lastPosition: monaco.Position | null = null;

export function Root(props: IProps): React.ReactElement {
  const editorRef = useRef<IStandaloneCodeEditor | null>(null);
  const [filename, setFilename] = useState(props.filename ? props.filename : lastFilename);
  const [code, setCode] = useState<string>(props.filename ? props.code : lastCode);
  const [ram, setRAM] = useState("RAM: ???");
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [options, setOptions] = useState<Options>({
    theme: Settings.MonacoTheme,
    insertSpaces: Settings.MonacoInsertSpaces,
    fontSize: Settings.MonacoFontSize,
  });

  // store the last known state in case we need to restart without nano.
  useEffect(() => {
    if (props.filename === undefined) return;
    lastFilename = props.filename;
    lastCode = props.code;
    lastPosition = null;
  }, []);

  function save(): void {
    if (editorRef.current !== null) {
      const position = editorRef.current.getPosition();
      if (position !== null) {
        CursorPositions.saveCursor(filename, {
          row: position.lineNumber,
          column: position.column,
        });
      }
    }
    lastPosition = null;

    // this is duplicate code with saving later.
    if (ITutorial.isRunning && ITutorial.currStep === iTutorialSteps.TerminalTypeScript) {
      //Make sure filename + code properly follow tutorial
      if (filename !== "n00dles.script") {
        dialogBoxCreate("Leave the script name as 'n00dles'!");
        return;
      }
      if (code.replace(/\s/g, "").indexOf("while(true){hack('n00dles');}") == -1) {
        dialogBoxCreate("Please copy and paste the code from the tutorial!");
        return;
      }

      //Save the script
      const server = props.player.getCurrentServer();
      if (server === null) throw new Error("Server should not be null but it is.");
      let found = false;
      for (let i = 0; i < server.scripts.length; i++) {
        if (filename == server.scripts[i].filename) {
          server.scripts[i].saveScript(filename, code, props.player.currentServer, server.scripts);
          found = true;
        }
      }

      if (!found) {
        const script = new Script();
        script.saveScript(filename, code, props.player.currentServer, server.scripts);
        server.scripts.push(script);
      }

      iTutorialNextStep();

      props.router.toTerminal();
      return;
    }

    if (filename == "") {
      dialogBoxCreate("You must specify a filename!");
      return;
    }

    if (!isValidFilePath(filename)) {
      dialogBoxCreate(
        "Script filename can contain only alphanumerics, hyphens, and underscores, and must end with an extension.",
      );
      return;
    }

    const server = props.player.getCurrentServer();
    if (server === null) throw new Error("Server should not be null but it is.");
    if (isScriptFilename(filename)) {
      //If the current script already exists on the server, overwrite it
      for (let i = 0; i < server.scripts.length; i++) {
        if (filename == server.scripts[i].filename) {
          server.scripts[i].saveScript(filename, code, props.player.currentServer, server.scripts);
          props.router.toTerminal();
          return;
        }
      }

      //If the current script does NOT exist, create a new one
      const script = new Script();
      script.saveScript(filename, code, props.player.currentServer, server.scripts);
      server.scripts.push(script);
    } else if (filename.endsWith(".txt")) {
      for (let i = 0; i < server.textFiles.length; ++i) {
        if (server.textFiles[i].fn === filename) {
          server.textFiles[i].write(code);
          props.router.toTerminal();
          return;
        }
      }
      const textFile = new TextFile(filename, code);
      server.textFiles.push(textFile);
    } else {
      dialogBoxCreate("Invalid filename. Must be either a script (.script, .js, or .ns) or " + " or text file (.txt)");
      return;
    }
    props.router.toTerminal();
  }

  function beautify(): void {
    if (editorRef.current === null) return;
    const pretty = beautifyCode(code, {
      indent_with_tabs: !options.insertSpaces,
      indent_size: 4,
      brace_style: "preserve-inline",
    });
    editorRef.current.setValue(pretty);
  }

  function onFilenameChange(event: React.ChangeEvent<HTMLInputElement>): void {
    lastFilename = event.target.value;
    setFilename(event.target.value);
  }

  function updateCode(newCode?: string): void {
    if (newCode === undefined) return;
    lastCode = newCode;
    if (editorRef.current !== null) {
      lastPosition = editorRef.current.getPosition();
    }
    setCode(newCode);
  }

  async function updateRAM(): Promise<void> {
    const codeCopy = code + "";
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

  function onMount(editor: IStandaloneCodeEditor): void {
    editorRef.current = editor;
    if (editorRef.current === null) return;
    const position = CursorPositions.getCursor(filename);
    if (position.row !== -1)
      editorRef.current.setPosition({
        lineNumber: position.row,
        column: position.column,
      });
    else if (lastPosition !== null)
      editorRef.current.setPosition({
        lineNumber: lastPosition.lineNumber,
        column: lastPosition.column + 1,
      });
    editorRef.current.focus();
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
    monaco.languages.typescript.javascriptDefaults.addExtraLib(libSource, "netscript.d.ts");
    monaco.languages.typescript.typescriptDefaults.addExtraLib(libSource, "netscript.d.ts");
  }

  return (
    <>
      <Box display="flex" flexDirection="row" alignItems="center">
        <TextField
          type="text"
          tabIndex={1}
          value={filename}
          onChange={onFilenameChange}
          InputProps={{ startAdornment: <Typography>Script&nbsp;name:&nbsp;</Typography> }}
        />
        <IconButton onClick={() => setOptionsOpen(true)}>
          <>
            <SettingsIcon />
            options
          </>
        </IconButton>
      </Box>
      <Editor
        beforeMount={beforeMount}
        onMount={onMount}
        loading={<Typography>Loading script editor!</Typography>}
        height="90%"
        defaultLanguage="javascript"
        defaultValue={code}
        onChange={updateCode}
        theme={options.theme}
        options={options}
      />
      <Box display="flex" flexDirection="row" sx={{ m: 1 }} alignItems="center">
        <Button onClick={beautify}>Beautify</Button>
        <Typography sx={{ mx: 1 }}>{ram}</Typography>
        <Button onClick={save}>Save & Close (Ctrl/Cmd + b)</Button>
        <Link sx={{ mx: 1 }} target="_blank" href="https://bitburner.readthedocs.io/en/latest/index.html">
          <Typography> Netscript Documentation</Typography>
        </Link>
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
