import Editor from "@monaco-editor/react";
import type { Monaco } from "@monaco-editor/react";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import SyncIcon from "@mui/icons-material/Sync";
import { TextField, Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { debounce } from "lodash";
import type * as monaco from "monaco-editor";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import { ITutorial, iTutorialNextStep, iTutorialSteps } from "../../InteractiveTutorial";
import type { WorkerScript } from "../../Netscript/WorkerScript";
import { NetscriptFunctions } from "../../NetscriptFunctions";
import type { IPlayer } from "../../PersonObjects/IPlayer";
import { saveObject } from "../../SaveObject";
import { isScriptFilename } from "../../Script/isScriptFilename";
import { RamCalculationErrorCode } from "../../Script/RamCalculationErrorCodes";
import { calculateRamUsage, checkInfiniteLoop } from "../../Script/RamCalculations";
import { Script } from "../../Script/Script";
import { GetServer } from "../../Server/AllServers";
import { Settings } from "../../Settings/Settings"; // Red flag!
import { isValidFilePath } from "../../Terminal/DirectoryHelpers";
import { TextFile } from "../../TextFile";
import { numeralWrapper } from "../../ui/numeralFormat";
import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { Modal } from "../../ui/React/Modal";
import { PromptEvent } from "../../ui/React/PromptManager";
import type { IRouter } from "../../ui/Router";

import type { Options } from "./Options";
import { OptionsModal } from "./OptionsModal";
import { loadThemes, makeTheme, sanitizeTheme } from "./themes";

import libSource from "!!raw-loader!../NetscriptDefinitions.d.ts";

type IStandaloneCodeEditor = monaco.editor.IStandaloneCodeEditor;
type ITextModel = monaco.editor.ITextModel;
interface IProps {
  // Map of filename -> code
  files: Record<string, string>;
  hostname: string;
  player: IPlayer;
  router: IRouter;
  vim: boolean;
}

// TODO: try to remove global symbols
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

let openScripts: OpenScript[] = [];
let currentScript: OpenScript | null = null;

// Called every time script editor is opened
export function Root(props: IProps): React.ReactElement {
  const setRerender = useState(false)[1];
  function rerender(): void {
    setRerender((o) => !o);
  }
  const editorRef = useRef<IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const vimStatusRef = useRef<HTMLElement>(null);
  const [vimEditor, setVimEditor] = useState<any>(null);
  const [editor, setEditor] = useState<IStandaloneCodeEditor | null>(null);
  const [filter, setFilter] = useState("");
  const [searchExpanded, setSearchExpanded] = useState(false);

  const [ram, setRAM] = useState("RAM: ???");
  const [ramEntries, setRamEntries] = useState<string[][]>([["???", ""]]);
  const [updatingRam, setUpdatingRam] = useState(false);
  const [decorations, setDecorations] = useState<string[]>([]);

  const [optionsOpen, setOptionsOpen] = useState(false);
  const [options, setOptions] = useState<Options>({
    theme: Settings.MonacoTheme,
    insertSpaces: Settings.MonacoInsertSpaces,
    fontSize: Settings.MonacoFontSize,
    wordWrap: Settings.MonacoWordWrap,
    vim: props.vim || Settings.MonacoVim,
  });

  const [ramInfoOpen, setRamInfoOpen] = useState(false);

  // Prevent Crash if script is open on deleted server
  openScripts = openScripts.filter((script) => {
    return GetServer(script.hostname) !== null;
  });
  if (currentScript && GetServer(currentScript.hostname) === null) {
    currentScript = openScripts[0];
    if (currentScript === undefined) currentScript = null;
  }

  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });
  useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    }, 250);

    window.addEventListener("resize", debouncedHandleResize);

    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  }, []);

  useEffect(() => {
    if (currentScript !== null) {
      updateRAM(currentScript.code);
    }
  }, []);

  useEffect(() => {
    function keydown(event: KeyboardEvent): void {
      if (Settings.DisableHotkeys) return;
      //Ctrl + b
      if (event.code == "KeyB" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        props.router.toTerminal();
      }

      // CTRL/CMD + S
      if (event.code == "KeyS" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        event.stopPropagation();
        save();
      }
    }
    document.addEventListener("keydown", keydown);
    return () => document.removeEventListener("keydown", keydown);
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
            props.router.toTerminal();
          });
          // "wqriteandquit" is not a typo, prefix must be found in full string
          MonacoVim.VimMode.Vim.defineEx("wqriteandquit", "wq", function () {
            save();
            props.router.toTerminal();
          });

          // Setup "go to next tab" and "go to previous tab". This is a little more involved
          // since these aren't Ex commands (they run in normal mode, not after typing `:`)
          MonacoVim.VimMode.Vim.defineAction("nextTabs", function (_cm: any, args: { repeat?: number }) {
            const nTabs = args.repeat ?? 1;
            // Go to the next tab (to the right). Wraps around when at the rightmost tab
            const currIndex = currentTabIndex();
            if (currIndex !== undefined) {
              const nextIndex = (currIndex + nTabs) % openScripts.length;
              onTabClick(nextIndex);
            }
          });
          MonacoVim.VimMode.Vim.defineAction("prevTabs", function (_cm: any, args: { repeat?: number }) {
            const nTabs = args.repeat ?? 1;
            // Go to the previous tab (to the left). Wraps around when at the leftmost tab
            const currIndex = currentTabIndex();
            if (currIndex !== undefined) {
              let nextIndex = currIndex - nTabs;
              while (nextIndex < 0) {
                nextIndex += openScripts.length;
              }
              onTabClick(nextIndex);
            }
          });
          MonacoVim.VimMode.Vim.mapCommand("gt", "action", "nextTabs", {}, { context: "normal" });
          MonacoVim.VimMode.Vim.mapCommand("gT", "action", "prevTabs", {}, { context: "normal" });
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
      script.model = monacoRef.current.editor.createModel(
        script.code,
        script.fileName.endsWith(".txt") ? "plaintext" : "javascript",
      );
    }
  }

  const debouncedSetRAM = useMemo(
    () =>
      debounce((s, e) => {
        setRAM(s);
        setRamEntries(e);
        setUpdatingRam(false);
      }, 300),
    [],
  );

  async function updateRAM(newCode: string): Promise<void> {
    if (currentScript != null && currentScript.fileName.endsWith(".txt")) {
      debouncedSetRAM("N/A", [["N/A", ""]]);
      return;
    }
    setUpdatingRam(true);
    const codeCopy = newCode + "";
    const ramUsage = await calculateRamUsage(props.player, codeCopy, props.player.getCurrentServer().scripts);
    if (ramUsage.cost > 0) {
      const entries = ramUsage.entries?.sort((a, b) => b.cost - a.cost) ?? [];
      const entriesDisp = [];
      for (const entry of entries) {
        entriesDisp.push([`${entry.name} (${entry.type})`, numeralWrapper.formatRAM(entry.cost)]);
      }

      debouncedSetRAM("RAM: " + numeralWrapper.formatRAM(ramUsage.cost), entriesDisp);
      return;
    }
    switch (ramUsage.cost) {
      case RamCalculationErrorCode.ImportError: {
        debouncedSetRAM("RAM: Import Error", [["Import Error", ""]]);
        break;
      }
      case RamCalculationErrorCode.URLImportError: {
        debouncedSetRAM("RAM: HTTP Import Error", [["HTTP Import Error", ""]]);
        break;
      }
      case RamCalculationErrorCode.SyntaxError:
      default: {
        debouncedSetRAM("RAM: Syntax Error", [["Syntax Error", ""]]);
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
      // replaced the bare tokens with regexes surrounded by \b, e.g. \b{token}\b which matches a word-break on either side
      // this prevents the highlighter from highlighting pieces of variables that start with a reserved token name
      l.language.tokenizer.root.unshift([new RegExp("\\bns\\b"), { token: "ns" }]);
      for (const symbol of symbols)
        l.language.tokenizer.root.unshift([new RegExp(`\\b${symbol}\\b`), { token: "netscriptfunction" }]);
      const otherKeywords = ["let", "const", "var", "function"];
      const otherKeyvars = ["true", "false", "null", "undefined"];
      otherKeywords.forEach((k) =>
        l.language.tokenizer.root.unshift([new RegExp(`\\b${k}\\b`), { token: "otherkeywords" }]),
      );
      otherKeyvars.forEach((k) =>
        l.language.tokenizer.root.unshift([new RegExp(`\\b${k}\\b`), { token: "otherkeyvars" }]),
      );
      l.language.tokenizer.root.unshift([new RegExp("\\bthis\\b"), { token: "this" }]);
    })();

    const source = (libSource + "").replace(/export /g, "");
    monaco.languages.typescript.javascriptDefaults.addExtraLib(source, "netscript.d.ts");
    monaco.languages.typescript.typescriptDefaults.addExtraLib(source, "netscript.d.ts");
    loadThemes(monaco);
    sanitizeTheme(Settings.EditorTheme);
    monaco.editor.defineTheme("customTheme", makeTheme(Settings.EditorTheme));
  }

  // When the editor is mounted
  function onMount(editor: IStandaloneCodeEditor, monaco: Monaco): void {
    // Required when switching between site navigation (e.g. from Script Editor -> Terminal and back)
    // the `useEffect()` for vim mode is called before editor is mounted.
    setEditor(editor);

    editorRef.current = editor;
    monacoRef.current = monaco;

    if (editorRef.current === null || monacoRef.current === null) return;

    if (!props.files && currentScript !== null) {
      // Open currentscript
      regenerateModel(currentScript);
      editorRef.current.setModel(currentScript.model);
      editorRef.current.setPosition(currentScript.lastPosition);
      editorRef.current.revealLineInCenter(currentScript.lastPosition.lineNumber);
      updateRAM(currentScript.code);
      editorRef.current.focus();
      return;
    }
    if (props.files) {
      const files = Object.entries(props.files);

      if (!files.length) {
        editorRef.current.focus();
        return;
      }

      for (const [filename, code] of files) {
        // Check if file is already opened
        const openScript = openScripts.find(
          (script) => script.fileName === filename && script.hostname === props.hostname,
        );
        if (openScript) {
          // Script is already opened
          if (openScript.model === undefined || openScript.model === null || openScript.model.isDisposed()) {
            regenerateModel(openScript);
          }

          currentScript = openScript;
          editorRef.current.setModel(openScript.model);
          editorRef.current.setPosition(openScript.lastPosition);
          editorRef.current.revealLineInCenter(openScript.lastPosition.lineNumber);
          updateRAM(openScript.code);
        } else {
          // Open script
          const newScript = new OpenScript(
            filename,
            code,
            props.hostname,
            new monacoRef.current.Position(0, 0),
            monacoRef.current.editor.createModel(code, filename.endsWith(".txt") ? "plaintext" : "javascript"),
          );
          openScripts.push(newScript);
          currentScript = { ...newScript };
          editorRef.current.setModel(newScript.model);
          updateRAM(newScript.code);
        }
      }
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
    if (editorRef.current === null) return;
    const newPos = editorRef.current.getPosition();
    if (newPos === null) return;
    if (currentScript !== null) {
      currentScript = { ...currentScript, code: newCode, lastPosition: newPos };
      const curIndex = openScripts.findIndex(
        (script) =>
          currentScript !== null &&
          script.fileName === currentScript.fileName &&
          script.hostname === currentScript.hostname,
      );
      const newArr = [...openScripts];
      const tempScript = currentScript;
      tempScript.code = newCode;
      newArr[curIndex] = tempScript;
      openScripts = [...newArr];
    }
    try {
      infLoop(newCode);
    } catch (err) {}
  }

  function saveScript(scriptToSave: OpenScript): void {
    const server = GetServer(scriptToSave.hostname);
    if (server === null) throw new Error("Server should not be null but it is.");
    if (isScriptFilename(scriptToSave.fileName)) {
      //If the current script already exists on the server, overwrite it
      for (let i = 0; i < server.scripts.length; i++) {
        if (scriptToSave.fileName == server.scripts[i].filename) {
          server.scripts[i].saveScript(
            props.player,
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
      script.saveScript(
        props.player,
        scriptToSave.fileName,
        scriptToSave.code,
        props.player.currentServer,
        server.scripts,
      );
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
      dialogBoxCreate("Invalid filename. Must be either a script (.script, .js, or .ns) or a text file (.txt)");
      return;
    }

    if (Settings.SaveGameOnFileSave) saveObject.saveGame();
    props.router.toTerminal();
  }

  function save(): void {
    if (currentScript === null) {
      console.error("currentScript is null when it shouldn't be. Unable to save script");
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
            props.player,
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
      script.saveScript(
        props.player,
        currentScript.fileName,
        currentScript.code,
        props.player.currentServer,
        server.scripts,
      );
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
      dialogBoxCreate("Invalid filename. Must be either a script (.script, .js, or .ns) or a text file (.txt)");
      return;
    }

    if (Settings.SaveGameOnFileSave) saveObject.saveGame();
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

    openScripts = items;
  }

  function currentTabIndex(): number | undefined {
    if (currentScript !== null) {
      return openScripts.findIndex(
        (script) =>
          currentScript !== null &&
          script.fileName === currentScript.fileName &&
          script.hostname === currentScript.hostname,
      );
    }

    return undefined;
  }

  function onTabClick(index: number): void {
    if (currentScript !== null) {
      // Save currentScript to openScripts
      const curIndex = currentTabIndex();
      if (curIndex !== undefined) {
        openScripts[curIndex] = currentScript;
      }
    }

    currentScript = { ...openScripts[index] };

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

  function onTabClose(index: number): void {
    // See if the script on the server is up to date
    const closingScript = openScripts[index];
    const savedScriptIndex = openScripts.findIndex(
      (script) => script.fileName === closingScript.fileName && script.hostname === closingScript.hostname,
    );
    let savedScriptCode = "";
    if (savedScriptIndex !== -1) {
      savedScriptCode = openScripts[savedScriptIndex].code;
    }
    const server = GetServer(closingScript.hostname);
    if (server === null) throw new Error(`Server '${closingScript.hostname}' should not be null, but it is.`);

    const serverScriptIndex = server.scripts.findIndex((script) => script.filename === closingScript.fileName);
    if (serverScriptIndex === -1 || savedScriptCode !== server.scripts[serverScriptIndex as number].code) {
      PromptEvent.emit({
        txt: "Do you want to save changes to " + closingScript.fileName + "?",
        resolve: (result: boolean | string) => {
          if (result) {
            // Save changes
            closingScript.code = savedScriptCode;
            saveScript(closingScript);
          }
        },
      });
    }

    if (openScripts.length > 1) {
      openScripts = openScripts.filter((value, i) => i !== index);

      let indexOffset = -1;
      if (openScripts[index + indexOffset] === undefined) {
        indexOffset = 1;
        if (openScripts[index + indexOffset] === undefined) {
          indexOffset = 0;
        }
      }

      // Change current script if we closed it
      currentScript = openScripts[index + indexOffset];
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
      rerender();
    } else {
      // No more scripts are open
      openScripts = [];
      currentScript = null;
      props.router.toTerminal();
    }
  }

  function onTabUpdate(index: number): void {
    const openScript = openScripts[index];
    const serverScriptCode = getServerCode(index);
    if (serverScriptCode === null) return;

    if (openScript.code !== serverScriptCode) {
      PromptEvent.emit({
        txt:
          "Do you want to overwrite the current editor content with the contents of " +
          openScript.fileName +
          " on the server? This cannot be undone.",
        resolve: (result: boolean | string) => {
          if (result) {
            // Save changes
            openScript.code = serverScriptCode;

            // Switch to target tab
            onTabClick(index);

            if (editorRef.current !== null && openScript !== null) {
              if (openScript.model === undefined || openScript.model.isDisposed()) {
                regenerateModel(openScript);
              }
              editorRef.current.setModel(openScript.model);

              editorRef.current.setValue(openScript.code);
              updateRAM(openScript.code);
              editorRef.current.focus();
            }
          }
        },
      });
    }
  }

  function dirty(index: number): string {
    const openScript = openScripts[index];
    const serverScriptCode = getServerCode(index);
    if (serverScriptCode === null) return " *";

    // The server code is stored with its starting & trailing whitespace removed
    const openScriptFormatted = Script.formatCode(openScript.code);
    return serverScriptCode !== openScriptFormatted ? " *" : "";
  }

  function getServerCode(index: number): string | null {
    const openScript = openScripts[index];
    const server = GetServer(openScript.hostname);
    if (server === null) throw new Error(`Server '${openScript.hostname}' should not be null, but it is.`);

    const serverScript = server.scripts.find((s) => s.filename === openScript.fileName);
    return serverScript?.code ?? null;
  }
  function handleFilterChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setFilter(event.target.value);
  }
  function handleExpandSearch(): void {
    setFilter("");
    setSearchExpanded(!searchExpanded);
  }
  const filteredOpenScripts = Object.values(openScripts).filter(
    (script) => script.hostname.includes(filter) || script.fileName.includes(filter),
  );

  // Toolbars are roughly 112px:
  //  8px body margin top
  //  38.5px filename tabs
  //  5px padding for top of editor
  //  44px bottom tool bar + 16px margin
  //  + vim bar 34px
  const editorHeight = dimensions.height - (130 + (options.vim ? 34 : 0));
  const tabsMaxWidth = 1640;
  const tabMargin = 5;
  const tabMaxWidth = filteredOpenScripts.length ? tabsMaxWidth / filteredOpenScripts.length - tabMargin : 0;
  const tabIconWidth = 25;
  const tabTextWidth = tabMaxWidth - tabIconWidth * 2;
  return (
    <>
      <div style={{ display: currentScript !== null ? "block" : "none", height: "100%", width: "100%" }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="tabs" direction="horizontal">
            {(provided, snapshot) => (
              <Box
                maxWidth={`${tabsMaxWidth}px`}
                display="flex"
                flexDirection="row"
                alignItems="center"
                whiteSpace="nowrap"
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  backgroundColor: snapshot.isDraggingOver
                    ? Settings.theme.backgroundsecondary
                    : Settings.theme.backgroundprimary,
                  overflowX: "scroll",
                }}
              >
                <Tooltip title={"Search Open Scripts"}>
                  {searchExpanded ? (
                    <TextField
                      value={filter}
                      onChange={handleFilterChange}
                      autoFocus
                      InputProps={{
                        startAdornment: <SearchIcon />,
                        spellCheck: false,
                        endAdornment: <CloseIcon onClick={handleExpandSearch} />,
                      }}
                    />
                  ) : (
                    <Button onClick={handleExpandSearch}>
                      <SearchIcon />
                    </Button>
                  )}
                </Tooltip>
                {filteredOpenScripts.map(({ fileName, hostname }, index) => {
                  const iconButtonStyle = {
                    maxWidth: `${tabIconWidth}px`,
                    minWidth: `${tabIconWidth}px`,
                    minHeight: "38.5px",
                    maxHeight: "38.5px",
                    ...(currentScript?.fileName === filteredOpenScripts[index].fileName
                      ? {
                          background: Settings.theme.button,
                          borderColor: Settings.theme.button,
                          color: Settings.theme.primary,
                        }
                      : {
                          background: Settings.theme.backgroundsecondary,
                          borderColor: Settings.theme.backgroundsecondary,
                          color: Settings.theme.secondary,
                        }),
                  };

                  const scriptTabText = `${hostname}:~/${fileName} ${dirty(index)}`;
                  return (
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
                            maxWidth: `${tabMaxWidth}px`,
                            marginRight: `${tabMargin}px`,
                            flexShrink: 0,
                            border: "1px solid " + Settings.theme.well,
                          }}
                        >
                          <Tooltip title={scriptTabText}>
                            <Button
                              onClick={() => onTabClick(index)}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                if (e.button === 1) onTabClose(index);
                              }}
                              style={{
                                maxWidth: `${tabTextWidth}px`,
                                minHeight: "38.5px",
                                overflow: "hidden",
                                ...(currentScript?.fileName === filteredOpenScripts[index].fileName
                                  ? {
                                      background: Settings.theme.button,
                                      borderColor: Settings.theme.button,
                                      color: Settings.theme.primary,
                                    }
                                  : {
                                      background: Settings.theme.backgroundsecondary,
                                      borderColor: Settings.theme.backgroundsecondary,
                                      color: Settings.theme.secondary,
                                    }),
                              }}
                            >
                              <span style={{ overflow: "hidden", direction: "rtl", textOverflow: "ellipsis" }}>
                                {scriptTabText}
                              </span>
                            </Button>
                          </Tooltip>
                          <Tooltip title="Overwrite editor content with saved file content">
                            <Button onClick={() => onTabUpdate(index)} style={iconButtonStyle}>
                              <SyncIcon fontSize="small" />
                            </Button>
                          </Tooltip>
                          <Button onClick={() => onTabClose(index)} style={iconButtonStyle}>
                            <CloseIcon fontSize="small" />
                          </Button>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
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
          height={`${editorHeight}px`}
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
          <Button startIcon={<SettingsIcon />} onClick={() => setOptionsOpen(true)} sx={{ mr: 1 }}>
            Options
          </Button>
          <Button onClick={beautify}>Beautify</Button>
          <Button
            color={updatingRam ? "secondary" : "primary"}
            sx={{ mx: 1 }}
            onClick={() => {
              setRamInfoOpen(true);
            }}
          >
            {ram}
          </Button>
          <Button onClick={save}>Save (Ctrl/Cmd + s)</Button>
          <Button sx={{ mx: 1 }} onClick={props.router.toTerminal}>
            Terminal (Ctrl/Cmd + b)
          </Button>
          <Typography>
            {" "}
            <strong>Documentation:</strong>{" "}
            <Link target="_blank" href="https://bitburner.readthedocs.io/en/latest/index.html">
              Basic
            </Link>
            {" | "}
            <Link target="_blank" href="https://github.com/danielyxie/bitburner/blob/dev/markdown/bitburner.ns.md">
              Full
            </Link>
          </Typography>
        </Box>
        <OptionsModal
          open={optionsOpen}
          onClose={() => {
            sanitizeTheme(Settings.EditorTheme);
            monacoRef.current?.editor.defineTheme("customTheme", makeTheme(Settings.EditorTheme));
            setOptionsOpen(false);
          }}
          options={{
            theme: Settings.MonacoTheme,
            insertSpaces: Settings.MonacoInsertSpaces,
            fontSize: Settings.MonacoFontSize,
            wordWrap: Settings.MonacoWordWrap,
            vim: Settings.MonacoVim,
          }}
          save={(options: Options) => {
            sanitizeTheme(Settings.EditorTheme);
            monacoRef.current?.editor.defineTheme("customTheme", makeTheme(Settings.EditorTheme));
            setOptions(options);
            Settings.MonacoTheme = options.theme;
            Settings.MonacoInsertSpaces = options.insertSpaces;
            Settings.MonacoFontSize = options.fontSize;
            Settings.MonacoWordWrap = options.wordWrap;
            Settings.MonacoVim = options.vim;
          }}
        />
        <Modal open={ramInfoOpen} onClose={() => setRamInfoOpen(false)}>
          <Table>
            <TableBody>
              {ramEntries.map(([n, r]) => (
                <React.Fragment key={n + r}>
                  <TableRow>
                    <TableCell sx={{ color: Settings.theme.primary }}>{n}</TableCell>
                    <TableCell align="right" sx={{ color: Settings.theme.primary }}>
                      {r}
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </Modal>
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
        <span style={{ color: Settings.theme.primary, fontSize: "20px", textAlign: "center" }}>
          <Typography variant="h4">No open files</Typography>
          <Typography variant="h5">
            Use <code>nano FILENAME</code> in
            <br />
            the terminal to open files
          </Typography>
        </span>
      </div>
    </>
  );
}
