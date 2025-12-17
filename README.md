# PERN TS DOCKER TEMPLATE

`appname` | PERN Authentication template

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
10. Add Google reCAPTCHA keys: https://cloud.google.com/security/products/recaptcha
    * Frontend: site key
    * Backend: secret key
11. Change default app password and mailing account in backend `.env`.
12. Create new Client and Create Google Sign In keys: https://console.cloud.google.com/
    * Frontend: client ID
    * Frontend: client secret
13. Adjust ports if necessary.
14. Ensure backend has a reCAPTCHA verification endpoint .
15. Update frontend login forms to use the site key for reCAPTCHA.

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
