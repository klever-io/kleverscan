#!/bin/sh
# Redirect output to stderr.
exec 1>&2

consoleregexp='console.log'

# Verifica se há ocorrências de console.log no diff em cache, excluindo o próprio script
if git diff --cached | grep -E '^\+\+\+ b/.*' | grep -vE '^\+\+\+ b/.husky/scripts/console-log.sh' | xargs git diff --cached | grep -q $consoleregexp; then
  # Mostra as linhas com console.log, excluindo o próprio script
  git diff --cached | grep -E '^\+\+\+ b/.*' | grep -vE '^\+\+\+ b/.husky/scripts/console-log.sh' | xargs git diff --cached | grep -ne $consoleregexp

  # Pergunta ao usuário se ele deseja continuar com o commit
  read -p "There are some occurrences of console.log in your modifications. Are you sure you want to continue? (y/n) " yn
  if echo "$yn" | grep -iq "^y$"; then
    # O usuário quer continuar
    exit 0
  else
    # O usuário não quer continuar, cancela o commit
    exit 1
  fi
fi
