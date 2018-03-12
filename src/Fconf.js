import {parse, Node}                            from "../utils/acorn.js";

var FconfSettings = {
    ENABLE_BASH_HOTKEYS:     false
}

var FconfComments = {
    ENABLE_BASH_HOTKEYS: "Improved Bash emulation mode. Setting this to 1 enables several\n" +
                         "new Terminal shortcuts and features that more closely resemble\n" +
                         "a real Bash-style shell. Note that when this mode is enabled,\n"  +
                         "the default browser shortcuts are overriden by the new Bash\n" +
                         "shortcuts.\n\n" +
                         "To see a full list of the Terminal shortcuts that this enables, see:\n" +
                         "http://bitburner.readthedocs.io/en/latest/shortcuts.html",
}

//Parse Fconf settings from the config text
//Throws an exception if parsing fails
function parseFconfSettings(config) {
    var ast = parse(config, {sourceType:"module"});
    var queue = [];
    queue.push(ast);
    while (queue.length != 0) {
        var exp = queue.shift();
        switch (exp.type) {
            case "BlockStatement":
            case "Program":
                for (var i = 0; i < exp.body.length; ++i) {
                    if (exp.body[i] instanceof Node) {
                        queue.push(exp.body[i]);
                    }
                }
                break;
            case "AssignmentExpression":
                var setting, value;
                if (exp.left != null && exp.left.name != null) {
                    setting = exp.left.name;
                } else {
                    break;
                }
                if (exp.right != null && exp.right.raw != null) {
                    value = exp.right.raw;
                } else {
                    break;
                }
                parseFconfSetting(setting, value);
                break;
            default:
                break;
        }

        for (var prop in exp) {
            if (exp.hasOwnProperty(prop)) {
                if (exp[prop] instanceof Node) {
                    queue.push(exp[prop]);
                }
            }
        }
    }
}

function parseFconfSetting(setting, value) {
    setting = String(setting);
    value = String(value);
    if (setting == null || value == null || FconfSettings[setting] == null) {
        console.log("WARNING: Invalid .fconf setting: " + setting);
        return;
    }

    //Needed to convert entered value to boolean/strings accordingly
    switch(setting) {
        case "ENABLE_BASH_HOTKEYS":
            var value = value.toLowerCase();
            if (value === "1" || value === "true" || value === "y") {
                value = true;
            } else {
                value = false;
            }
            FconfSettings[setting] = value;
            break;
        default:
            break;
    }
    return;
}

//Create the .fconf file text from the settings
function createFconf() {
    var res = "";
    for (var setting in FconfSettings) {
        if (FconfSettings.hasOwnProperty(setting)) {
            //Setting comments (description)
            var comment = FconfComments[setting];
            if (comment == null) {continue;}
            var comment = comment.split("\n");
            for (var i = 0; i < comment.length; ++i) {
                res += ("//" + comment[i] + "\n");
            }

            var value = 0;
            if (FconfSettings[setting] === true) {
                value = "1";
            } else if (FconfSettings[setting] === false) {
                value = "0";
            } else {
                value = String(FconfSettings[setting]);
            }
            res += (setting + "=" + value + "\n");
        }
    }
    return res;
}

function loadFconf(saveString) {
    FconfSettings = JSON.parse(saveString);
}

export {FconfSettings, createFconf, parseFconfSettings, loadFconf}
