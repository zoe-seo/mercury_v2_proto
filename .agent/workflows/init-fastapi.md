---
description: Initialize a production-ready FastAPI project with uv
---

# Initialize FastAPI Project with uv

This workflow creates a minimal yet production-ready FastAPI project skeleton with PostgreSQL, async SQLAlchemy, and Alembic migrations.

## Prerequisites

- Python 3.11+
- uv installed (`pip install uv`)
- Docker and Docker Compose (for local PostgreSQL)

## Architectural Notes

- Database session lifecycle is managed by FastAPI dependencies
- Transaction boundaries (commit/rollback) are handled explicitly in the service layer
- The service layer is implemented as stateless async functions for simplicity and testability
- Repository abstraction is intentionally omitted; SQLAlchemy sessions are used directly

## Workflow Steps

### 1. Navigate to target directory and initialize uv project

```bash
cd <target_directory>
```

// turbo
```bash
uv init --no-readme
```

### 2. Add all dependencies

// turbo
```bash
uv add fastapi uvicorn[standard] pydantic-settings python-dotenv sqlalchemy[asyncio] asyncpg alembic python-jose[cryptography] passlib[bcrypt] python-multipart
```

// turbo
```bash
uv add --dev pytest pytest-asyncio httpx black ruff
```

### 3. Create directory structure

// turbo
```bash
mkdir -p app/core app/routers/v1 app/services app/models app/schemas app/deps app/utils alembic/versions tests/unit
```

### 4. Create core configuration files

Create `app/core/config.py` - Application settings with environment variable support.

Create `app/core/database.py` - Async SQLAlchemy engine and base model (infrastructure only, no get_db dependency).

Create `app/core/logging.py` - Structured logging configuration.

Create `app/core/exceptions.py` - Custom HTTP exceptions.

Create `app/core/middleware.py` - CORS and other middleware setup.

Create `app/core/lifespan.py` - Application startup/shutdown events.

### 5. Create database dependency

Create `app/deps/db.py` - FastAPI dependency that yields database sessions. Sessions are NOT auto-committed; service layer handles transactions explicitly.

### 6. Create example model, schema, and service

Create `app/models/example.py` - SQLAlchemy model example.

Create `app/schemas/example.py` - Pydantic schemas for request/response.

Create `app/services/example_service.py` - Business logic as plain async functions (no classes, no @staticmethod). Each function explicitly commits transactions when required.

### 7. Create routers

Create `app/routers/health.py` - Health check endpoint.

Create `app/routers/v1/example.py` - Example CRUD endpoints calling service functions.

Create `app/routers/v1/__init__.py` - V1 router aggregation.

Create `app/routers/__init__.py` - Router package init.

### 8. Create main application

Create `app/main.py` - FastAPI app with middleware, lifespan, and router registration.

Create `app/cli.py` - CLI entry points for `dev` and `start` commands.

### 9. Create utilities

Create `app/utils/time.py` - Utility functions (e.g., `utc_now()`).

### 10. Create environment and Docker Compose files

Create `.env` - Environment variables for local development.

Create `docker-compose.dev.yml` - PostgreSQL container for local development.

### 11. Initialize and configure Alembic

// turbo
```bash
uv run alembic init alembic
```

Update `alembic/env.py`:
- Import settings and set `sqlalchemy.url` from config
- Import Base from `app.core.database`
- Add clear comment about model imports:
  ```python
  # Import all models so Alembic can discover metadata
  # Add new model imports here as your project grows
  from app.models import example  # noqa
  ```
- Configure async migrations with `run_async_migrations()`

### 12. Update pyproject.toml

Add CLI scripts:
```toml
[project.scripts]
dev = "app.cli:dev"
start = "app.cli:start"
```

### 13. Create test configuration

Create `tests/__init__.py` - Tests package.

Create `pytest.ini` - Pytest configuration with `asyncio_mode = auto`.

Create tests/unit/test_example.py - Basic endpoint-level tests using FastAPI TestClient (lightweight integration-style tests).

### 14. Create README with architectural notes

Create `README.md` with:
- Project overview and features
- Setup instructions
- Development commands
- **Architectural Notes section** explaining:
  - Session management via dependencies
  - Explicit transaction handling in services
  - Functional service layer design
  - No repository abstraction
- Project structure explanation
- Common commands reference

### 15. Create .gitignore

Create `.gitignore` with Python, virtual env, IDE, and environment file exclusions.

### 16. Start PostgreSQL and run migrations

// turbo
```bash
docker-compose -f docker-compose.dev.yml up -d
```

// turbo
```bash
uv run alembic revision --autogenerate -m "Initial migration"
```

// turbo
```bash
uv run alembic upgrade head
```

### 17. Run tests

// turbo
```bash
uv run pytest
```

### 18. Start development server

```bash
uv run dev
```

Server will be available at:
- API: http://localhost:8000
- Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Next Steps

1. Review and customize `app/core/config.py` for your needs
2. Add your models in `app/models/`
3. Create corresponding schemas in `app/schemas/`
4. Implement business logic in `app/services/` (plain async functions)
5. Add API endpoints in `app/routers/v1/`
6. Write tests in `tests/`

## Key Files to Customize

- `app/core/config.py` - Application settings
- `app/core/middleware.py` - CORS origins and other middleware
- `.env` - Database URL, secrets, and environment variables
- `alembic/env.py` - Add new model imports as you create them

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