# Lab 3: React API Client

React frontend for the `lab2` Fastify REST API.

## Features

- React SPA built with Vite and plain JavaScript.
- 5 pages:
  - `/login`
  - `/`
  - `/users`
  - `/projects`
  - `/tasks`
- Mock authorization through `POST /auth/login`.
- Token persistence in `localStorage`.
- Protected routes.
- Shared/global state through React Context:
  - auth state;
  - users/projects/tasks data;
  - selected project filter shared between Dashboard and Tasks pages.
- API error handling with visible error messages.
- Basic navigation.
- Frontend CRUD actions for projects and tasks.

## Requirements

Node.js `24.15.0` or newer.

```bash
nvm use
```

## Run

Start the backend first:

```bash
cd ../lab2
nvm use
npm install
npm run dev
```

Then start the frontend:

```bash
cd ../lab3
nvm use
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## Demo Login

```text
email: ostap@example.com
password: password123
```

## API URL

The frontend uses:

```text
http://localhost:3000
```

To change it, create `.env`:

```bash
cp .env.example .env
```

Then update:

```text
VITE_API_URL=http://localhost:3000
```

## Demo Checklist

1. Start `lab2`.
2. Start `lab3`.
3. Log in with the demo account.
4. Show that token is saved in `localStorage`.
5. Navigate between Dashboard, Users, Projects and Tasks.
6. Create a project.
7. Create a task for that project.
8. Toggle or delete a task.
9. Stop `lab2` and refresh `lab3` to show API error handling.

## Testing

Unit tests:

```bash
npm test
```

Coverage report:

```bash
npm run coverage
```

Scraping through Playwright:

```bash
cd ../lab2
npm run dev

cd ../lab3
npm run dev
npm run scrape
```

The scraping scenario logs in, opens the Users page and reads visible user data from the rendered page.

## Deployment

The frontend is prepared for Docker + Render deployment.

Main files:

- `Dockerfile` - builds the React app and serves it through Nginx.
- `docker/entrypoint.sh` - injects runtime `API_URL` and configures Nginx for Render `PORT`.
- `../render.yaml` - Render Blueprint for backend and frontend.
- `../.github/workflows/ci-cd.yml` - GitHub Actions pipeline.
- `../DEPLOYMENT.md` - full deployment guide.