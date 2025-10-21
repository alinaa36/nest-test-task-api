# Nest Test Task API

## How to run the application

### Install dependencies
```bash
npm install

```
2. Run the application

```bash
npm run start:all
```

### Step-by-step launch
1. Start the database
```bash
docker-compose up -d
```

2. Apply migrations
```bash
npm run db:migrate
```

3. Start the application
```bash
npm run start:dev
```


OpenAPI documentation
The OpenAPI documentation is available at:

http://localhost:Port/api/docs