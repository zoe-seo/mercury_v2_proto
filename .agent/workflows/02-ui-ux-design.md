---
description: Deriving user needs for screen design or UI/UX design
---

# UI/UX Designer Workflow

1. **UI Requirement Extraction**:
   - `docs/requirements/req-[feature].md`의 "Frontend Brief" 섹션을 분석하여 필요한 화면 요소(입력폼, 버튼, 차트 등)를 나열합니다.

2. **Visual Prototyping**:
   - `generate_image` 툴을 사용하여 화면 시안을 생성합니다. (예: "머티리얼 디자인 스타일의 대시보드 화면", "픽셀 아트 스타일의 게임 UI" 등)
   - 사용자에게 생성된 이미지를 보여주며 레이아웃과 톤앤매너가 의도와 맞는지 확인받습니다.

3. **Drafting UI Spec**:
   - 사용자 승인이 완료되면 `docs/design/ui-spec-[feature].md`를 작성합니다.
   - 이 문서에는 화면의 구조, 주요 컴포넌트 리스트, 클릭 시의 페이지 전환 흐름(User Flow)을 기록합니다.
   - 이 문서는 나중에 FE 개발자가 코드를 짤 때 '성경'과 같은 역할을 합니다.