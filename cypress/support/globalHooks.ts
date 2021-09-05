export {};

beforeEach(() => {
  cy.visit("/");
  cy.clearLocalStorage();
  cy.window().then((win) => {
    win.indexedDB.deleteDatabase("bitburnerSave");
  });
});
