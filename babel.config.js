const TEST = process.env.NODE_ENV === "test";

module.exports = {
  presets: [
    "@babel/preset-react",
    TEST && "@babel/preset-env",
    TEST && "@babel/preset-typescript",
  ].filter(Boolean),
};
