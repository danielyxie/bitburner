export {};

describe("netscript", () => {
  it("Do naviguation", () => {
    cy.findByRole("button", { name: "SKIP TUTORIAL" }).click();
    cy.findByText("Got it!").click();

    cy.findByText("Dev").click();
    cy.findByText(/Source-Files/i).click();
    cy.findByLabelText(/all-sf-3/i).click();
    cy.findByText(/Experience/i).click();
    cy.findByText(/Tons of exp/i).click();
    cy.findByText(/General/i).click();
    cy.findByText(/Hack w0/i).click();
    cy.findByText(/SEMPOOL INVALID/i);
    cy.findByText(/Many decades/i, { timeout: 15000 });
    cy.findByLabelText("enter-bitnode-1").click();
    cy.findByText(/Enter BN1.2/i).click();

    cy.get("body").type("{esc}");

    cy.findByText("Dev").click();
    cy.findByText(/Experience/i).click();
    cy.findByText(/Tons of exp/i).click();

    cy.findByText("Create Script").click();
    cy.findByText(/Script name:/i);

    cy.findByText("Active Scripts").click();
    cy.findByText(/Total online production of/i);

    cy.findByText("Create Program").click();
    cy.findByText(/This page displays/i);

    cy.findByText("Stats").click();
    cy.findByText(/Current City:/i);

    cy.findByText("Factions").click();
    cy.findByText(/Lists all/i);

    cy.findByText("Augmentations").click();
    cy.findByText(/Purchased Augmentations/i);

    cy.findByText("Hacknet").click();
    cy.findByText(/The Hacknet is a global/i);

    cy.findByText("Sleeves").click();
    cy.findByText(/Duplicate Sleeves are MK/i);

    cy.findByText("City").click();
    cy.findByText(/Sector-12/i);
    cy.findByLabelText("The Slums").click();
    cy.findByText("City").click();
    cy.findByLabelText("Powerhouse Gym").click();
    cy.findByText("City").click();
    cy.findByLabelText("MegaCorp").click();

    cy.findByText("Travel").click();
    cy.findByText(/Travel Agency/i);

    cy.findByText("Stock Market").click();
    cy.findByText(/ECorp/i);

    cy.findByText("Milestones").click();
    cy.findByText(/don't reward you for/i);

    cy.findByText("Tutorial").click();
    cy.findByText(/AKA Links to/i);

    cy.findByText("Options").click();
    cy.findByText(/Netscript exec time/i);
  });
});
