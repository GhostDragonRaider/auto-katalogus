#!/bin/bash
# Deploy az anticode.hu VPS-re
# Előfeltétel: ssh-setup.sh lefuttatva (jelszó nélküli SSH)
# Vagy: SSHPASS='jelszó' ./scripts/deploy.sh
# Vagy: hozz létre scripts/.env.local fájlt: SSHPASS='jelszó' (gitignore-ban van)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
[ -f "$SCRIPT_DIR/.env.local" ] && source "$SCRIPT_DIR/.env.local"

VPS="root@217.13.105.9"

run_ssh() {
  if [ -n "$SSHPASS" ] && command -v sshpass &>/dev/null; then
    sshpass -e ssh -o StrictHostKeyChecking=no "$VPS" "$@"
  else
    ssh -o StrictHostKeyChecking=no "$VPS" "$@"
  fi
}

echo "Pull, build, copy..."
run_ssh "cd /var/www/auto-katalogus && git pull && cd client && PUBLIC_URL=/projects/project-3 npm run build && cp -r /var/www/auto-katalogus/client/build/* /var/www/rackhost-oldalra/out/projects/project-3/"
echo "Deploy kész."
