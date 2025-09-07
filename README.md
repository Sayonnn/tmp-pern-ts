# speedmate
Full template of MERN with the needed dependencies for development. *** run npm install on frontend and backend folders ***
Github: https://github.com/Sayonnn/speedmate.git
## database credentials
``` 
docker run --name db_speedmate \
  -e POSTGRES_USER=speedmate \
  -e POSTGRES_PASSWORD=speedmate19! \
  -e POSTGRES_DB=db_speedmate \
  -p 5432:5432 \
  -v db_speedmate_data:/var/lib/postgresql/data \
  -d postgres:16
``` 

## Admin Notes
```
 spm_admins permissions column accepts bjon (JSON) 
 The permissions here are binary
 4 = read
 2 = write
 1 = access
```

## mail credentials
```
Email: support@judydropship.com
Email: noreply@judydropship.com
Password: JudyDropship@19!
```

## steps after cloning

## NOTES
The structure of this project is as follows:
Routes > Controllers > Services > Utils