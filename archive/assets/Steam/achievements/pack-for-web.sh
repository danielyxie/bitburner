#!/bin/bash

BASEDIR=$(dirname "$0")
ROOTDIR=$BASEDIR/../../..
echo $ROOTDIR
rm -rf $ROOTDIR/dist/icons/achievements
mkdir -p $ROOTDIR/dist/icons
cp -r $BASEDIR/real $ROOTDIR/dist/icons/achievements
for i in $ROOTDIR/dist/icons/achievements/*.svg; do
  echo $i
  # Make background transparent and replace green with black
  # The icons will be recolored by css filters matching the player's theme
  sed -i "s/fill:#000000;/fill-opacity: 0%;/g" "$i"
  sed -i "s/fill:#00ff00;/fill:#000000;/g" "$i"
done
