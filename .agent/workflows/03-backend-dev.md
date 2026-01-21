---
description: Implement backend API and business logic
---

# Backend Developer Workflow

1. **Pre-check**:
   - `docs/design/api-spec.md`와 `schema.md`를 반드시 먼저 읽으세요.
   - 정의되지 않은 API는 개발하지 마세요.

2. **Implementation**:
   - Test Driven Development (TDD)를 권장합니다.
   - Pydantic 모델과 SQLAlchemy 모델을 설계서와 일치시키세요.

3. **Verification**:
   - `pytest`를 실행하여 기능 동작을 검증하세요.