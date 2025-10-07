# Sayon PH 🇵🇭 | PERN TS DOCKER TEMPLATE

`appname` 🇵🇭 | Professional and extraordinary web portfolio

📂 **GitHub Repo:** [appname](https://github.com/Sayonnn/tmp-pern-ts.git)

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
2. Update database name in scripts (`create_tables.sh` and `refresh_seed.sh`).
3. Update backend `.env` file.
4. Update frontend `.env` file.
5. Update Dockerfiles if needed.
6. Update frontend `api.service.ts` if needed.
7. Update `docker-compose.yml` if needed.
8. Update GitHub workflows if needed.
9. Update frontend `nginx.conf` if using a custom config.
10. Add Google reCAPTCHA keys:

    * Frontend: site key
    * Backend: secret key
11. Change default app password and mailing account in backend `.env`.
12. Adjust ports if necessary.
13. Ensure backend has a reCAPTCHA verification endpoint.
14. Update frontend login forms to use the site key for reCAPTCHA.

```bash
# Start Docker
docker compose up --build

# If tables don't exist after building
./scripts/create_tables.sh

# If there are issues
cd frontend && npm install
cd backend && npm install
```

---

### Before Final Commit

* Export the database.
* Make copies of `.env` files for frontend and backend.

---

## 📝 Notes

1. No 2FA yet (TOTP).
2. Forgot password feature not implemented.
3. Registration UI not implemented.
4. Reset password UI not implemented.
5. 2FA UI not implemented.
6. Google reCAPTCHA **must be configured on both frontend and backend** for login forms.

---
