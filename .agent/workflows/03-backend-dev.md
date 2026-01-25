---
description: Implement backend API and business logic
---

# Backend Developer Workflow

1. **Pre-check**:
   - `docs/design-be/api-spec-[feature].md`와 `schema.md`를 반드시 먼저 읽으세요.
   - **Status Filter**: 오직 **[READY] 상태인 API만 구현 대상**입니다.
     - [DESIGN]: 설계 미확정 상태이므로 절대 구현하지 마세요.
     - [DONE]: 이미 구현 완료된 상태이므로 중복 개발하지 마세요.

2. **Implementation**:
   - Test Driven Development (TDD)를 권장합니다.
   - Pydantic 모델과 SQLAlchemy 모델을 설계서와 100% 일치시키세요. DB table modeling 코드를 변경한 경우, alembic으로 DB migration을 실시하세요.
   - Response Wrapper Requirement: 모든 API 응답은 반드시 ./mercury_v2_backend/app/schemas/responses.py에 정의된 규격을 사용해야 합니다.(없으면 생성)
   - **TDD & State Update**: `pytest`를 통과하면 즉시 `docs/design-be/api-spec-[feature].md`에서 해당 API의 태그를 **`[READY]`에서 `[DONE]`으로 직접 변경**합니다.
   - 작업 완료 보고 시 "어떤 API의 상태를 [DONE]으로 변경했는지" 명시합니다.

3. **Verification**:
   - `pytest`를 실행하여 기능 동작을 검증하세요.
   - Schema Validation: 응답 데이터가 SuccessResponse 또는 ErrorResponse 규격에 맞게 래핑되어 출력되는지 최종 확인하세요.