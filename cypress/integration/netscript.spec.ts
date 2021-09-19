export {};

describe("netscript", () => {
  it("creates and runs a NetScript 2.0 script", () => {
    cy.findByRole("button", { name: "SKIP TUTORIAL" }).click();
    cy.findByText("Got it!").click();

    cy.findByRole("textbox").type("connect n00dles{enter}");
    cy.findByText(/connected to n00dles/i);

    cy.findByRole("textbox").type("run NUKE.exe{enter}");
    cy.findByText(/gained root access/i);

    cy.findByRole("textbox").type("home{enter}");
    cy.findByText(/connected to home/i);

    cy.findByRole("textbox").type("nano script.js{enter}");

    // monaco can take a bit
    cy.findByRole("code", { timeout: 15_000 }).type("{selectall}{del}").type(`export const main = async (ns) => {{}
  while(true) {{}
  await ns.hack("n00dles");`);

    cy.findByText("RAM: 1.70GB");
    cy.findByRole("button", { name: /Save & Close/i }).click();

    cy.findByRole("textbox").type("run script.js{enter}");
    cy.findByText(/Running script with 1 thread/);

    cy.findByRole("textbox").type("ps{enter}");
    cy.findByText(/\(PID - 1\) script.js/);
  });

  it("errors and shows a dialog box when static RAM !== dynamic RAM", () => {
    cy.findByRole("button", { name: "SKIP TUTORIAL" }).click();
    cy.findByText("Got it!").click();

    cy.findByRole("textbox").type("nano script.js{enter}");

    // monaco can take a bit
    cy.findByRole("code", { timeout: 15_000 }).type("{selectall}{del}").type(`export const main = async (ns) => {{}
const command = "hack";
ns[command]("n00dles");`);

    cy.findByText("RAM: 1.60GB");
    cy.findByRole("button", { name: /Save & Close/i }).click();

    cy.findByRole("textbox").type("run script.js{enter}");
    cy.findByText(/Dynamic RAM usage calculated to be greater than initial RAM usage on fn: hack./i);
  });
});
