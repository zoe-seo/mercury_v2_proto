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
   - 설계를 구현하기 위해, DB 테이블 스키마에 변경이 필요한지 반드시 검토합니다.
   - 필요하다면 `docs/design/schema.md`를 업데이트합니다.
   - Mermaid ERD를 그리되, 각 테이블의 컬럼이 요구사항 정의서의 어떤 비즈니스 로직과 연결되는지 주석을 답니다.

3. **API Design (Status-Driven)**:
   - `docs/design/api-spec.md`를 작성합니다. 단순 Endpoint 정의를 넘어, FE/BE 에이전트가 공유할 **'공통 에러 코드'**와 **'응답 규격(Pagination, Wrapper 등)'**을 정의합니다.
   - `docs/design/api-spec.md`를 업데이트할 때, 신규 API는 반드시 제목에 **`[DESIGN]`** 태그를 붙입니다. (예: `## [DESIGN] POST /items`)
   - **[변경사항 기록]**: 문서 최상단에 `## Recent Changes` 섹션을 만들어, 이번 회차에 추가/수정된 API 리스트를 기록합니다.
   - API 스펙에 대해 사용자의 최종 확인을 받으면, 해당 태그를 **`[READY]`**로 변경합니다.
   - **[핵심 지시]**: Backend Developer가 작업 중인 `[DONE]` 상태의 API를 수정해야 할 경우, 즉시 `[DESIGN]`으로 상태를 되돌리고 변경 사유를 기술합니다.
   - API 스펙이 확정되면 사용자에게 "이 데이터 구조로 프론트/백엔드 개발을 시작해도 될까요?"라고 최종 확인을 받습니다.