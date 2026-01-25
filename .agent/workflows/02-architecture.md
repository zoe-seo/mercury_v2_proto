---
description: Design system architecture, API specs, and DB schema
---

# Architect Workflow

1. **Integrated Analysis**:
   - `docs/service-summary.md`와 최신 `req-[feature].md`를 읽습니다.
   - **[UI Feedback Loop]**: `docs/gap-report/api-requests.md` 파일이 있는지 확인하십시오. UI가 화면 구현 중 요청한 신규 필드나 API가 있다면 이를 최우선적으로 검토하여 설계에 반영합니다.
   - 만약 `docs/design-fe/ui-spec-[feature].md`가 있다면, 화면에 필요한 데이터 필드를 추출하여 설계에 반영합니다.

2. **Database Design**:
   - 설계를 구현하기 위해, DB 테이블 스키마에 변경이 필요한지 반드시 검토합니다.
   - 필요하다면 `docs/design-be/schema.md`를 업데이트합니다.
   - Mermaid ERD를 그리되, 각 테이블의 컬럼이 요구사항 정의서의 어떤 비즈니스 로직과 연결되는지 주석을 답니다.

3. **API Design (Status-Driven)**:
   - `docs/design-be/api-spec-[feature].md`를 작성합니다. **'공통 에러 코드'**와 **'응답 규격(Pagination, Wrapper 등)'**도 포함하는 문서입니다.
   - - **[Logic Specification]**: 단순 CRUD가 아닌 복잡한 비즈니스 로직(예: AI 모델 호출, 비동기 작업, 복잡한 상태 전이 등)이 포함된 API는 명세 하단에 **'Processing Logic'** 또는 **'Note'** 섹션을 추가하여 내부 동작 흐름과 사용할 기술을 명시합니다.
   - `docs/design-be/api-spec-[feature].md`를 작성/업데이트하며 아래 3개 상태 태그만 사용합니다.
     - `[DESIGN]`: 설계 중인 상태 (BE 개발 금지).
     - `[READY]`: 사용자 승인 완료 (BE 개발 가능).
     - `[DONE]`: BE 개발 및 테스트 완료.
   - **[핵심 지시]**: `[DONE]` 상태의 API를 수정해야 할 경우, 즉시 `[DESIGN]`으로 상태를 되돌리고 변경 사유를 기술합니다.
   - [Cleanup]: api-requests.md의 요청 사항을 api-spec-[feature].md에 모두 반영했다면, docs/gap-report/api-requests.md 파일을 즉시 삭제합니다(사용자에게 confirm 필요).

4. **Docs Update**:
   - 주요 아키텍처 결정 사항이 생기거나 변경될 경우, `docs/design/architecture-decisions.md`를 최신화하세요
     - 단순 변경은 작성하지마세요
     - 무거운 작업 분리나 복잡한 상태 전이 등 큰 아키텍처 단위의 결정사항에 대해 작성해주세요
     - 특별한 사항이 없으면 검토 후 `**날짜**`만 업데이트합니다.