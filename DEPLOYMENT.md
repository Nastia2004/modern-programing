# Deployment: Render + Docker + GitHub Actions

This repository is prepared for deployment to Render as Docker containers.

## Services

- `lab2-backend` - Fastify REST API.
- `lab3-frontend` - React frontend served by Nginx.

## Files

- `render.yaml` - Render Blueprint.
- `lab2/Dockerfile` - backend Docker image.
- `lab3/Dockerfile` - frontend Docker image.
- `.github/workflows/ci-cd.yml` - GitHub Actions CI/CD pipeline.

## Render Setup

1. Push this repository to GitHub.
2. Open Render Dashboard.
3. Click `New` -> `Blueprint`.
4. Connect the GitHub repository.
5. Use the default Blueprint path:

```text
render.yaml
```

6. Deploy the Blueprint.
7. After Render creates the services, check the generated backend URL.
8. If Render changed the backend hostname because of a name collision, update the frontend service environment variable:

```text
API_URL=https://your-real-backend-service.onrender.com
```

The default value in `render.yaml` is:

```text
https://lab2-backend.onrender.com
```

## CI/CD

GitHub Actions pipeline:

1. Installs dependencies.
2. Runs backend syntax checks, unit tests, integration tests and coverage.
3. Runs frontend unit tests, coverage and production build.
4. Starts local backend and frontend.
5. Runs Playwright scraping scenario.
6. Builds both Docker images.
7. Triggers Render deploy hooks if GitHub Secrets are configured.

Render is also configured with:

```text
autoDeployTrigger: checksPass
```

This means Render can automatically deploy after GitHub checks pass.

## Optional Render Deploy Hooks

If you prefer GitHub Actions to explicitly trigger deployments, create deploy hooks in Render and add these GitHub repository secrets:

```text
RENDER_DEPLOY_HOOK_BACKEND
RENDER_DEPLOY_HOOK_FRONTEND
```

The `deploy` job will call them after tests and Docker builds pass on `main` or `master`.

## Local Docker Commands

Build backend:

```bash
docker build -t lab2-backend ./lab2
```

Run backend:

```bash
docker run --rm -p 3000:3000 -e PORT=3000 lab2-backend
```

Build frontend:

```bash
docker build -t lab3-frontend ./lab3
```

Run frontend:

```bash
docker run --rm -p 8080:8080 -e PORT=8080 -e API_URL=http://localhost:3000 lab3-frontend
```

## Deployed URLs

Fill these after Render finishes deployment:

```text
Backend:  https://lab2-backend.onrender.com
Frontend: https://lab3-frontend.onrender.com
Swagger:  https://lab2-backend.onrender.com/docs
```

Demo login:

```text
email: anastasiia@example.com
password: password123
```
