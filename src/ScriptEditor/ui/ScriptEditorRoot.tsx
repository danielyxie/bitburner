/* eslint-disable @typescript-eslint/no-non-null-assertion */
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
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { NetscriptFunctions } from "../../NetscriptFunctions";
import { WorkerScript } from "../../Netscript/WorkerScript";
import { Settings } from "../../Settings/Settings";
import { iTutorialNextStep, ITutorial, iTutorialSteps } from "../../InteractiveTutorial";
import { debounce } from "lodash";
import { saveObject } from "../../SaveObject";
import { loadThemes } from "./themes";
import { GetServer } from "../../Server/AllServers";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";
import { PromptEvent } from "../../ui/React/PromptManager";

import libSource from "!!raw-loader!../NetscriptDefinitions.d.ts";

interface IProps {
  filename: string;
  code: string;
  hostname: string;
  player: IPlayer;
  router: IRouter;
  vim?: boolean;
}

// TODO: try to removve global symbols
let symbolsLoaded = false;
let symbols: string[] = [];
export function SetupTextEditor(): void {
  const ns = NetscriptFunctions({} as WorkerScript);

  // Populates symbols for text editor
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

// Holds all the data for a open script
class OpenScript {
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

// Called every time script editor is opened
export function Root(props: IProps): React.ReactElement {
  const editorRef = useRef<IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const vimStatusRef = useRef<HTMLElement>(null);
  const [vimEditor, setVimEditor] = useState<any>(null);
  const [editor, setEditor] = useState<IStandaloneCodeEditor | null>(null);

  const [openScripts, setOpenScripts] = useState<OpenScript[]>(
    window.localStorage.getItem("scriptEditorOpenScripts") !== null
      ? JSON.parse(window.localStorage.getItem("scriptEditorOpenScripts")!)
      : [],
  );

  const [currentScript, setCurrentScript] = useState<OpenScript | null>(
    window.localStorage.getItem("scriptEditorCurrentScript") !== null
      ? JSON.parse(window.localStorage.getItem("scriptEditorCurrentScript")!)
      : null,
  );

  const [ram, setRAM] = useState("RAM: ???");
  const [updatingRam, setUpdatingRam] = useState(false);
  const [decorations, setDecorations] = useState<string[]>([]);

  const [optionsOpen, setOptionsOpen] = useState(false);
  const [options, setOptions] = useState<Options>({
    theme: Settings.MonacoTheme,
    insertSpaces: Settings.MonacoInsertSpaces,
    fontSize: Settings.MonacoFontSize,
    vim: props.vim || Settings.MonacoVim,
  });

  useEffect(() => {
    // Save currentScript
    window.localStorage.setItem(
      "scriptEditorCurrentScript",
      JSON.stringify(currentScript, (key, value) => {
        if (key == "model") return undefined;
        return value;
      }),
    );

    // Save openScripts
    window.localStorage.setItem(
      "scriptEditorOpenScripts",
      JSON.stringify(openScripts, (key, value) => {
        if (key == "model") return undefined;
        return value;
      }),
    );
  }, [currentScript, openScripts]);

  useEffect(() => {
    if (currentScript !== null) {
      updateRAM(currentScript.code);
    }
  }, []);

  useEffect(() => {
    function maybeSave(event: KeyboardEvent): void {
      if (Settings.DisableHotkeys) return;
      //Ctrl + b
      if (event.keyCode == 66 && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        save();
      }

      // CTRL/CMD + S
      if (event.code == `KeyS` && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        event.stopPropagation();
        save();
      }
    }
    document.addEventListener("keydown", maybeSave);
    return () => document.removeEventListener("keydown", maybeSave);
  });

  useEffect(() => {
    // setup monaco-vim
    if (options.vim && editor && !vimEditor) {
      try {
        // This library is not typed
        // @ts-expect-error
        window.require(["monaco-vim"], function (MonacoVim: any) {
          setVimEditor(MonacoVim.initVimMode(editor, vimStatusRef.current));
          MonacoVim.VimMode.Vim.defineEx("write", "w", function () {
            // your own implementation on what you want to do when :w is pressed
            save();
          });
          MonacoVim.VimMode.Vim.defineEx("quit", "q", function () {
            save();
          });
          editor.focus();
        });
      } catch {}
    } else if (!options.vim) {
      // Whem vim mode is disabled
      vimEditor?.dispose();
      setVimEditor(null);
    }

    return () => {
      vimEditor?.dispose();
    };
  }, [options, editorRef, editor, vimEditor]);

  // Generates a new model for the script
  function regenerateModel(script: OpenScript): void {
    if (monacoRef.current !== null) {
      script.model = monacoRef.current.editor.createModel(script.code, "javascript");
    }
  }

  const debouncedSetRAM = useMemo(
    () =>
      debounce((s) => {
        setRAM(s);
        setUpdatingRam(false);
      }, 300),
    [],
  );

  async function updateRAM(newCode: string): Promise<void> {
    if (currentScript != null && currentScript.fileName.endsWith(".txt")) {
      debouncedSetRAM("");
      return;
    }
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

  // Formats the code
  function beautify(): void {
    if (editorRef.current === null) return;
    editorRef.current.getAction("editor.action.formatDocument").run();
  }

  // How to load function definition in monaco
  // https://github.com/Microsoft/monaco-editor/issues/1415
  // https://microsoft.github.io/monaco-editor/api/modules/monaco.languages.html
  // https://www.npmjs.com/package/@monaco-editor/react#development-playground
  // https://microsoft.github.io/monaco-editor/playground.html#extending-language-services-custom-languages
  // https://github.com/threehams/typescript-error-guide/blob/master/stories/components/Editor.tsx#L11-L39
  // https://blog.checklyhq.com/customizing-monaco/
  // Before the editor is mounted
  function beforeMount(monaco: any): void {
    if (symbolsLoaded) return;
    // Setup monaco auto completion
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

  // When the editor is mounted
  function onMount(editor: IStandaloneCodeEditor, monaco: Monaco): void {
    // Required when switching between site navigation (e.g. from Script Editor -> Terminal and back)
    // the `useEffect()` for vim mode is called before editor is mounted.
    setEditor(editor);

    editorRef.current = editor;
    monacoRef.current = monaco;

    if (editorRef.current === null || monacoRef.current === null) return;

    if (props.filename) {
      // Check if file is already opened
      const openScriptIndex = openScripts.findIndex(
        (script) => script.fileName === props.filename && script.hostname === props.hostname,
      );
      if (openScriptIndex !== -1) {
        // Script is already opened
        if (
          openScripts[openScriptIndex].model === undefined ||
          openScripts[openScriptIndex].model === null ||
          openScripts[openScriptIndex].model.isDisposed()
        ) {
          regenerateModel(openScripts[openScriptIndex]);
        }

        setCurrentScript(openScripts[openScriptIndex]);
        editorRef.current.setModel(openScripts[openScriptIndex].model);
        editorRef.current.setPosition(openScripts[openScriptIndex].lastPosition);
        editorRef.current.revealLineInCenter(openScripts[openScriptIndex].lastPosition.lineNumber);
        updateRAM(openScripts[openScriptIndex].code);
      } else {
        // Open script
        const newScript = new OpenScript(
          props.filename,
          props.code,
          props.hostname,
          new monacoRef.current.Position(0, 0),
          monacoRef.current.editor.createModel(props.code, "javascript"),
        );
        setOpenScripts((oldArray) => [...oldArray, newScript]);
        setCurrentScript({ ...newScript });
        editorRef.current.setModel(newScript.model);
        updateRAM(newScript.code);
      }
    } else if (currentScript !== null) {
      // Open currentscript
      regenerateModel(currentScript);
      editorRef.current.setModel(currentScript.model);
      editorRef.current.setPosition(currentScript.lastPosition);
      editorRef.current.revealLineInCenter(currentScript.lastPosition.lineNumber);
      updateRAM(currentScript.code);
    }

    editorRef.current.focus();
  }

  function infLoop(newCode: string): void {
    if (editorRef.current === null || currentScript === null) return;
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

  // When the code is updated within the editor
  function updateCode(newCode?: string): void {
    if (newCode === undefined) return;
    updateRAM(newCode);
    if (editorRef.current !== null) {
      const newPos = editorRef.current.getPosition();
      if (newPos === null) return;
      setCurrentScript((oldScript) => ({ ...oldScript!, code: newCode, lastPosition: newPos! }));
      if (currentScript !== null) {
        const curIndex = openScripts.findIndex(
          (script) => script.fileName === currentScript.fileName && script.hostname === currentScript.hostname,
        );
        const newArr = [...openScripts];
        const tempScript = currentScript;
        tempScript.code = newCode;
        newArr[curIndex] = tempScript;
        setOpenScripts([...newArr]);
      }
      try {
        infLoop(newCode);
      } catch (err) {}
    }
  }

  function saveScript(scriptToSave: OpenScript): void {
    const server = GetServer(scriptToSave.hostname);
    if (server === null) throw new Error("Server should not be null but it is.");
    if (isScriptFilename(scriptToSave.fileName)) {
      //If the current script already exists on the server, overwrite it
      for (let i = 0; i < server.scripts.length; i++) {
        if (scriptToSave.fileName == server.scripts[i].filename) {
          server.scripts[i].saveScript(
            scriptToSave.fileName,
            scriptToSave.code,
            props.player.currentServer,
            server.scripts,
          );
          if (Settings.SaveGameOnFileSave) saveObject.saveGame();
          props.router.toTerminal();
          return;
        }
      }

      //If the current script does NOT exist, create a new one
      const script = new Script();
      script.saveScript(scriptToSave.fileName, scriptToSave.code, props.player.currentServer, server.scripts);
      server.scripts.push(script);
    } else if (scriptToSave.fileName.endsWith(".txt")) {
      for (let i = 0; i < server.textFiles.length; ++i) {
        if (server.textFiles[i].fn === scriptToSave.fileName) {
          server.textFiles[i].write(scriptToSave.code);
          if (Settings.SaveGameOnFileSave) saveObject.saveGame();
          props.router.toTerminal();
          return;
        }
      }
      const textFile = new TextFile(scriptToSave.fileName, scriptToSave.code);
      server.textFiles.push(textFile);
    } else {
      dialogBoxCreate("Invalid filename. Must be either a script (.script, .js, or .ns) or " + " or text file (.txt)");
      return;
    }

    if (Settings.SaveGameOnFileSave) saveObject.saveGame();
    props.router.toTerminal();
  }

  function save(): void {
    if (currentScript === null) {
      console.log("currentScript is null when it shouldn't be. Unabel to save script");
      return;
    }
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
          props.router.toTerminal();
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
          props.router.toTerminal();
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
    props.router.toTerminal();
  }

  function reorder(list: Array<OpenScript>, startIndex: number, endIndex: number): OpenScript[] {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  }

  function onDragEnd(result: any): void {
    // Dropped outside of the list
    if (!result.destination) {
      result;
      return;
    }

    const items = reorder(openScripts, result.source.index, result.destination.index);

    setOpenScripts(items);
  }

  function onTabClick(index: number): void {
    if (currentScript !== null) {
      // Save currentScript to openScripts
      const curIndex = openScripts.findIndex(
        (script) => script.fileName === currentScript.fileName && script.hostname === currentScript.hostname,
      );
      openScripts[curIndex] = currentScript;
    }

    setCurrentScript({ ...openScripts[index] });

    if (editorRef.current !== null && openScripts[index] !== null) {
      if (openScripts[index].model === undefined || openScripts[index].model.isDisposed()) {
        regenerateModel(openScripts[index]);
      }
      editorRef.current.setModel(openScripts[index].model);

      editorRef.current.setPosition(openScripts[index].lastPosition);
      editorRef.current.revealLineInCenter(openScripts[index].lastPosition.lineNumber);
      updateRAM(openScripts[index].code);
      editorRef.current.focus();
    }
  }

  async function onTabClose(index: number): Promise<void> {
    // See if the script on the server is up to date
    const closingScript = openScripts[index];
    const savedOpenScripts: Array<OpenScript> = JSON.parse(window.localStorage.getItem("scriptEditorOpenScripts")!);
    const savedScriptIndex = savedOpenScripts.findIndex(
      (script) => script.fileName === closingScript.fileName && script.hostname === closingScript.hostname,
    );
    let savedScriptCode = "";
    if (savedScriptIndex !== -1) {
      savedScriptCode = savedOpenScripts[savedScriptIndex].code;
    }

    const serverScriptIndex = GetServer(closingScript.hostname)?.scripts.findIndex(
      (script) => script.filename === closingScript.fileName,
    );
    if (
      serverScriptIndex === -1 ||
      savedScriptCode !== GetServer(closingScript.hostname)?.scripts[serverScriptIndex as number].code
    ) {
      PromptEvent.emit({
        txt: "Do you want to save changes to " + closingScript.fileName + "?",
        resolve: (result: boolean) => {
          if (result) {
            // Save changes
            closingScript.code = savedScriptCode;
            saveScript(closingScript);
          }
        },
      });
    }

    if (openScripts.length > 1) {
      setOpenScripts((oldScripts) => oldScripts.filter((value, i) => i !== index));

      let indexOffset = -1;
      if (openScripts[index + indexOffset] === undefined) {
        indexOffset = 1;
      }

      // Change current script if we closed it
      setCurrentScript(openScripts[index + indexOffset]);
      if (editorRef.current !== null) {
        if (
          openScripts[index + indexOffset].model === undefined ||
          openScripts[index + indexOffset].model === null ||
          openScripts[index + indexOffset].model.isDisposed()
        ) {
          regenerateModel(openScripts[index + indexOffset]);
        }

        editorRef.current.setModel(openScripts[index + indexOffset].model);
        editorRef.current.setPosition(openScripts[index + indexOffset].lastPosition);
        editorRef.current.revealLineInCenter(openScripts[index + indexOffset].lastPosition.lineNumber);
        editorRef.current.focus();
      }
    } else {
      // No more scripts are open
      setOpenScripts([]);
      setCurrentScript(null);
    }
  }

  // TODO: Make this responsive to window resizes
  // Toolbars are roughly 108px + vim bar 34px
  // Get percentage of space that toolbars represent and the rest should be the
  // editor
  const editorHeight = 100 - ((108 + (options.vim ? 34 : 0)) / window.innerHeight) * 100;

  return (
    <>
      <div style={{ display: currentScript !== null ? "block" : "none", height: "100%", width: "100%" }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="tabs" direction="horizontal">
            {(provided, snapshot) => (
              <Box
                maxWidth="1640px"
                display="flex"
                flexDirection="row"
                alignItems="center"
                whiteSpace="nowrap"
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  backgroundColor: snapshot.isDraggingOver ? "#1F2022" : Settings.theme.backgroundprimary,
                  overflowX: "scroll",
                }}
              >
                {openScripts.map(({ fileName, hostname }, index) => (
                  <Draggable
                    key={fileName + hostname}
                    draggableId={fileName + hostname}
                    index={index}
                    disableInteractiveElementBlocking={true}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                          marginRight: "5px",
                          flexShrink: 0,
                        }}
                      >
                        <Button
                          id={"tabButton" + fileName + hostname}
                          onClick={() => onTabClick(index)}
                          style={{
                            background:
                              currentScript?.fileName === openScripts[index].fileName
                                ? Settings.theme.secondarydark
                                : "",
                          }}
                        >
                          {hostname}:~/{fileName}
                        </Button>
                        <Button
                          id={"tabCloseButton" + fileName + hostname}
                          onClick={() => onTabClose(index)}
                          style={{
                            maxWidth: "20px",
                            minWidth: "20px",
                            background:
                              currentScript?.fileName === openScripts[index].fileName
                                ? Settings.theme.secondarydark
                                : "",
                          }}
                        >
                          x
                        </Button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
        <div style={{ paddingBottom: "5px" }} />
        <Editor
          beforeMount={beforeMount}
          onMount={onMount}
          loading={<Typography>Loading script editor!</Typography>}
          height={`${editorHeight}%`}
          defaultLanguage="javascript"
          defaultValue={""}
          onChange={updateCode}
          theme={options.theme}
          options={{ ...options, glyphMargin: true }}
        />

        <Box
          ref={vimStatusRef}
          className="monaco-editor"
          display="flex"
          flexDirection="row"
          sx={{ p: 1 }}
          alignItems="center"
        ></Box>

        <Box display="flex" flexDirection="row" sx={{ m: 1 }} alignItems="center">
          <Button onClick={beautify}>Beautify</Button>
          <Typography color={updatingRam ? "secondary" : "primary"} sx={{ mx: 1 }}>
            {ram}
          </Typography>
          <Button onClick={save}>Save & Close (Ctrl/Cmd + s)</Button>
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
            vim: Settings.MonacoVim,
          }}
          save={(options: Options) => {
            setOptions(options);
            Settings.MonacoTheme = options.theme;
            Settings.MonacoInsertSpaces = options.insertSpaces;
            Settings.MonacoFontSize = options.fontSize;
            Settings.MonacoVim = options.vim;
          }}
        />
      </div>
      <div
        style={{
          display: currentScript !== null ? "none" : "flex",
          height: "100%",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p style={{ color: Settings.theme.primary, fontSize: "20px", textAlign: "center" }}>
          <h1>No open files</h1>
          <h5>Use "nano [File Name]" in the terminal to open files</h5>
        </p>
      </div>
    </>
  );
}
