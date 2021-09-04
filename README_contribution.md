## Deploying a new version

Update the following

- `src/Constants.ts` `Version` and `LatestUpdate`
- `package.json` `version`
- `doc/source/conf.py` `version` and `release`
- `doc/source/changelog.rst`
- post to discord
- post to reddit.com/r/Bitburner

## Deploying `dev` to the Beta Branch

TODO

## Development Workflow Best Practices

- Work in a new branch forked from the `dev` branch to isolate your new code
  - Keep code-changes on a branch as small as possible. This makes it easier for code review. Each branch should be its own independent feature.
  - Regularly rebase your branch against `dev` to make sure you have the latest updates pulled.
  - When merging, always merge your branch into `dev`. When releasing a new update, then merge `dev` into `master`
