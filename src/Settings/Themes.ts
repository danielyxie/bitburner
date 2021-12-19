export interface ITheme {
  [key: string]: string | undefined;
  primarylight: string;
  primary: string;
  primarydark: string;
  successlight: string;
  success: string;
  successdark: string;
  errorlight: string;
  error: string;
  errordark: string;
  secondarylight: string;
  secondary: string;
  secondarydark: string;
  warninglight: string;
  warning: string;
  warningdark: string;
  infolight: string;
  info: string;
  infodark: string;
  welllight: string;
  well: string;
  white: string;
  black: string;
  hp: string;
  money: string;
  hack: string;
  combat: string;
  cha: string;
  int: string;
  rep: string;
  disabled: string;
  backgroundprimary: string;
  backgroundsecondary: string;
  button: string;
}

export const defaultTheme: ITheme = {
  primarylight: "#0f0",
  primary: "#0c0",
  primarydark: "#090",
  successlight: "#0f0",
  success: "#0c0",
  successdark: "#090",
  errorlight: "#f00",
  error: "#c00",
  errordark: "#900",
  secondarylight: "#AAA",
  secondary: "#888",
  secondarydark: "#666",
  warninglight: "#ff0",
  warning: "#cc0",
  warningdark: "#990",
  infolight: "#69f",
  info: "#36c",
  infodark: "#039",
  welllight: "#444",
  well: "#222",
  white: "#fff",
  black: "#000",
  hp: "#dd3434",
  money: "#ffd700",
  hack: "#adff2f",
  combat: "#faffdf",
  cha: "#a671d1",
  int: "#6495ed",
  rep: "#faffdf",
  disabled: "#66cfbc",
  backgroundprimary: "#000",
  backgroundsecondary: "#000",
  button: "#333",
};

export interface IPredefinedThemes {
  'Default': ITheme;
  'Monokai': ITheme;
}

export const getPredefinedThemes = (): IPredefinedThemes => ({
  'Default': defaultTheme,
  'Monokai': {
    ...defaultTheme,

    backgroundprimary: '#272822',
    backgroundsecondary: '#1B1C18',
    primary: '#F8F8F2',
    primarylight: '#FFF',
    primarydark: '#FAFAEB',
    success: '#A6E22E',
    successlight: '#ADE146',
    successdark: '#98E104',
    error: '#F92672',
    errorlight: '#FF69A0',
    errordark: '#D10F56',
    warning: '#E6DB74',
    warninglight: '#E1D992',
    warningdark: '#EDDD54',
    info: '#66D9EF',
    infolight: '#92E1F1',
    infodark: '#31CDED',

    hp: '#F92672',
    money: '#E6DB74',
    hack: '#A6E22E',
    combat: '#75715E',
    cha: '#AE81FF',
    int: '#66D9EF',
    rep: '#E69F66',
  }
});
