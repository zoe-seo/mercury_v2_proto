---
description: Implement frontend UI and integrate APIs
---

# FE Logic Agent Workflow

1. **Integration Pre-check (Status Driven)**:
   - `api-spec.md`에서 상태가 **`[READY]`** 또는 **`[DONE]`**인 API만 연동 대상으로 삼습니다. `[DESIGN]` 상태인 API는 연동하지 않고 대기합니다.
   - UI 에이전트가 작성한 Mock 컴포넌트 구조를 파악합니다.
     - 파일 위치: src/types/api/[feature].ts (인터페이스) 및 src/mocks/data/[feature].ts (데이터)

2. **API & State Integration**:
   - `Axios`와 `TanStack Query`를 활용해 실제 백엔드 API와 통신하는 로직을 주입합니다.
   - UI 에이전트가 만든 'Empty/Error' UI를 실제 API 응답 상태와 매핑합니다.
   - 전역 상태 관리(Zustand, localStorage 등)가 필요하다면 이 단계에서 구현합니다.

3. **Final Validation**:
   - 실제 데이터가 흘러 들어왔을 때 레이아웃이 깨지지 않는지 확인합니다.
   - API 연동이 완료되면 `api-spec.md`의 해당 API 섹션에 **`[FE-INTEGRATED]`** 등의 표식을 추가하여 작업 완료를 명시합니다.