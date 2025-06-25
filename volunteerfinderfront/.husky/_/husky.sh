#!/bin/sh
if [ -z "$husky_skip_init" ]; then
  debug() {
    [ "$HUSKY_DEBUG" = "1" ] && echo "husky (debug) - $*"
  }

  readonly hook_name="$(basename "$0")"
  debug "starting $hook_name..."

  readonly husky_dir="$(dirname "$0")/.."
  readonly husky_config="$husky_dir/.huskyrc"
  readonly npx_cmd="npx --no-install"

  if [ -f "$husky_config" ]; then
    debug "reading config from $husky_config"
    . "$husky_config"
  fi

  if [ "$HUSKY" = "0" ]; then
    debug "HUSKY env variable is set to 0, skipping hook"; exit 0
  fi
  if [ -f ~/.huskyrc ]; then
    debug "sourcing ~/.huskyrc"
    . ~/.huskyrc
  fi
  debug "git params: $*"
fi

