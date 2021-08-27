module.exports = {
    setupFiles: ["./jest.setup.js"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
    },
    // testMatch: ["**/?(*.)+(test).[jt]s?(x)"],
    testEnvironment: "jsdom",
};
