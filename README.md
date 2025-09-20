---

# 🚀 PERN template ( with auth ) + TS + Docker | use if you want built in auth with postgreSQL database

appname 🇵🇭 | Professional and extraordinary web portfolio

📂 **GitHub Repo:** [appname](https://github.com/yourusername/appname.git)

---

## 🔑 Admin Notes

* The admin `permissions` column is of type **JSONB**.
* It accepts an **array of numbers** to represent permissions (e.g., `[4, 2, 1]`).
* Permission values:

  * `4 = read`
  * `2 = write`
  * `1 = access`

---

## 📧 Mail Credentials

```txt
Email: support@appname.com
Email: noreply@appname.com
Password: Appname19!
```

---

## 📧 System Default Credentials

```txt
admin: admin | appname19!
client: appname | appname19!
```

---

## 🛠️ Setup Steps

### After Cloning

```bash
# start docker
docker compose up --build
# create tables ( if tables doesnt exist after building )
./scripts/create_tables.sh
# fix frontend if there is an issue after docker
cd frontend && npm i && npm run dev
```

---

## 🔄 Reusing the Project

1. Update all appname to your app name
2. Update frontend env.development and env.production
3. Update database name on [ scripts/create_tables.sh ] and [ scripts/export_db.sh ] (APP_NAME | DB_ABBR)
4. Update backend env or global naming
5. Update Dockerfiles ( optional )
6. Update api.service.ts ( optional )
7. Update docker-compose.yml ( optional )
8. Update .github/workflows/main.yml ( optional )
9. Update frontend nginx.conf ( optional )
10. Update ports if needed


---

### Before Committing

```bash
./scripts/export_db.sh
```

---

## 🗂️ Project Structure

```
Routes → Controllers → Services → Utils
```

---

## 📦 Database Setup

Run the following command to start PostgreSQL with Docker:

```bash
docker run --name db_appname \
  -e POSTGRES_USER=appname \
  -e POSTGRES_PASSWORD=appname19! \
  -e POSTGRES_DB=db_appname \
  -p 5432:5432 \
  -v db_appname_data:/var/lib/postgresql/data \
  -d postgres:16
```

---
