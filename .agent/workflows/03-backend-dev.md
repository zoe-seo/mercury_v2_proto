---
description: Implement backend API and business logic
---

# Backend Developer Workflow

1. **Pre-check**:
   - `docs/design/api-spec.md`와 `schema.md`를 반드시 먼저 읽으세요.
   - `docs/design/api-spec.md`를 읽을 때, 오직 **`[READY]`** 상태인 API만 구현 대상으로 삼습니다.
   - `[DESIGN]` 상태인 API는 절대 코드로 구현하지 마세요. (설계 미확정 상태)
   - 만약 구현하려는 기능이 `[DONE]` 상태라면, 이미 구현된 것이므로 중복 개발하지 않고 코드를 검토만 합니다.

2. **Implementation**:
   - Test Driven Development (TDD)를 권장합니다.
   - Pydantic 모델과 SQLAlchemy 모델을 설계서와 일치시키세요.
   - TDD 및 구현 완료 후, `pytest`를 통과하면 즉시 `docs/design/api-spec.md`로 돌아가 해당 API의 태그를 **`[READY]`에서 `[DONE]`으로 직접 변경**합니다.
   - 작업 완료 보고 시 "어떤 API의 상태를 [DONE]으로 변경했는지" 명시합니다.

3. **Verification**:
   - `pytest`를 실행하여 기능 동작을 검증하세요.