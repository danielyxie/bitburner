# Frequently Asked Questions

## Can I donate to the project?

No, the project does not take donation.

If you still want to donate, go donate blood to your local blood bank or donate to the [Electronic Frontier Foundation](https://www.eff.org/) or [Médecins Sans Frontières](https://www.msf.org/)

---

## I need help / Where can I learn?

The best way to get help is to join the [official discord server](https://discord.gg/TFc3hKD). People of all skill levels will be able to give you hints and tips.

---

## Can I play the same save on browser & steam?

Yes, just export the save file from the options menu & import it in the other platform.

---

## Game is stuck after running scripts!

You may have created an infinite loop with no sleep. You'll have to restart the game by killing all scripts.

- On Browser: Stick `?noScript` at the end of the URL
- On Steam:
  - In the menu, "Reloads" -> "Reload & Kill All Scripts".
  - If this does not work, when launching the game, use the kill all script options.

---

## Steam: Where is the save game located?

To maintain compatibility with the web browser version, the save game is not stored as a file on your filesystem. It lives inside the localStorage of the WebKit instance. You may export the save (and should backup it!) in the option menu.

---

## Steam: Game won't stop / Game is shown as "Running"

Due to a limitation with the way Steam tracks the game, if you launch an external link (such as documentation), Steam may keep tracking the game as "Running" even after it is closed. You should simply have to close your web browser to fix this.

---

## Steam: How do I get to the game files? <a name="game-files"></a>

You can navigate to the game files by right-clicking the game in your library and then go into "Manage" -> "Browse Local Files". The game can be launched directly from that location, if you're having issues with Steam.

---

## Steam: Game won't launch

### **On Windows**

If the game is installed on a network drive, it will fail to start due to a [limitation in Chromium](https://github.com/electron/electron/issues/27356).

If you cannot move the game to another drive, you'll have to add the `--no-sandbox` launch option. In your Steam Library, Right click the game and hit "Properties". You'll see the launch option section in the "General" window.

### **On Linux**

The game is built natively, do not use Proton unless native does not work.

When launching the game, you will be prompted with three options. If the standard launch does not work, you may attempt the `--disable-seccomp-filter-sandbox` or `--no-sandbox` launch option. If this still does not work, the game should be able to start by launching it directly or through the terminal. See [How do I get to the game files?](#game-files).

---

## Steam: File locations

### Logs (using [electron-log](https://github.com/megahertz/electron-log#readme))

You may want access the logs to get information about crashes or such.

- on Linux: `~/.config/bitburner/logs/main.log`
- on macOS: `~/Library/Logs/bitburner/main.log`
- on Windows: `%USERPROFILE%\AppData\Roaming\bitburner\logs\main.log`

### Config (using [electron-store](https://github.com/sindresorhus/electron-store#readme))

Configuration file will be written to disk in the application data directory.

- on Linux: `~/.config/bitburner/config.json`
- on macOS: `~/Library/Application\ Support/bitburner/config.json`
- on Windows: `%USERPROFILE%\AppData\Roaming\bitburner\config.json`

---

## Steam: What is the API Server?

The API Server allows the official [Visual Studio Code Extension](https://github.com/bitburner-official/bitburner-vscode) to push script file from VSCode to your in-game home.
