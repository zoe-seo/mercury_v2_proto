---
description: Implement frontend UI and integrate APIs
---

# UI/Publishing Agent Workflow

1. **Visual Context Analysis**:
   - `docs/design-system.md`와 `ui-spec-[feature].md`를 분석합니다.
   - 시안 이미지의 톤앤매너(색상, 간격, 폰트)를 완벽히 재현하는 데 집중합니다.

2. **Mock-up Component Implementation**:
   - **[Data Strategy]**: 
     - 실제 API 호출 대신 `src/types/api/[feature].ts`(인터페이스)와 `src/mocks/data/[feature].ts`(데이터)를 생성하여 사용합니다.
     - **API Schema Alignment**: 'api-spec.md'의 명세를 100% 준수하세요. 임의의 필드 생성을 엄격히 금지합니다.
   
   - **[Component Modularity & Structure]**:
     - **Directory Rules**: 단일 파일이 거대해지지 않도록 다음 구조를 엄수하세요.
       * `src/pages/`: 페이지 단위의 진입점 컴포넌트를 배치합니다.
       * `src/components/[PageName]/`: 해당 페이지에서만 사용하는 하위 컴포넌트들을 이 디렉터리 내에 분리하여 관리합니다.
       * `src/components/common/`: 여러 페이지에서 공통으로 재사용되는 UI 요소를 배치합니다.
     - **Interface-Driven**: 데이터를 Props로 전달받는 구조를 설계하여 API 연동을 담당하는 개발 에이전트의 연동 편의성을 극대화합니다.

   - **[State & Convention]**:
     - **Stateful UI**: 로딩, 데이터 없음, 에러 상태를 시각적으로 미리 구현합니다.
     - **Type Safety**: 타입 import 시 반드시 `import type { ... }` 구문을 사용하고, Tailwind 클래스 적용 시 가시성(Contrast)을 확보하세요.

3. **Handover Preparation**:
   - 구현된 컴포넌트가 `layout-template.md`의 Slot에 맞게 동작하는지 확인합니다.
   - 구현된 UX가 전체 서비스 흐름을 방해하지 않는지 확인하고 사용자에게 최종 결과물을 브리핑합니다.