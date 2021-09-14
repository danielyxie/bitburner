import React from "react";

interface IProps {}

export function GameOptionsRoot(props: IProps): React.ReactElement {
  return (
    <>
      <h1>Game Options</h1>
    </>
  );
  /*

          <h1>Game Options</h1>
          <br />
          <div id="game-options-left-panel">
            <!-- Netscript execution time -->
            <fieldset>
              <label for="settingsNSExecTimeRangeVal" class="tooltip"
                >Netscript exec time:&nbsp;
                <span class="tooltiptext">
                  The minimum number of milliseconds it takes to execute an operation in Netscript. Setting this too low
                  can result in poor performance if you have many scripts running. The default value is 25ms.
                </span>
              </label>

              <input
                class="optionRange"
                type="range"
                max="100"
                min="10"
                step="1"
                name="settingsNSExecTimeRangeVal"
                id="settingsNSExecTimeRangeVal"
                value="25"
              />
              <em id="settingsNSExecTimeRangeValLabel" style="font-style: normal"></em>
            </fieldset>

            <!-- Log capacity -->
            <fieldset>
              <label for="settingsNSLogRangeVal" class="tooltip"
                >Netscript log size:&nbsp;&nbsp;
                <span class="tooltiptext">
                  The maximum number of lines a script's logs can hold. Setting this too high can cause the game to use
                  a lot of memory if you have many scripts running. The default value is 50.
                </span>
              </label>

              <input
                class="optionRange"
                type="range"
                max="100"
                min="20"
                step="1"
                name="settingsNSLogRangeVal"
                id="settingsNSLogRangeVal"
                value="50"
              />
              <em id="settingsNSLogRangeValLabel" style="font-style: normal"></em>
            </fieldset>

            <!-- Port capacity -->
            <fieldset>
              <label for="settingsNSPortRangeVal" class="tooltip"
                >Netscript port size:&nbsp;
                <span class="tooltiptext">
                  The maximum number of entries that can be written to a port using Netscript's write() function.
                  Setting this too high can cause the game to use a lot of memory. The default value is 50.
                </span>
              </label>

              <input
                class="optionRange"
                type="range"
                max="100"
                min="20"
                step="1"
                name="settingsNSPortRangeVal"
                id="settingsNSPortRangeVal"
                value="50"
              />
              <em id="settingsNSPortRangeValLabel" style="font-style: normal"></em>
            </fieldset>

            <!-- Autosave Interval -->
            <fieldset>
              <label for="settingsAutosaveIntervalVal" class="tooltip"
                >Autosave Interval:&nbsp;&nbsp;&nbsp;
                <span class="tooltiptext">
                  The time (in seconds) between each autosave. Set to 0 to disable autosave.
                </span>
              </label>

              <input
                class="optionRange"
                type="range"
                max="600"
                min="0"
                step="1"
                name="settingsAutosaveIntervalVal"
                id="settingsAutosaveIntervalVal"
                value="60"
              />
              <em id="settingsAutosaveIntervalValLabel" style="font-style: normal"></em>
            </fieldset>

            <!-- Suppress messages -->
            <fieldset>
              <label for="settingsSuppressMessages" class="tooltip"
                >Suppress Messages:
                <span class="tooltiptext">
                  If this is set, then any messages you receive will not appear as popups on the screen. They will still
                  get sent to your home computer as '.msg' files and can be viewed with the 'cat' Terminal command.
                </span>
              </label>
              <input
                class="optionCheckbox"
                type="checkbox"
                name="settingsSuppressMessages"
                id="settingsSuppressMessages"
              />
            </fieldset>

            <!-- Suppress faction invites -->
            <fieldset>
              <label for="settingsSuppressFactionInvites" class="tooltip"
                >Suppress Faction Invites:
                <span class="tooltiptexthigh">
                  If this is set, then any faction invites you receive will not appear as popups on the screen. Your
                  outstanding faction invites can be viewed in the 'Factions' page.
                </span>
              </label>
              <input
                class="optionCheckbox"
                type="checkbox"
                name="settingsSuppressFactionInvites"
                id="settingsSuppressFactionInvites"
              />
            </fieldset>

            <!-- Suppress travel confirmation -->
            <fieldset>
              <label for="settingsSuppressTravelConfirmation" class="tooltip"
                >Suppress Travel Confirmation:
                <span class="tooltiptexthigh">
                  If this is set, the confirmation message before traveling will not show up. You will automatically be
                  deducted the travel cost as soon as you click.
                </span>
              </label>
              <input
                class="optionCheckbox"
                type="checkbox"
                name="settingsSuppressTravelConfirmation"
                id="settingsSuppressTravelConfirmation"
              />
            </fieldset>

            <!-- Suppress buy aug confirmation -->
            <fieldset>
              <label for="settingsSuppressBuyAugmentationConfirmation" class="tooltip"
                >Suppress buy augmentation confirmation:
                <span class="tooltiptexthigh">
                  If this is set, the confirmation message before buying augmentation will not show up.
                </span>
              </label>
              <input
                class="optionCheckbox"
                type="checkbox"
                name="settingsSuppressBuyAugmentationConfirmation"
                id="settingsSuppressBuyAugmentationConfirmation"
              />
            </fieldset>

            <!-- Hospitalization Popup -->
            <fieldset>
              <label for="settingsSuppressHospitalizationPopup" class="tooltip"
                >Suppress Hospitalization popup:
                <span class="tooltiptexthigh">
                  If this is set, a popup message will no longer be shown when you are hospitalized after taking too
                  much damage.
                </span>
              </label>
              <input
                class="optionCheckbox"
                type="checkbox"
                name="settingsSuppressHospitalizationPopup"
                id="settingsSuppressHospitalizationPopup"
              />
            </fieldset>

            <!-- Suppress Bladeburner popups -->
            <fieldset>
              <label for="settingsSuppressBladeburnerPopup" class="tooltip"
                >Suppress Bladeburner Popup:
                <span class="tooltiptext">
                  If this is set, then having your Bladeburner actions interrupted by being busy with something else
                  will not display a popup message.
                </span>
              </label>
              <input
                class="optionCheckbox"
                type="checkbox"
                name="settingsSuppressBladeburnerPopup"
                id="settingsSuppressBladeburnerPopup"
              />
            </fieldset>

            <!-- Disable Terminal and Navigation Shortcuts -->
            <fieldset>
              <label for="settingsDisableHotkeys" class="tooltip"
                >Disable Hotkeys:
                <span class="tooltiptexthigh">
                  If this is set, then most hotkeys (keyboard shortcuts) in the game are disabled. This includes
                  Terminal commands, hotkeys to navigate between different parts of the game, and the "Save and Close
                  (Ctrl + b)" hotkey in the Text Editor.
                </span>
              </label>
              <input class="optionCheckbox" type="checkbox" name="settingsDisableHotkeys" id="settingsDisableHotkeys" />
            </fieldset>

            <!-- View city as list of buttons instead of ASCII art. -->
            <fieldset>
              <label for="settingsDisableASCIIArt" class="tooltip"
                >Disable ASCII art:
                <span class="tooltiptexthigh"> If this is set all ASCII art will be disabled. </span>
              </label>
              <input
                class="optionCheckbox"
                type="checkbox"
                name="settingsDisableASCIIArt"
                id="settingsDisableASCIIArt"
              />
            </fieldset>

            <!-- Disable text effects such as corruption. -->
            <fieldset>
              <label for="settingsDisableTextEffects" class="tooltip"
                >Disable Text Effects:
                <span class="tooltiptexthigh">
                  If this is set, text effects will not be displayed. This can help if text is difficult to read in
                  certain areas.
                </span>
              </label>
              <input
                class="optionCheckbox"
                type="checkbox"
                name="settingsDisableTextEffects"
                id="settingsDisableTextEffects"
              />
            </fieldset>

            <!-- Locale for displaying numbers -->
            <fieldset>
              <label for="settingsLocale" class="tooltip"
                >Locale:
                <span class="tooltiptexthigh"> Sets the locale for displaying numbers. Defaults to 'en' </span>
              </label>
              <select name="settingsLocale" id="settingsLocale" class="dropdown">
                <option value="en">en</option>
                <option value="bg">bg</option>
                <option value="cs">cs</option>
                <option value="da-dk">da-dk</option>
                <option value="de">de</option>
                <option value="en-au">en-au</option>
                <option value="en-gb">en-gb</option>
                <option value="es">es</option>
                <option value="fr">fr</option>
                <option value="hu">hu</option>
                <option value="it">it</option>
                <option value="lv">lv</option>
                <option value="no">no</option>
                <option value="pl">pl</option>
                <option value="ru">ru</option>
              </select>
            </fieldset>

            <!-- Donate button -->
            <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
              <input type="hidden" name="cmd" value="_s-xclick" />
              <input
                type="hidden"
                name="encrypted"
                value="-----BEGIN PKCS7-----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-----END PKCS7-----
                "
              />
              <input
                type="image"
                src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif"
                border="0"
                name="submit"
                alt="PayPal - The safer, easier way to pay online!"
              />
              <img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1" />
            </form>
          </div>
          <div id="game-options-right-panel">
            <a class="a-link-button" href="https://bitburner.readthedocs.io/en/latest/changelog.html" target="_blank">
              Changelog
            </a>
            <a class="a-link-button" href="https://bitburner.readthedocs.io/en/latest/index.html" target="_blank"
              >Documentation</a
            >
            <a class="a-link-button" href="https://discord.gg/TFc3hKD" target="_blank">Discord</a>
            <a class="a-link-button" href="https://www.reddit.com/r/bitburner" target="_blank">Subreddit</a>
            <button id="save-game-link" class="a-link-button">Save Game</button>
            <button id="delete-game-link" class="a-link-button">Delete Game</button>
            <button id="export-game-link" class="a-link-button">Export Game</button>
            <input type="file" id="import-game-file-selector" name="file" />
            <button id="import-game-link" class="a-link-button">Import Game</button>
            <button id="copy-save-to-clipboard-link" class="std-button">Copy Save data to Clipboard</button>
            <button id="debug-delete-scripts-link" class="a-link-button tooltip">
              Force kill all active scripts
              <span class="tooltiptextleft">
                Forcefully kill all active running scripts, in case there is a bug or some unexpected issue with the
                game. After using this, save the game and then reload the page. This is different then normal kill in
                that normal kill will tell the script to shut down while force kill just removes the references to it
                (and it should crash on it's own). This will not remove the files on your computer. Just forcefully kill
                all running instance of all scripts.
              </span>
            </button>
            <button id="debug-soft-reset" class="a-link-button tooltip">
              Soft Reset
              <span class="tooltiptextleft">
                Perform a soft reset. Resets everything as if you had just purchased an Augmentation.
              </span>
            </button>
            <button id="debug-files" class="a-link-button tooltip">
              Diagnose files
              <span class="tooltiptextleft">
                If your save file is extremely big you can use this button to view a map of all the files on every
                server. Be careful there might be spoilers.
              </span>
            </button>
          </div>

    */
}
