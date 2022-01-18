#!/bin/sh

version=${2:-HEAD}
cat >> temp_changelog.md << EOF
# v1.X.X ($version)

Description Here.

Compare Commits [on github](https://github.com/danielyxie/bitburner/compare/$1...$version).

---

### Commits
EOF

git log $1...${version} \
  --pretty=format:'* [`%h`]([https://github.com/danielyxie/bitburner/commit/%H): %s (by %aN on %ad) %n' \
  --date=short \
  --no-merges >> temp_changelog.md
  # --reverse >> temp_changelog.md

rm -f changelog_$1_${version}.md
mv temp_changelog.md changelog_$1_${version}.md
