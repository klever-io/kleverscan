#!/bin/sh

# Define a expressão regular para console.log
consoleregexp='console.log'

# Verifica se há ocorrências de console.log no diff em cache, excluindo o próprio script
if git diff --cached | grep -q $consoleregexp; then
  # Verifica se as ocorrências estão fora do próprio script
  if git diff --cached | grep -q $consoleregexp | grep -vE '^\+\+\+ b/.husky/scripts/console-log.sh'; then
    # Mostra uma mensagem de erro e impede o commit
    echo "Error: There are some occurrences of console.log in your modifications (excluding .husky/scripts/console-log.sh). Please remove them before committing."
    exit 1
  fi
fi

# Permite o commit
exit 0
