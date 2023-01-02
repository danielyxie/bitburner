# Only bugfix are accepted

# Contributing to Bitburner

## In General

The game is made better because the community as a whole speaks up about
ways to improve the game. Here are some of the ways you can make your voice
heard:

- [Discord](https://discord.gg/XKEGvHqVr3).
  There is a dedicated Discord instance set up for more free-form chats
  between all members of the community. Regular players, heavy scripters,
  Bitburner contributors, and everyone in between can be found on the
  server.
- [Github Issues](https://github.com/bitburner-official/bitburner-src/issues).
  Although the term "issues" can have a negative connotation, they are a
  means of communicating with the community. A new Issue can be an
  interesting new feature that you feel would improve the game. It could be
  an unexpected behavior within the game. Or because the game is about
  scripting perhaps there is something that is conflicting with the
  browser's JavaScript interaction. So please do not be afraid to open a
  [new Issue](https://github.com/bitburner-official/bitburner-src/issues/new).

## Reporting Bugs

The recommended method for reporting a bug is by opening a
[Github Issue](https://github.com/bitburner-official/bitburner-src/issues).

Alternatively, you can post a bug by creating a post on the
[game's subreddit](https://www.reddit.com/r/Bitburner/).

Before submitting a bug report, please check to make sure the bug has not
already been reported as an [Issue](https://github.com/bitburner-official/bitburner-src/issues).

#### How to Submit a Good Bug Report

- **Use a clear and descriptive title** for the Issue.
- **State your browser, your browser's version, and your computer's OS.**
- **Attach your save file**, if you think it would help solve the Issue.
  Zip your save file first, then attach the zipped save file.
- **Provide instructions on how to reproduce the bug** in as much detail
  as possible. If you cannot reliably reproduce the bug, then just try
  your best to explain what was happening when the bug occurred.
- **Provide any scripts** that triggered the bug if the Issue is Netscript-related.
- **Open your browser's Dev Console and report any error-related output**
  that may be printed there. The Dev Console can be opened on most modern
  browsers by pressing F12.

## As a Developer

Anyone is welcome to contribute to Bitburner code. However, please read
the [license](https://github.com/bitburner-official/bitburner-src/blob/dev/license.txt)
and the [readme](https://github.com/bitburner-official/bitburner-src/blob/dev/README.md)
before doing so.

To contribute to Bitburner code, you will need to have
[NodeJS](https://nodejs.org) installed. When installing NodeJS, a utility
called `npm` is installed as well.

#### What are you Allowed to Contribute?

Not all code contributions will be accepted. The safest way to ensure
that you don't waste time working on something that gets rejected is to
run your idea(s)/plan(s) past [danielyxie](https://github.com/danielyxie) first.
You can contact him through:

- Github
- Discord
- [Reddit](https://www.reddit.com/user/chapt3r/)

Otherwise, here are some general guidelines for determining what types of
changes are okay to contribute:

##### Contributions that Will Most Likely Be Accepted

- Bug fixes
- Quality-of-life changes
  - Adding a new, commonly-requested Netscript function
  - Fixing or improving UI elements
  - Adding game settings/options
  - Adding a new Terminal command
- Code refactors that conform to good/standard practices

##### Contributions that will not be Accepted without prior approval

- Changes that directly affect the game's balance
- New gameplay mechanics

---

## How to setup fork properly

Clone and fork the game's repository by using one of these methods: web browser, GitHub
Desktop, or command line.

- Web browser. Log in to your GitHub account, navigate to the
  [game's repository](https://github.com/bitburner-official/bitburner-src), and fork the
  repository. Refer to
  [this page](https://docs.github.com/en/get-started/quickstart/fork-a-repo) for more
  detail.
- GitHub Desktop. Click on `File`, then click `Clone repository`. Click on the `URL`
  tab and type `bitburner-official/bitburner-src` into the text box for repository URL. Choose
  the path where you want to clone the repository and click the `Clone` button.
  Refer to [this page](https://docs.github.com/en/desktop/contributing-and-collaborating-using-github-desktop/adding-and-cloning-repositories/cloning-and-forking-repositories-from-github-desktop)
  for more detail.
- Command line.

```sh
# This clones the game's code repository. The output you get might vary.
$ git clone https://github.com/bitburner-official/bitburner-src.git
Cloning into 'bitburner'...
remote: Enumerating objects: 57072, done.
remote: Counting objects: 100% (404/404), done.
remote: Compressing objects: 100% (205/205), done.
remote: Total 57072 (delta 210), reused 375 (delta 199), pack-reused 56668
Receiving objects: 100% (57072/57072), 339.11 MiB | 5.42 MiB/s, done.
Resolving deltas: 100% (43708/43708), done.
Updating files: 100% (2561/2561), done.

# Change to the directory that contains your local copy.
$ cd bitburner-src

# The upstream is the repository that contains the game's source code. The
# upstream is also the place where proposed changes are merged into the game.
$ git remote rename origin upstream
Renaming remote references: 100% (8/8), done.

# The origin is your own copy or fork of the game's source code. Assume that
# your fork will be on GitHub. Change "myname" to your GitHub username. Change
# "myfork" to the name of your forked repository.
$ git remote add origin https://github.com/myname/myfork

# Now "origin" is your fork and "upstream" is where changes should be merged.
$ git remote show
origin
upstream

# You can now download all changes and branches from the upstream repository.
# The output you get might vary.
$ git fetch upstream

# Make sure you always start from "upstream/dev" to avoid merge conflicts.
$ git branch
* dev
$ git branch -r
upstream/BN14
upstream/HEAD -> upstream/dev
upstream/dev
upstream/folders
upstream/master
```

## Development Workflow Best Practices

- Work in a new branch forked from the `dev` branch to isolate your new code.
  - Keep code-changes on a branch as small as possible. This makes it easier for code review. Each branch should be its own independent feature.
  - Regularly rebase your branch against `dev` to make sure you have the latest updates pulled.
  - When merging, always merge your branch into `dev`. When releasing a new update, merge `dev` into `master`.

## Running locally

Install

- `npm` (maybe via `nvm`)
- Github Desktop (Windows only)
- Visual Studio Code (optional)

Inside the root of the repository run:

- `npm install` to install all the dependencies; and
- `npm run start:dev` to launch the game in dev mode.

After that you can open any browser and navigate to `localhost:8000` and play the game.
Saving a file will reload the game automatically.

### How to build the electron app

Tested on Node v16.13.1 (LTS) on Windows.
These steps only work in a Bash-like environment, like MinGW for Windows.

```sh
# Install the main game dependencies & build the app in debug mode.
$ npm install
$ npm run build:dev

# Use electron-packager to build the app to the .build/ folder.
$ npm run electron

# When launching the .exe directly, you'll need the steam_appid.txt file in the root.
# If not using Windows, change this line accordingly.
$ cp .build/bitburner-win32-x64/resources/app/steam_appid.txt .build/bitburner-win32-x64/steam_appid.txt

# And run the game...
$ .build/bitburner-win32-x64/bitburner.exe
```

### Submitting a Pull Request

When submitting a pull request with your code contributions, please abide by
the following rules:

- Work in a branch forked from `dev` to isolate the new code.
- Ensure you have the latest from the [game's main
  repository](../../../tree/dev).
- Rebase your branch if necessary.
- Run the game locally to test out your changes.
- When submitting the pull request, make sure that the base fork is
  _bitburner-official/bitburner-src_ and the base is _dev_.
- If your changes affect the game's UI, attach some screenshots or GIFs showing
  the changes to the UI.
- If your changes affect Netscript, provide some
  scripts that can be used to test the Netscript changes.
- Ensure you have run `npm run lint` to make sure your changes conform to the
  rules enforced across the code base. The command will fail if any of the
  linters find a violation.
- Do not check in any bundled files (`dist\*.bundle.js`) or the `index.html`
  in the root of the repository. These will be updated as part of official
  releases.

## As a Documenter

To contribute to and view your changes to the BitBurner documentation on [Read The
Docs](http://bitburner.readthedocs.io/), you will
need to have Python installed, along with [Sphinx](http://www.sphinx-doc.org).

To make change to the [in-game documentation](../markdown/bitburner.md), you will need to modify the [TypeScript definitions](../src/ScriptEditor/NetscriptDefinitions.d.ts), not the Markdown files.

We are using [API Extractor](https://api-extractor.com/pages/tsdoc/doc_comment_syntax/) (tsdoc hints) to generate the Markdown doc. Make your changes to the TypeScript definitions and then run `npm run doc`.

Before submitting your code for a pull request, please try to follow these
rules:

- Work in a branch forked from `dev` to isolate the new code.
- Ensure you have the latest from the [game's main
  repository](../../../tree/dev).
- Rebase your branch if necessary.
- When submitting the pull request, make sure that the base fork is
  _bitburner-official/bitburner-src_ and the base is _dev_.
- Do not check in any generated files under `doc\`. The documentation is built
  automatically by ReadTheDocs.

## Deploying a new version

Update the following

- `src/Constants.ts` `Version` and `LatestUpdate`
- `package.json` `version`
- `doc/source/conf.py` `version` and `release`
- `doc/source/changelog.rst`
- post to Discord
- post to reddit.com/r/Bitburner
