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
      //   {
      //     foreground: "ae81ff",
      //     token: "entity.name.function",
      //   },
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
}
