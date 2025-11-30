# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads)
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) (v22.14.0 or newer) which already bundles npm

## Installation

```bash
git clone {repository URL}
cd nodejs2025Q2-service
npm install
cp .env.example .env
```

## Running application

```bash
npm start
```

The server listens on the port specified by `PORT` inside `.env` (default `4000`).

Once the service is running you can interact with it using any REST client:

| Method | Endpoint            | Description                       |
|--------|---------------------|-----------------------------------|
| GET    | `/user`             | List users                        |
| POST   | `/user`             | Create user                       |
| PUT    | `/user/{id}`        | Update user password              |
| DELETE | `/user/{id}`        | Delete user                       |
| GET    | `/artist`           | List artists                      |
| GET    | `/album`            | List albums                       |
| GET    | `/track`            | List tracks                       |
| GET    | `/favs`             | List favorites                    |
| POST   | `/favs/{type}/{id}` | Add entity to favorites           |
| DELETE | `/favs/{type}/{id}` | Remove entity from favorites      |

See `doc/api.yaml` for the complete OpenAPI contract (import it into Swagger UI or Insomnia/ Postman to explore all operations).

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```bash
npm run lint
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
