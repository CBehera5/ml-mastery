#!/usr/bin/env bash
set -uo pipefail

name="$1"
shift
directory="${TASK01511_EVIDENCE:?TASK01511_EVIDENCE must point to a temporary CI evidence directory}"
mkdir -p "$directory"
start=$SECONDS
set +e
"$@" 2>&1 | tee "$directory/$name.log"
status=${PIPESTATUS[0]}
elapsed=$((SECONDS - start))
printf '%s\t%s\t%s\n' "$name" "$status" "$elapsed" >> "$directory/exit-codes.tsv"
echo "::notice title=Task 015.11 verification::$name exited $status in ${elapsed}s"
exit "$status"
