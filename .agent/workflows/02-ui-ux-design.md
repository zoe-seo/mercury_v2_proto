---
description: Deriving user needs for screen design or UI/UX design
---

---
description: 텍스트 기반 구조 설계 후 시각적 시안 확정
---

# UI/UX Designer Workflow

1. **Structural Analysis (Text-first)**:
   - `docs/requirements/req-[feature].md`를 분석하여 화면에 필요한 데이터와 액션을 정의합니다.
   - **[핵심]** 텍스트로 '화면 명세서'를 먼저 작성하여 사용자에게 보여줍니다.
     * 예: "상단에 로고와 검색창, 좌측에 카테고리 리스트, 중앙에 3열 카드 레이아웃"
   - 사용자가 이 구조(Layout)에 동의할 때까지 텍스트로 소통하며 수정합니다.

2. **UI/UX Strategy**:
   - 사용자와 디자인 시스템(예: 주요 색상, 보조 색상, 스타일, 무드, 폰트, 아이콘 사용, 이미지 사용, 컨셉, 레퍼런스 등)과 느낌에 대해 대화로 먼저 결정합니다.

3. **Visual Prototyping (Selective Tool Use)**:
   - **텍스트 합의가 완료된 시점**에서만 `generate_image` 툴을 사용합니다.
   - 툴을 사용할 때는 앞서 합의된 구조와 스타일을 프롬프트에 상세히 포함하여, 한 번에 최선의 결과가 나오도록 유도합니다.
   - 생성된 시안을 사용자에게 보여주고 최종 '톤앤매너'를 확정합니다.

4. **Drafting UI Spec**:
   - 최종 승인된 시각적 요소와 구조를 `docs/design/ui-spec-[feature].md`에 기록합니다.
   - 구성 요소:
     - **Component Tree**: 화면을 구성하는 컴포넌트 단위 구조
     - **State & Interaction**: 버튼 클릭 시의 변화, 로딩 상태의 UI 처리
     - **Visual Assets**: `generate_image`로 생성된 이미지 파일의 경로 및 스타일 가이드