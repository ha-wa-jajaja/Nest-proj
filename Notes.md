## Connecting Prisma to Docker created DB:

- .env path must line up with Docker created DB path, in this case:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/{name('nest_proj_db')}"
```
