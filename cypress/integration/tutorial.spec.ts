export {};

describe("tutorial", () => {
  it("completes the tutorial", () => {
    cy.findByText(/dark, dystopian future/);
    cy.findByRole("button", { name: "next" }).click();

    cy.findByText(/heading to the Stats page/);
    cy.findByRole("button", { name: "Stats" }).click();

    cy.findByText(/lot of important information/);
    cy.findByRole("button", { name: "next" }).click();

    cy.findByText(/head to your computer's terminal/);
    cy.findByRole("button", { name: "Terminal" }).click();

    cy.findByText(/is used to interface/);
    cy.findByRole("button", { name: "next" }).click();

    cy.findByText(/Let's try it out/i);
    cy.findByRole("textbox").type("help{enter}");

    cy.findByText(/displays a list of all available/i);
    cy.findByRole("textbox").type("ls{enter}");

    cy.findByText(/is a basic command that shows files/i);
    cy.findByRole("textbox").type("scan{enter}");

    cy.findByText(/that's great and all/i);
    cy.findByRole("textbox").type("scan-analyze{enter}");

    cy.findByText(/shows more detailed information/i);
    cy.findByRole("textbox").type("scan-analyze 2{enter}");

    cy.findByText(/now you can see information/i);
    cy.findByRole("textbox").type("connect n00dles{enter}");

    cy.findByText(/currency has become digital/i);
    cy.findByRole("textbox").type("analyze{enter}");

    cy.findByText(/For this server, the required hacking skill/i);
    cy.findByText(/Required number of open ports for NUKE/i);
    cy.findByRole("textbox").type("run NUKE.exe{enter}");

    cy.findByText(/gained root access to n00dles/i);
    cy.findByRole("textbox").type("hack{enter}");

    cy.findByText(/now attempting to hack the server/i);
    cy.findByRole("button", { name: "next" }).click();

    cy.findByRole("textbox", { timeout: 15_000 }).should("not.be.disabled").type("home{enter}");

    cy.findByRole("textbox").type("nano n00dles.script{enter}");

    // monaco can take a bit
    cy.findByRole("code", { timeout: 15_000 }).type("{selectall}{del}").type("while(true) {{}{enter}hack('n00dles');");

    cy.findByRole("button", { name: /Save & Close/i }).click();

    cy.findByText(/now we'll run the script/i);
    cy.findByRole("textbox").type("free{enter}");

    cy.findByText(/We have 8GB of free RAM on this machine/i);
    cy.findByRole("textbox").type("run n00dles.script{enter}");

    cy.findByText(/Your script is now running/i);
    cy.findByRole("button", { name: "Active Scripts" }).click();

    cy.findByText(/This page displays information about all of your scripts/i);
    cy.findByRole("button", { name: "Terminal" }).click();

    cy.findByText(/each active script contains logs/i);
    cy.findByRole("textbox").type("tail n00dles.script{enter}");

    cy.findByText(/The log for this script won't show much/i);
    cy.findByRole("button", { name: "next" }).click();

    cy.findByText(/Hacking is not the only way to earn money/i);
    cy.findByRole("button", { name: "Hacknet" }).click();

    cy.findByText(/Here you can purchase new Hacknet Nodes/i);
    cy.findByRole("button", { name: /Purchase Hacknet Node/ }).click();

    cy.findByText(/You just purchased a Hacknet Node!/i);
    cy.findByRole("button", { name: "City" }).click();

    cy.findByText(/This page lists all of the different locations/i);
    cy.findByRole("button", { name: "Tutorial" }).click();

    cy.findByText(/a lot of different documentation about the game/i);
    cy.findByRole("button", { name: "next" }).click();
    cy.findByText("Got it!").click();

    cy.findByText(/Tutorial \(AKA Links to Documentation\)/i);
  });
});
