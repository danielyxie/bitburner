// This is a reference to the native setTimeout() function
// setTimeout() is used in various places around the game's source code.
// This reference is used to make sure that if players alter window.setTimeout()
// through NetscriptJS, then the game will still function properly
export const setTimeoutRef = window.setTimeout;
