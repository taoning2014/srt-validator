#!/bin/sh
jsfiles=$(git diff --cached --name-only --diff-filter=ACM | grep '\.js\(on\)\?$' | tr '\n' ' ')
[ -z "$jsfiles" ] && exit 0

# Prettify all staged .js & .json files
echo "$jsfiles" | xargs ./node_modules/.bin/prettier --write

# Add back the modified/prettified files to staging
echo "$jsfiles" | xargs git add

exit 0
”
