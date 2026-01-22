---
description: Implement frontend UI and integrate APIs
---

# Frontend Developer Workflow

1. **Environmental & Design Context Check**:
   - `docs/service-summary.md`와 `docs/design/layout-template.md`를 먼저 읽어 서비스의 전체 뼈대(Header, Sidebar 등)를 파악합니다.
   - `docs/design/ui-spec-[feature].md`(화면 설계)와 `api-spec.md`(데이터 설계)를 분석하여 불일치 사항이 있는지 검토합니다.
   - **[체크리스트]**:
     * 화면에 필요한 데이터가 API 스펙에 포함되어 있는가?
     * 이 기능이 레이아웃의 특정 'Slot'(예: Main Content 영역)에 정상적으로 삽입될 수 있는 구조인가?
     * 불일치 발견 시 즉시 Architect나 Designer 에이전트에게 수정을 요청하세요.

2. **Component Implementation (Layout-First)**:
   - 만약 공통 레이아웃(`layout-template.md`)이 아직 코드로 구현되지 않았다면, 이를 먼저 구현하거나 공통 Layout Wrapper를 생성합니다.
   - UI 스펙에 정의된 개별 컴포넌트를 개발하며, 승인된 시안 이미지의 톤앤매너(색상, 폰트, 간격 등)를 CSS/Tailwind로 정밀하게 재현합니다.

3. **API Integration & State Management**:
   - **Mock-up Phase**: 초기에는 Mock Data를 사용하여 UI 레이아웃과 반응형 동작을 먼저 완성합니다.
   - **Integration Phase**: 실제 API와 연동하며 데이터 로딩(Loading), 데이터 없음(Empty), 에러(Error) 상태의 UI 처리가 디자인 명세와 일치하는지 확인합니다.

4. **Final Verification**:
   - 구현된 화면이 `layout-template.md`에서 정의한 전체 서비스 흐름을 방해하지 않는지 확인하고 사용자에게 최종 결과물을 브리핑합니다.