---
description: Deriving user needs for screen design or UI/UX design
---

# UI/UX Designer Workflow

1. **Global Layout & Context Check**:
   - 작업을 시작하기 전 `docs/service-summary.md`를 읽고 서비스의 전체 구조를 파악합니다.
   - **[중요]** 만약 `docs/design/layout-template.md`가 없다면, 먼저 전체 서비스의 공통 레이아웃(예: Header 위치, Sidebar 유무, Content 영역 넓이 등)을 텍스트로 제안하고 사용자로부터 확정받으세요.
   - 확정된 공통 구조는 `docs/design/layout-template.md`에 기록하여 모든 페이지의 기본 지침으로 삼습니다.

2. **Structural Analysis (Text-first)**:
   - `docs/requirements/req-[feature].md`의 내용을 바탕으로 해당 기능이 **글로벌 레이아웃의 어느 부분에 위치할지** 정의합니다.
   - 화면에 들어갈 핵심 컴포넌트(입력창, 버튼, 리스트, 차트 등)를 텍스트로 나열하고, 배치를 설명합니다.
     * 예: "사이드바에서 'A 메뉴' 클릭 시, 메인 영역 상단에는 '통계 요약 카드'가 3개 배치되고 하단에는 '상세 내역 테이블'이 나타납니다."
   - 사용자가 이 구조(Layout)에 동의할 때까지 텍스트로만 소통합니다.

3. **UI/UX Strategy & Theme**:
   - 디자인 시스템(주요 색상, 보조 색상, 폰트 스타일, 아이콘 컨셉 등)을 정의합니다.
   - "모던한 다크 모드", "깔끔한 화이트톤의 기업용 대시보드", "아기자기한 픽셀 아트" 등 구체적인 스타일 키워드를 사용자에게 제안하고 합의를 얻습니다.

4. **Visual Prototyping (High-Cost Tool Usage)**:
   - **[주의]** 1~3단계의 모든 사항이 텍스트로 합의된 경우에만 `generate_image` 툴을 1회 호출합니다.
   - 프롬프트에는 앞서 합의된 **구조(Layout)**와 **스타일(Strategy)** 정보를 상세히 포함하여 사용자가 상상한 모습에 가장 가깝게 생성합니다.
   - 생성된 이미지를 보여주고, 실제 구현 시 참고할 '톤앤매너'로 최종 승인을 받습니다.

5. **Drafting UI Spec**:
   - 최종 승인된 내용을 `docs/design-fe/ui-spec-[feature].md`에 기록합니다.
   - 구성 요소:
     - **Layout Ref**: 사용된 레이아웃 템플릿 정보
     - **Component Tree**: 화면을 구성하는 컴포넌트 계층 구조
     - **State & Interaction**: 버튼 클릭 시 전환, 데이터 로딩 중 UI, 에러 발생 시 UI 정책
     - **Visual Assets**: 확정된 시안 이미지 경로 및 컬러셋(HEX 코드 등)