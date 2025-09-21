# Sayon PH 🇵🇭 | PERN TS DOCKER TEMPLATE

`appname` 🇵🇭 | Professional and extraordinary web portfolio

📂 **GitHub Repo:** [appname](https://github.com/yourusername/appname.git)

---

## 📧 Mail Credentials

```txt
Email: support@appname.com
Email: noreply@appname.com
Password: Appname19!
```

---

## 🔑 System Default Credentials

```txt
admin: admin | appname19!
client: appname | appname19!
```

---

## 🔄 Reusing the Project

1. Replace all occurrences of `appname` with your project name.
2. Update database name in:
   * `scripts/create_tables.sh` (`APP_NAME` | `DB_ABBR`)
   * `scripts/refresh_seed.sh` (`APP_NAME` | `DB_ABBR`)
3. Update backend `.env`
4. Update frontend `.env`
5. Update Dockerfiles if needed.
6. Update frontend `api.service.ts` if needed.
7. Update `docker-compose.yml` if needed.
8. Update `.github/workflows/main.yml` if needed.
9. Update frontend `nginx.conf` if using custom config.
10. Adjust ports if necessary.

```bash
# Start Docker
docker compose up --build
# If tables don't exist after building
./scripts/create_tables.sh
# try if there is an issue after docker
cd frontend && npm i 
cd backend && npm i
```

---

### Before Final Committing

```bash
./scripts/export_db.sh
cp .env .env.copy ( frontend | backend )
```

---

## 📝 Notes

1. No 2FA yet (TOTP).
2. No forgot password feature.
3. Registration UI is not implemented.
4. Reset password UI is not implemented.
5. 2FA UI is not implemented.

---
