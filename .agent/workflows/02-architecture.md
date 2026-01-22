---
description: Design system architecture, API specs, and DB schema
---

---
description: 시스템 아키텍처, API 스펙, DB 스키마 설계 및 정합성 검토
---

# Architect Workflow

1. **Integrated Analysis**:
   - `docs/service-summary.md`와 최신 `req-[feature].md`를 읽습니다.
   - **[추가]** 만약 `docs/design/ui-spec-[feature].md`가 있다면, 화면에 필요한 데이터 필드를 추출하여 설계에 반영합니다.

2. **Database Design**:
   - `docs/design/schema.md`를 업데이트합니다.
   - Mermaid ERD를 그리되, 각 테이블의 컬럼이 요구사항 정의서의 어떤 비즈니스 로직과 연결되는지 주석을 답니다.

3. **API Design (Contract First)**:
   - `docs/design/api-spec.md`를 작성합니다.
   - **[추가]** 단순 Endpoint 정의를 넘어, FE/BE 에이전트가 공유할 **'공통 에러 코드'**와 **'응답 규격(Pagination, Wrapper 등)'**을 정의합니다.
   - API 스펙이 확정되면 사용자에게 "이 데이터 구조로 프론트/백엔드 개발을 시작해도 될까요?"라고 최종 확인을 받습니다.