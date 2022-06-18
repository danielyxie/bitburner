export {};

beforeEach(() => {
  cy.visit("/", {
    onBeforeLoad(win: Cypress.AUTWindow) {
      win.indexedDB.deleteDatabase("bitburnerSave");
    },
  });
  cy.clearLocalStorage();
});
