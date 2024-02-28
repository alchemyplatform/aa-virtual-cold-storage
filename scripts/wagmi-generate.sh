#!/usr/bin/env bash

set -e

FILE=utils/wagmi.ts

npx wagmi generate
# Disable typechecking in the generated code. It's not our problem.
echo -e "// @ts-nocheck\n$(cat $FILE)" > $FILE