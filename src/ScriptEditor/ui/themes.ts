export async function loadThemes(monaco: { editor: any }): Promise<void> {
  monaco.editor.defineTheme("monokai", {
    base: "vs-dark",
    inherit: true,
    rules: [
      {
        background: "272822",
        token: "",
      },
      {
        foreground: "75715e",
        token: "comment",
      },
      {
        foreground: "e6db74",
        token: "string",
      },
      {
        token: "number",
        foreground: "ae81ff",
      },
      {
        token: "otherkeyvars",
        foreground: "ae81ff",
      },
      {
        foreground: "ae81ff",
        token: "function",
      },
      {
        foreground: "f92672",
        token: "keyword",
      },
      {
        token: "storage.type.function.js",
        foreground: "ae81ff",
      },
      {
        token: "ns",
        foreground: "97d92b",
      },
      {
        token: "netscriptfunction",
        foreground: "53d3e4",
      },
      {
        token: "otherkeywords",
        foreground: "53d3e4",
      },
      {
        token: "this",
        foreground: "fd971f",
      },
    ],
    colors: {
      "editor.foreground": "#F8F8F2",
      "editor.background": "#272822",
      "editor.selectionBackground": "#49483E",
      "editor.lineHighlightBackground": "#3E3D32",
      "editorCursor.foreground": "#F8F8F0",
      "editorWhitespace.foreground": "#3B3A32",
      "editorIndentGuide.activeBackground": "#9D550FB0",
      "editor.selectionHighlightBorder": "#222218",
    },
  });

  monaco.editor.defineTheme("solarish-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      {
        background: "002b36",
        token: "",
      },
      {
        foreground: "586e75",
        token: "comment",
      },
      {
        foreground: "00afaf",
        token: "string",
      },
      {
        token: "number",
        foreground: "00afaf",
      },
      {
        token: "otherkeyvars",
        foreground: "268bd2",
      },
      {
        foreground: "268bd2",
        token: "function",
      },
      {
        foreground: "859900",
        token: "keyword",
      },
      {
        token: "storage.type.function.js",
        foreground: "cb4b16",
      },
      {
        token: "ns",
        foreground: "cb4b16",
      },
      {
        token: "netscriptfunction",
        foreground: "268bd2",
      },
      {
        token: "otherkeywords",
        foreground: "268bd2",
      },
      {
      	token: "type.identifier.js",
	foreground: "b58900",
      },
      {
      	token: "delimiter.square.js",
	foreground: "0087ff",
      },
      {
      	token: "delimiter.bracket.js",
	foreground: "0087ff",
      },
      {
        token: "this",
        foreground: "cb4b16",
      },
    ],
    colors: {
      "editor.foreground": "#839496",
      "editor.background": "#002b36",
      "editor.selectionBackground": "#073642",
      "editor.lineHighlightBackground": "#073642",
      "editorCursor.foreground": "#819090",
      "editorWhitespace.foreground": "#073642",
      "editorIndentGuide.activeBackground": "#9D550FB0",
      "editor.selectionHighlightBorder": "#222218",
    },
  });

  monaco.editor.defineTheme("solarish-light", {
    base: "vs",
    inherit: true,
    rules: [
      {
        foreground: "657b83",
	background: "fdf6e3",
        token: "",
      },
      {
        foreground: "586e75",
        token: "comment",
      },
      {
        foreground: "2aa198",
        token: "string",
      },
      {
        token: "number",
        foreground: "2aa198",
      },
      {
        token: "otherkeyvars",
        foreground: "268bd2",
      },
      {
        foreground: "268bd2",
        token: "function",
      },
      {
        foreground: "859900",
        token: "keyword",
      },
      {
        token: "storage.type.function.js",
        foreground: "bc4b16",
      },
      {
        token: "ns",
        foreground: "cb4b16",
      },
      {
        token: "netscriptfunction",
        foreground: "268bd2",
      },
      {
        token: "otherkeywords",
        foreground: "268bd2",
      },
      {
      	token: "type.identifier.js",
	foreground: "b58900",
      },
      {
      	token: "delimiter.square.js",
	foreground: "0087ff",
      },
      {
      	token: "delimiter.bracket.js",
	foreground: "0087ff",
      },
      {
        token: "this",
        foreground: "cb4b16",
      },
    ],
    colors: {
      "editor.foreground": "#657b83",
      "editor.background": "#fdf6e3",
      "editor.selectionBackground": "#eee8d5",
      "editor.lineHighlightBackground": "#eee8d5",
      "editorCursor.foreground": "#657b83",
      "editorWhitespace.foreground": "#eee8d5",
      "editorIndentGuide.activeBackground": "#eee8d5",
      "editor.selectionHighlightBorder": "#073642",
    },
  });
}
