// Enums that defined allowed values for setting configuration

/**
 * Allowed values for 'Keybinding/Keymap' setting in Ace editor
 */
export enum AceKeybindingSetting {
    Ace = "ace",
    Emacs = "emacs",
    Vim = "vim",
}

/**
 * Allowed values for 'Keybinding/Keymap' setting in Code Mirror editor
 */
export enum CodeMirrorKeybindingSetting {
    Default = "default",
    Emacs = "emacs",
    Sublime = "sublime",
    Vim = "vim",
}

/**
 * Allowed values for 'Theme' setting in Code Mirror editor
 */
export enum CodeMirrorThemeSetting {
    Monokai = "monokai",
    Day_3024 = "3024-day",
    Night_3024 = "3024-night",
    abcdef = "abcdef",
    Ambiance_mobile = "ambiance-mobile",
    Ambiance = "ambiance",
    Base16_dark = "base16-dark",
    Base16_light = "base16-light",
    Bespin = "bespin",
    Blackboard = "blackboard",
    Cobalt = "cobalt",
    Colorforth = "colorforth",
    Darcula = "darcula",
    Dracula = "dracula",
    Duotone_dark = "duotone-dark",
    Duotone_light = "duotone-light",
    Eclipse = "eclipse",
    Elegant = "elegant",
    Erlang_dark = "erlang-dark",
    Gruvbox_dark = "gruvbox-dark",
    Hopscotch = "hopscotch",
    Icecoder = "icecoder",
    Idea = "idea",
    Isotope = "isotope",
    Lesser_dark = "lesser-dark",
    Liquibyte = "liquibyte",
    Lucario = "lucario",
    Material = "material",
    Mbo = "mbo",
    Mdn_like = "mdn-like",
    Midnight = "midnight",
    Neat = "neat",
    Neo = "neo",
    Night = "night",
    Oceanic_next = "oceanic-next",
    Panda_syntax = "panda-syntax",
    Paraiso_dark = "paraiso-dark",
    Paraiso_light = "paraiso-light",
    Pastel_on_dark = "pastel-on-dark",
    Railscasts = "railscasts",
    Rubyblue = "rubyblue",
    Seti = "seti",
    Shadowfox = "shadowfox",
    Solarized = "solarized",
    ssms = "ssms",
    The_matrix = "the-matrix",
    Tomorrow_night_bright = "tomorrow-night-bright",
    Tomorrow_night_eighties = "tomorrow-night-eighties",
    Ttcn = "ttcn",
    Twilight = "twilight",
    Vibrant_ink = "vibrant-ink",
    xq_dark = "xq-dark",
    xq_light = "xq-light",
    Yeti = "yeti",
    Zenburn = "zenburn",
}

/**
 * Allowed values for the "Editor" setting
 */
export enum EditorSetting {
    Ace = "Ace",
    CodeMirror = "CodeMirror",
}

/**
 * Allowed values for the 'OwnedAugmentationsOrder' setting
 */
export enum PurchaseAugmentationsOrderSetting {
    Cost,
    Default,
    Reputation,
}

/**
 * Allowed values for the 'OwnedAugmentationsOrder' setting
 */
export enum OwnedAugmentationsOrderSetting {
    Alphabetically,
    AcquirementTime,
}
