#!/bin/sh
# Redirect output to stderr.
exec 1>&2

consoleregexp='console.log'
# CHECK
if test $(git diff --cached | grep $consoleregexp | wc -l) != 0
then
  git diff --cached | grep -ne $consoleregexp

  # Check if /dev/tty is available for interactive prompt
  if [ -e /dev/tty ]; then
    exec < /dev/tty
    read -p "There are some occurrences of console.log at your modification. Are you sure want to continue? (y/n)" yn
    echo $yn | grep ^[Yy]$
    if [ $? -eq 0 ]
    then
      exit 0; #THE USER WANTS TO CONTINUE
    else
      exit 1; # THE USER DONT WANT TO CONTINUE SO ROLLBACK
    fi
  else
    echo "Warning: console.log found but cannot prompt (no tty). Allowing commit."
    exit 0;
  fi
fi