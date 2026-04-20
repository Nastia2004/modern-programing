# Lab 2: Fastify REST API

REST API для лабораторної роботи. Проєкт зроблений на чистому JavaScript з Fastify, без бази даних. Дані зберігаються в пам'яті застосунку, тому після перезапуску сервера повертаються початкові моки.

## Сутності та зв'язки

- `users` - користувачі системи.
- `projects` - проєкти, кожен проєкт має `ownerId` і належить одному користувачу.
- `tasks` - задачі, кожна задача має `projectId` і належить одному проєкту.

Вкладені зв'язки присутні у відповідях:

- `GET /users/:id` повертає користувача з його `projects`, а кожен проєкт містить `tasks`.
- `GET /projects/:id` повертає проєкт з `owner` та `tasks`.
- `GET /tasks/:id` повертає задачу з короткою інформацією про `project` та `owner`.

## Запуск

Потрібна версія Node.js `24.15.0` або новіша. Якщо користуєшся `nvm`:

```bash
nvm use
```

```bash
cd lab2
npm install
npm run dev
```

Сервер буде доступний за адресою:

```text
http://localhost:3000
```

Інтерактивна Swagger документація доступна тут:

```text
http://localhost:3000/docs
```

## Тестування

Unit та інтеграційні тести:

```bash
npm test
```

Звіт про покриття коду:

```bash
npm run coverage
```

HTML-звіт буде збережено в `coverage/index.html`.

Performance-тестування одного endpoint зі складним сценарієм:

```bash
npm run dev
npm run perf
```

Сценарій `npm run perf`:

1. виконує `POST /auth/login`;
2. використовує отриманий `user.id` для `POST /projects`;
3. використовує отриманий `project.id` для `POST /tasks`;
4. навантажує `GET /projects/:projectId/tasks`;
5. видаляє створений проєкт.

## Deployment

Проєкт підготовлений для Docker + Render deployment.

Основні файли:

- `Dockerfile` - контейнер backend API.
- `../render.yaml` - Render Blueprint для backend і frontend.
- `../.github/workflows/ci-cd.yml` - GitHub Actions pipeline.
- `../DEPLOYMENT.md` - повна інструкція розгортання.

## HTTP-коди

- `200 OK` - успішне отримання або оновлення.
- `201 Created` - успішне створення.
- `204 No Content` - успішне видалення.
- `400 Bad Request` - не передані обов'язкові поля.
- `404 Not Found` - сутність не знайдена.
- `409 Conflict` - конфлікт даних, наприклад email вже існує.

## Пагінація, сортування, фільтрація

Для списків доступні query-параметри:

- `page` - номер сторінки, за замовчуванням `1`.
- `limit` - кількість елементів на сторінці, за замовчуванням `10`, максимум `100`.
- `sortBy` - поле для сортування, наприклад `id`, `name`, `title`, `createdAt`.
- `order` - напрям сортування: `asc` або `desc`.
- `search` - пошук за текстовими полями.

Додаткові фільтри:

- `GET /users?role=student`
- `GET /projects?ownerId=1&status=active`
- `GET /tasks?projectId=1&status=todo&priority=high`

Приклад відповіді списку:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 1
  }
}
```

## Endpoints

### Auth

Для фронтенду з `lab3` додана мокова авторизація.

Демо-акаунт:

```text
email: ostap@example.com
password: password123
```

#### POST `/auth/login`

Увійти та отримати токен.

```bash
curl -X POST "http://localhost:3000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"ostap@example.com","password":"password123"}'
```

#### GET `/auth/me`

Отримати поточного користувача за Bearer token.

```bash
curl "http://localhost:3000/auth/me" \
  -H "Authorization: Bearer <token>"
```

### Users

#### GET `/users`

Отримати список користувачів.

Приклад:

```bash
curl "http://localhost:3000/users?page=1&limit=2&sortBy=name&order=asc&role=student"
```

#### GET `/users/:id`

Отримати одного користувача з вкладеними проєктами та задачами.

```bash
curl "http://localhost:3000/users/1"
```

#### POST `/users`

Створити користувача.

```bash
curl -X POST "http://localhost:3000/users" \
  -H "Content-Type: application/json" \
  -d '{"name":"New User","email":"new@example.com","role":"student"}'
```

#### PUT `/users/:id`

Оновити користувача.

```bash
curl -X PUT "http://localhost:3000/users/1" \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated User","email":"updated@example.com","role":"mentor"}'
```

#### DELETE `/users/:id`

Видалити користувача. Разом з ним видаляються його проєкти та задачі цих проєктів.

```bash
curl -X DELETE "http://localhost:3000/users/1"
```

### Projects

#### GET `/projects`

Отримати список проєктів.

```bash
curl "http://localhost:3000/projects?ownerId=1&status=active&sortBy=createdAt&order=desc"
```

#### GET `/projects/:id`

Отримати один проєкт з власником та задачами.

```bash
curl "http://localhost:3000/projects/1"
```

#### POST `/projects`

Створити проєкт.

```bash
curl -X POST "http://localhost:3000/projects" \
  -H "Content-Type: application/json" \
  -d '{"ownerId":1,"title":"New Project","description":"Demo project","status":"draft"}'
```

#### PUT `/projects/:id`

Оновити проєкт.

```bash
curl -X PUT "http://localhost:3000/projects/1" \
  -H "Content-Type: application/json" \
  -d '{"ownerId":1,"title":"Updated Project","description":"Updated description","status":"active"}'
```

#### DELETE `/projects/:id`

Видалити проєкт. Разом з ним видаляються його задачі.

```bash
curl -X DELETE "http://localhost:3000/projects/1"
```

### Tasks

#### GET `/tasks`

Отримати список задач.

```bash
curl "http://localhost:3000/tasks?projectId=1&priority=high&status=in_progress"
```

#### GET `/tasks/:id`

Отримати одну задачу з інформацією про проєкт та власника.

```bash
curl "http://localhost:3000/tasks/1"
```

#### GET `/projects/:projectId/tasks`

Отримати вкладений список задач конкретного проєкту.

```bash
curl "http://localhost:3000/projects/1/tasks?page=1&limit=5"
```

#### POST `/tasks`

Створити задачу.

```bash
curl -X POST "http://localhost:3000/tasks" \
  -H "Content-Type: application/json" \
  -d '{"projectId":1,"title":"Write README","status":"todo","priority":"medium","dueDate":"2026-04-25"}'
```

#### POST `/projects/:projectId/tasks`

Створити задачу всередині конкретного проєкту.

```bash
curl -X POST "http://localhost:3000/projects/1/tasks" \
  -H "Content-Type: application/json" \
  -d '{"title":"Nested task","status":"todo","priority":"low","dueDate":"2026-04-30"}'
```

#### PUT `/tasks/:id`

Оновити задачу.

```bash
curl -X PUT "http://localhost:3000/tasks/1" \
  -H "Content-Type: application/json" \
  -d '{"projectId":1,"title":"Updated Task","status":"done","priority":"high","dueDate":"2026-04-26"}'
```

#### DELETE `/tasks/:id`

Видалити задачу.

```bash
curl -X DELETE "http://localhost:3000/tasks/1"
```

## Демонстрація

1. Запустити сервер командою `npm run dev`.
2. Відкрити інтерактивний Swagger UI: `http://localhost:3000/docs`.
3. Показати CRUD:
   - створення через `POST`;
   - отримання через `GET`;
   - оновлення через `PUT`;
   - видалення через `DELETE`.
4. Показати пагінацію, сортування та фільтрацію на списках.
