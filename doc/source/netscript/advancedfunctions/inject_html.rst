Injecting HTML in the game
==========================

Bitburner uses React and Material-UI to render everything. Modifying the UI is possible but
not officially supported.

To automatically enter commands in the terminal (only works if looking at the terminal):

.. code-block:: javascript

    // Acquire a reference to the terminal text field
    const terminalInput = document.getElementById("terminal-input");

    // Set the value to the command you want to run.
    terminalInput.value="home;connect n00dles;home;connect n00dles;home;";

    // Get a reference to the React event handler.
    const handler = Object.keys(terminalInput)[1];

    // Perform an onChange event to set some internal values.
    terminalInput[handler].onChange({target:terminalInput});

    // Simulate an enter press
    terminalInput[handler].onKeyDown({keyCode:13,preventDefault:()=>null});


To add lines to the terminal (only works if looking at the terminal):

.. code-block:: javascript

    // Acquire a reference to the terminal list of lines.
    const list = document.getElementById("generic-react-container").querySelector("ul");

    // Inject some HTML.
    list.insertAdjacentHTML('beforeend',`<li><p color=lime>whatever custom html</p></li>`)