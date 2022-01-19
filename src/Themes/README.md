# Themes

Feel free to contribute a new theme by submitting a pull request to the game!

See [CONTRIBUTING.md](/CONTRIBUTING.md) for details.

## How create a new theme

1. Duplicate one of the folders in `/src/Themes/data` and give it a new name (keep the hyphenated format)
2. Modify the data in the new `/src/Themes/data/new-folder/index.ts` file
3. Replace the screenshot.png with one of your theme
4. Add the import/export into the `/src/Themes/data/index.ts` file

The themes are ordered according to the export order in `index.ts`

## Other resources

There is an external script called `theme-browser` which may include more themes than those shown here. Head over the [bitpacker](https://github.com/davidsiems/bitpacker) repository for details.
