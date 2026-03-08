#!/bin/bash
# Egyszeri futtatás: SSH kulcs másolása a VPS-re, utána nem kell jelszót írni
# Használat: ./scripts/ssh-setup.sh
# Vagy: SSHPASS='jelszó' ./scripts/ssh-setup.sh

VPS="root@217.13.105.9"

if ! command -v sshpass &>/dev/null; then
  echo "Telepítsd az sshpass-t: sudo apt install sshpass"
  exit 1
fi

if [ -z "$SSHPASS" ]; then
  echo "Add meg a jelszót: SSHPASS='jelszó' $0"
  exit 1
fi

sshpass -e ssh-copy-id -o StrictHostKeyChecking=no "$VPS"
echo "Kész! Mostantól: ssh $VPS (jelszó nélkül)"
echo "Töröld a jelszót a terminálból: unset SSHPASS"
