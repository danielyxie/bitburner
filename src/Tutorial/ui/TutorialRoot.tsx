import React from "react";

export function TutorialRoot(): React.ReactElement {
  return (
    <div id="tutorial-container">
      <h1>Tutorial (AKA Links to Documentation)</h1>
      <a
        id="tutorial-getting-started-link"
        className="a-link-button"
        target="_blank"
        href="https://bitburner.readthedocs.io/en/latest/guidesandtips/gettingstartedguideforbeginnerprogrammers.html"
      >
        Getting Started
      </a>
      <br />
      <br />
      <a
        className="a-link-button"
        target="_blank"
        href="https://bitburner.readthedocs.io/en/latest/basicgameplay/servers.html"
      >
        Servers & Networking
      </a>
      <br />
      <br />
      <a
        className="a-link-button"
        target="_blank"
        href="https://bitburner.readthedocs.io/en/latest/basicgameplay/hacking.html"
      >
        Hacking
      </a>
      <br />
      <br />
      <a
        className="a-link-button"
        target="_blank"
        href="https://bitburner.readthedocs.io/en/latest/basicgameplay/scripts.html"
      >
        Scripts
      </a>
      <br />
      <br />
      <a className="a-link-button" target="_blank" href="https://bitburner.readthedocs.io/en/latest/netscript.html">
        Netscript Programming Language
      </a>
      <br />
      <br />
      <a
        className="a-link-button"
        target="_blank"
        href="https://bitburner.readthedocs.io/en/latest/basicgameplay/world.html"
      >
        Traveling
      </a>
      <br />
      <br />
      <a
        className="a-link-button"
        target="_blank"
        href="https://bitburner.readthedocs.io/en/latest/basicgameplay/companies.html"
      >
        Companies
      </a>
      <br />
      <br />
      <a
        className="a-link-button"
        target="_blank"
        href="https://bitburner.readthedocs.io/en/latest/basicgameplay/infiltration.html"
      >
        Infiltration
      </a>
      <br />
      <br />
      <a
        className="a-link-button"
        target="_blank"
        href="https://bitburner.readthedocs.io/en/latest/basicgameplay/factions.html"
      >
        Factions
      </a>
      <br />
      <br />
      <a
        className="a-link-button"
        target="_blank"
        href="https://bitburner.readthedocs.io/en/latest/basicgameplay/augmentations.html"
      >
        Augmentations
      </a>
      <br />
      <br />
      <a className="a-link-button" target="_blank" href="https://bitburner.readthedocs.io/en/latest/shortcuts.html">
        Keyboard Shortcuts
      </a>
    </div>
  );
}
