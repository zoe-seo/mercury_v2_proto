---
description: Implement frontend UI and integrate APIs
---

# FE Logic Agent Workflow

1. **Context & Asset Audit**:
   - **Requirement Alignment**: req-[feature].md와 ui-spec-[feature].md를 통해 구현해야 할 비즈니스 로직과 사용자 시나리오를 완벽히 이해합니다.
   - Asset Inspection: UI 에이전트가 이미 구축해 놓은 src/pages/ 및 src/components/[PageName]/ 내의 컴포넌트 구조를 분석합니다.

2. **Integration Pre-check (Status Driven)**:
   - `api-spec-[feature].md`에서 상태가 **`[READY]`** 또는 **`[DONE]`**인 API만 연동 대상으로 삼습니다. `[DESIGN]` 상태인 API는 연동하지 않고 대기합니다.
   - UI 에이전트가 작성한 Mock 컴포넌트 구조를 파악합니다.
     - 파일 위치: src/types/api/[feature].ts (인터페이스) 및 src/mocks/data/[feature].ts (데이터)

3. **API & State Integration**:
   - `Axios`와 `TanStack Query`를 활용해 실제 백엔드 API와 통신하는 로직을 주입합니다.
   - UI 에이전트가 만든 'Empty/Error' UI를 실제 API 응답 상태와 매핑합니다.
   - 전역 상태 관리(Zustand, localStorage 등)가 필요하다면 이 단계에서 구현합니다.

4. **Final Validation**:
   - Data Robustness: 실제 데이터가 흘러 들어왔을 때 레이아웃이 깨지지 않는지 확인합니다.
   - Status Marking: 연동이 완료되면 `api-spec-[feature].md`의 해당 API 섹션에 **`[FE-DONE]`** 표시를 추가합니다.
     - (예: `## [DONE][FE-DONE] GET /items`)
     - 주의: 기존의 `[DONE]`(백엔드 상태) 태그를 절대 삭제하거나 수정하지 마세요.