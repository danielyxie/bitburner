module.exports = {
  setupFiles: ["./jest.setup.js"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  testPathIgnorePatterns: [
    '.cypress', 'node_modules', 'dist',
  ],
  testEnvironment: "jsdom",
};
