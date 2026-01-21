# Mercury V2 Backend

A production-ready FastAPI application with PostgreSQL, async SQLAlchemy, and Alembic migrations.

## Features

- ✅ FastAPI with async/await
- ✅ PostgreSQL with async SQLAlchemy
- ✅ Alembic migrations
- ✅ Pydantic settings management
- ✅ CORS middleware
- ✅ Structured logging
- ✅ Service layer architecture (functional async functions)
- ✅ Docker Compose for local development
- ✅ pytest with async support

## Architectural Notes

- **Database session lifecycle** is managed by FastAPI dependencies
- **Transaction boundaries** (commit/rollback) are handled explicitly in the service layer
- **Service layer** is implemented as stateless async functions for simplicity and testability
- **Repository abstraction** is intentionally omitted; SQLAlchemy sessions are used directly

## Setup

### 1. Install dependencies

```bash
uv sync
```

### 2. Start PostgreSQL

```bash
docker-compose -f docker-compose.dev.yml up -d
```

### 3. Run migrations

```bash
uv run alembic upgrade head
```

### 4. Start development server

```bash
uv run dev
```

The API will be available at http://localhost:8000

- API docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Development

### Create a new migration

```bash
uv run alembic revision --autogenerate -m "description"
```

### Run migrations

```bash
uv run alembic upgrade head
```

### Run tests

```bash
uv run pytest
```

### Format code

```bash
uv run black .
uv run ruff check --fix .
```

## Production

```bash
uv run start
```

## Project Structure

```
app/
├── main.py                 # FastAPI app
├── cli.py                  # CLI entry points
├── core/                   # Global configuration
│   ├── config.py           # Settings
│   ├── database.py         # SQLAlchemy engine
│   ├── logging.py          # Logging setup
│   ├── exceptions.py       # Custom exceptions
│   ├── middleware.py       # CORS and middleware
│   └── lifespan.py         # Startup/shutdown
├── routers/                # API endpoints
│   ├── health.py           # Health check
│   └── v1/                 # API v1
│       └── example.py      # Example CRUD
├── services/               # Business logic (async functions)
│   └── example_service.py
├── models/                 # SQLAlchemy models
│   └── example.py
├── schemas/                # Pydantic schemas
│   └── example.py
├── deps/                   # FastAPI dependencies
│   └── db.py               # Database session
└── utils/                  # Utilities
    └── time.py
```

## Common Commands

```bash
# Development
uv run dev                                    # Start dev server
uv run pytest                                 # Run tests
uv run black .                                # Format code
uv run ruff check --fix .                     # Lint and fix

# Database
docker-compose -f docker-compose.dev.yml up -d     # Start PostgreSQL
uv run alembic revision --autogenerate -m "msg"    # Create migration
uv run alembic upgrade head                        # Apply migrations
uv run alembic downgrade -1                        # Rollback one migration

# Production
uv run start                                  # Start production server
```
