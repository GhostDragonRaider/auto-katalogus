# Deploy scriptok

## Egyszeri beállítás (jelszó nélküli SSH)

1. Telepítsd az sshpass-t: `sudo apt install sshpass`
2. Futtasd egyszer (a jelszóval):  
   `SSHPASS='a_jelszavad' ./scripts/ssh-setup.sh`
3. Utána minden SSH kapcsolat jelszó nélkül működik.

## Deploy futtatása

```bash
./scripts/deploy.sh
```

Ha még nincs beállítva a kulcs, használd jelszóval:
```bash
SSHPASS='a_jelszavad' ./scripts/deploy.sh
```
