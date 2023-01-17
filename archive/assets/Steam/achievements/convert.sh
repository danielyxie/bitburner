#!/bin/bash
export INKSCAPE=/Applications/Inkscape.app/Contents/MacOS/inkscape

mkdir ${TMPDIR}real

for filename in real/*.svg; do
    #./MyProgram.exe "$filename" "Logs/$(basename "$filename" .txt)_Log$i.txt"
    cp "$filename" $TMPDIR${filename}
    sed -i '' 's/00ff00/808080/g' $TMPDIR${filename}
    $INKSCAPE --export-type png --export-filename tmp/${filename}-.png -w 256 $TMPDIR${filename}
    $INKSCAPE --export-type png --export-filename tmp/${filename}.png -w 256 "$filename"
done