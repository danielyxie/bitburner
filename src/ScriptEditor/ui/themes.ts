export interface IScriptEditorTheme {
  base: string;
  inherit: boolean;
  common: {
    accent: string;
    bg: string;
    fg: string;
  };
  syntax: {
    tag: string;
    entity: string;
    string: string;
    regexp: string;
    markup: string;
    keyword: string;
    comment: string;
    constant: string;
    operator: string;
    error: string;
  };
  ui: {
    line: string;
    panel: {
      bg: string;
      shadow: string;
      border: string;
    };
    selection: {
      bg: string;
    };
  };
}

export const defaultMonacoTheme: IScriptEditorTheme = {
  base: "vs-dark",
  inherit: true,
  common: {
    accent: "b5cea8",
    bg: "1E1E1E",
    fg: "D4D4D4",
  },
  syntax: {
    tag: "569cd6",
    entity: "569cd6",
    string: "ce9178",
    regexp: "646695",
    markup: "569cd6",
    keyword: "569cd6",
    comment: "6A9955",
    constant: "1E1E1E",
    operator: "d4d4d4",
    error: "f44747"
  },
  ui: {
    line: "1E1E1E",
    panel: {
      bg: "252526",
      shadow: "252526",
      border: "1E1E1E"
    },
    selection: {
      bg: "ADD6FF26"
    }
  }
}

