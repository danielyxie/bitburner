# Contributing to Bitburner

## In General

The game is made better because the community as a whole speaks up about
ways to improve the game. Here's some of the ways you can make your voice
heard:

- [Discord](https://discordapp.com)
  There is a dedicated Discord instance set up for more free-form chats
  between all members of the community. Regular players, heavy scripters,
  Bitburner contributors, and everyone in between can be found on the
  server.
- [Github Issues](https://github.com/danielyxie/bitburner/issues)
  Although the term "issues" can have a negative connotation, they are a
  means of communicating with the community. A new Issue can be a
  interesting new feature that you feel would improve the game. It could be
  an unexpected behavior within the game. Or because the game is about
  scripting perhaps there is something that is conflicting with the
  browser's Javascript interaction. So please do not be afraid to open a
  [new issue](https://github.com/danielyxie/bitburner/issues/new).

## Reporting Bugs

The recommended method for reporting a bug is by opening a
[Github Issue](https://github.com/danielyxie/bitburner/issues).

Alternatively, you can post a bug by creating a post on the
[game's subreddit](https://www.reddit.com/r/Bitburner/).

Before submitting a bug report, please check to make sure the bug has not
already been reported as an [Issue](https://github.com/danielyxie/bitburner/issues).

#### How to Submit a Good Bug Report

- **Use a clear and descriptive title** for the issue
- **State your browser, your browser's version, and your computer's OS**
- **Attach your save file**, if you think it would help solve the issue
- **Provide instructions on how to reproduce the bug** in as much detail
  as possible. If you cannot reliably reproduce the bug, then just try
  your best to explain what was happening when the bug occurred
- **Provide any scripts** that triggered the bug if the issue is Netscript-related
- **Open your browser's Dev Console and report any error-related output**
  that may be printed there. The Dev Console can be opened on most modern
  browsers by pressing F12

## As a Developer

Anyone is welcome to contribute to Bitburner code. However, please read
the [license](https://github.com/danielyxie/bitburner/blob/dev/license.txt)
and the [readme](https://github.com/danielyxie/bitburner/blob/dev/README.md)
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

- Bug Fixes
- Quality-of-Life Changes
  - Adding a new, commonly-requested Netscript function
  - Fixing or improving UI elements
  - Adding game settings/options
  - Adding a new Terminal command
- Code Refactors that conform to good/standard practices

##### Contributions that will not be Accepted without prior approval

- Changes that directly affect the game's balance
- New gameplay mechanics

### How to setup fork properly

Fork and clone the repo

```
  # This will add the game original code as a repo in your local copy
  $ git remote add danielyxie git@github.com:danielyxie/bitburner.git

  # You can verify you did this right by doing the following command
  $ git remote show
  danielyxie
  origin

  # Then download all the branches from the game. (there might be more branches)
  $ git fetch danielyxie
  From github.com:danielyxie/bitburner
  * [new branch]        dev             -> danielyxie/dev
  * [new branch]        master          -> danielyxie/master

  # Makes sure you always start from `danielyxie/dev` to avoid merge conflicts.
```

### Running locally.

Install

- `npm` (maybe via `nvm`)
- Github Desktop (windows only)
- Visual Studio code (optional)

Inside the root of the repo run
`npm install` to install all the dependencies
`npm run start:dev` to launch the game in dev mode.

After that you can open any browser and naviguate to `localhost:8000` and play the game.
Saving a file will reload the game automatically.

#### Submitting a Pull Request

When submitting a pull request with your code contributions, please abide by
the following rules:

- Work in a branch forked from `dev` to isolate the new code
- Ensure you have latest from the [game's main
  repository](danielyxie/bitburner@dev)
- Rebase your branch if necessary
- Run the game locally to test out your changes
- When submitting the pull request, make sure that the base fork is
  _danielyxie/bitburner_ and the base is _dev_.
- If your changes affect the game's UI, attach some screenshots or GIFs showing
  the changes to the UI
- If your changes affect Netscript, provide some
  scripts that can be used to test the Netscript changes.
- Ensure you have run `npm run lint` to make sure your changes conform to the
  rules enforced across the code base. The command will fail if any of the
  linters find a violation.
- Do not check in any bundled files (`dist\*.bundle.js`) or the `index.html`
  in the root of the repository. These will be updated as part of official
  releases.

## As a Documentor

To contribute to and view your changes to the BitBurner documentation, you will
need to have Python installed, along with [Sphinx](http://www.sphinx-doc.org).

Before submitting your code for a pull request, please try to follow these
rules:

- Work in a branch forked from `dev` to isolate the new code
- Ensure you have latest from the [game's main
  repository](danielyxie/bitburner@dev)
- Rebase your branch if necessary
- When submitting the pull request, make sure that the base fork is
  _danielyxie/bitburner_ and the base is _dev_.
- Do not check in any generated files under `doc\`. The documentation is built
  automatically by ReadTheDocs.