export function makeTheme(theme: IScriptEditorTheme): any {
  const themeRules = [
    {
      token: "",
      background: theme.ui.line,
      foreground: theme.common.fg
    },
    {
      token: "identifier",
      foreground: theme.common.accent
    },
    {
      token: "operators",
      foreground: theme.syntax.operator
    },
    {
      token: "keyword",
      foreground: theme.syntax.keyword
    },
    {
      token: "string",
      foreground: theme.syntax.string
    },
    {
      token: "string.escape",
      foreground: theme.syntax.regexp
    },
    {
      token: "comment",
      foreground: theme.syntax.comment
    },
    {
      token: "constant",
      foreground: theme.syntax.constant
    },
    {
      token: "entity",
      foreground: theme.syntax.entity
    },
    {
      token: "tag",
      foreground: theme.syntax.tag
    },
    {
      token: "regexp",
      foreground: theme.syntax.regexp
    },
    {
      token: "attribute",
      foreground: theme.syntax.tag
    },
    {
      token: "constructor",
      foreground: theme.syntax.markup
    },
    {
      token: "invalid",
      foreground: theme.syntax.error
    },
    {
      token: "number",
      foreground: theme.common.accent
    },
    {
      token: "delimiter",
      foreground: theme.common.fg + "B3"
    },
    // Custom tokens
    {
      token: "ns",
      foreground: theme.syntax.tag
    },
    {
      token: "netscriptfunction",
      foreground: theme.syntax.markup
    },
    {
      token: "otherkeywords",
      foreground: theme.syntax.keyword
    },
    {
      token: "otherkeyvars",
      foreground: theme.common.accent
    },
    {
      token: "this",
      foreground: theme.syntax.tag
    }
  ];

  const themeColors = Object.fromEntries([
    ["editor.background", theme.common.bg],
    ["editor.foreground", theme.common.fg],
    ["editor.lineHighlightBackground", theme.ui.line],
    ["editor.selectionBackground", theme.ui.selection.bg],

    ["editorSuggestWidget.background", theme.ui.panel.bg],
    ["editorSuggestWidget.border", theme.ui.panel.border],
    ["editorSuggestWidget.selectedBackground", theme.ui.panel.shadow],

    ["editorHoverWidget.background", theme.ui.panel.bg],
    ["editorHoverWidget.border", theme.ui.panel.border],

    ["editorWidget.background", theme.ui.panel.bg],
    ["editorWidget.border", theme.ui.panel.border],

    ["input.background", theme.ui.panel.bg],
    ["input.border", theme.ui.panel.border]
  ].map(([k, v]) => [k, "#" + v]));

  return { base: theme.base, inherit: theme.inherit, rules: themeRules, colors: themeColors }
}

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

  monaco.editor.defineTheme("solarized-dark", {
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

  monaco.editor.defineTheme("solarized-light", {
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

  monaco.editor.defineTheme("dracula", {
    base: "vs-dark",
    inherit: true,
    rules: [
      {
        background: "282A36",
        foreground: "F8F8F2",
        token: "",
      },
      {
        foreground: "6272A4",
        token: "comment",
      },
      {
        foreground: "F1FA8C",
        token: "string",
      },
      {
        token: "number",
        foreground: "BD93F9",
      },
      {
        token: "otherkeyvars",
        foreground: "BD93F9",
      },
      {
        foreground: "FF79C6",
        token: "function",
      },
      {
        foreground: "FF79C6",
        token: "keyword",
      },
      {
        token: "storage.type.function.js",
        foreground: "FF79C6",
      },
      {
        token: "ns",
        foreground: "FFB86C",
        fontStyle: "italic",
      },
      {
        token: "netscriptfunction",
        foreground: "FF79C6",
      },
      {
        token: "otherkeywords",
        foreground: "FF68A7",
      },
      {
        token: "type.identifier.js",
        foreground: "7EE9FD",
        fontStyle: "italic"
      },
      {
        token: "delimiter.square.js",
        foreground: "FFD709",
      },
      {
        token: "delimiter.parenthesis.js",
        foreground: "FFD709"
      },
      {
        token: "delimiter.bracket.js",
        foreground: "FFD709",
      },
      {
        token: "this",
        foreground: "BD93F9",
        fontStyle: "italic",
      },
    ],
    "colors": {
      "editor.foreground": "#F8F8F2",
      "editor.background": "#282A36",
      "editorLineNumber.foreground": "#6272A4",
      "editor.selectionBackground": "#44475A",
      "editor.selectionHighlightBackground": "#424450",
      "editor.foldBackground": "#21222C",
      "editor.wordHighlightBackground": "#8BE9FD50",
      "editor.wordHighlightStrongBackground": "#50FA7B50",
      "editor.findMatchBackground": "#FFB86C80",
      "editor.findMatchHighlightBackground": "#FFFFFF40",
      "editor.findRangeHighlightBackground": "#44475A75",
      "editor.hoverHighlightBackground": "#8BE9FD50",
      "editor.lineHighlightBorder": "#44475A",
      "editor.rangeHighlightBackground": "#BD93F915",
      "editor.snippetTabstopHighlightBackground": "#282A36",
      "editor.snippetTabstopHighlightBorder": "#6272A4",
      "editor.snippetFinalTabstopHighlightBackground": "#282A36",
      "editor.snippetFinalTabstopHighlightBorder": "#50FA7B",
    },
  });

  monaco.editor.defineTheme("one-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      {
        token: "",
        background: "333842",
        foreground: "ABB2BF",
      },
      {
        token: "comment",
        foreground: "5C6370",
      },
      {
        token: "string",
        foreground: "98C379",
      },
      {
        token: "number",
        foreground: "D19A66",
      },
      {
        token: "function",
        foreground: "C678DD",
      },
      {
        token: "keyword",
        foreground: "C678DD",
      },
      {
        token: "otherkeyvars",
        foreground: "D19A66",
      },
      {
        token: "otherkeywords",
        foreground: "C678DD",
      },
      {
        token: "ns",
        foreground: "E06C75",
      },
      {
        token: "netscriptfunction",
        foreground: "61AFEF",
      },
      {
        token: "type.identifier",
        foreground: "E5C07B",
      },
      {
        token: "delimiter",
        foreground: "ABB2BF",
      },
      {
        token: "this",
        foreground: "E06C75",
      },
    ],
    colors: {
      "editor.background": "#282C34",
      "editor.foreground": "#ABB2BF",
      "editor.lineHighlightBackground": "#99BBFF0A",
      "editor.selectionBackground": "#3E4451",
      "editor.findMatchHighlightBackground": "#528BFF3D",
      "editorCursor.foreground": "#528BFF",
      "editorHoverWidget.background": "#21252B",
      "editorHoverWidget.border": "#181A1F",
      "editorIndentGuide.background": "#ABB2BF26",
      "editorIndentGuide.activeBackground": "#626772",
      "editorLineNumber.foreground": "#636D83",
      "editorLineNumber.activeForeground": "#ABB2BF",
      "editorSuggestWidget.background": "#21252B",
      "editorSuggestWidget.border": "#181A1F",
      "editorSuggestWidget.selectedBackground": "#2C313A",
      "editorWhitespace.foreground": "#ABB2BF26",
      "editorWidget.background": "#21252B",
      "editorWidget.border": "#3A3F4B",
      "input.background": "#1B1D23",
      "input.border": "#181A1F",
      "peekView.border": "#528BFF",
      "peekViewResult.background": "#21252B",
      "peekViewResult.selectionBackground": "#2C313A",
      "peekViewTitle.background": "#1B1D23",
      "peekViewEditor.background": "#1B1D23",
      "scrollbarSlider.background": "#4E566680",
      "scrollbarSlider.activeBackground": "#747D9180",
      "scrollbarSlider.hoverBackground": "#5A637580",
    }
  });
}
