# REQ-002: Text to Design (Chat Interface)

## 1. User Story
- **디자이너**로서,
- **AI 챗봇과의 대화**를 통해 막연한 아이디어를 구체화하고,
- **텍스트 및 레퍼런스**를 기반으로 초기 신발 디자인을 생성하며,
- 최종적으로 마케팅/비용 분석이 포함된 **디자인 패키지**를 얻기를 원한다.

## 2. Detailed Workflow

### 2.1 Requirement Gathering (Interview Phase)
- **Chat UI**: 사용자가 자연어로 대화할 수 있는 인터페이스 (Stream Response 적용 필수).
- **Role**: AI는 전문 신발 디자이너/컨설턴트 페르소나를 가짐.
- **Data Collection**: 
    - **Brand Identity**: 사용자가 추구하는 브랜드 이미지 및 철학 수집.
    - **Preferences**: Target Audience, 소재, 색상 팔레트, 가격대, 스타일 키워드 등.
    - **Reference**: (Optional) 사용자가 레퍼런스 이미지 업로드 가능.
- **Session Management**: 모든 채팅 세션은 자동 저장되며, 사용자가 삭제하지 않는 한 영구 보존 및 재개(Resume) 가능해야 함.

### 2.2 Outline Selection (Intermediate Phase) - [NEW]
- 디자인 생성 전, 사용자의 의도를 명확히 하기 위한 **중간 단계**.
- **Process**:
    1. 수집된 요구사항 및 브랜드 아이덴티티를 기반으로 AI가 **Outline(스케치/윤곽선)** 이미지들을 먼저 제안.
    2. 사용자는 이 중 가장 의도에 부합하는 Outline을 선택.
    3. 선택된 Outline을 바탕으로 본격적인 렌더링 및 디벨롭 진행.

### 2.3 Image Generation & Refinement
- **Generation**: 선택된 Outline과 텍스트 프롬프트를 결합하여 고퀄리티 디자인 생성 (Stream).
- **History**: 생성된 모든 이미지는 히스토리로 기록.
- **Canvas Integration**: 
    - 생성된 이미지를 더 정교하게 수정하고 싶을 경우, **Sketch Canvas(REQ-003)**로 내보내기 가능.
    - 이 경우 해당 작업은 하나의 **'Project'**로 묶여 관리됨.

### 2.4 Design Package Generation (Output)
- 최종 선택된 디자인에 대해 **Design Package** 생성.
- **Market/Cost Analysis**: MVP 단계에서는 외부 데이터 연동 없이 **LLM의 지식 베이스 및 추론 능력**을 활용하여 작성.
- **Package Contents**:
    - **Meta Info**: 생성 일시, 프롬프트, 키워드, 브랜드 정보.
    - **Main Image**: 고해상도 메인 뷰.
    - **Model Shot**: 착용 샷 또는 연출 샷 생성.
    - **Marketing Report**: 시장 분석, 트렌드, 비용 추산 (LLM 추론).
    - **Similar Products**: 유사 레퍼런스.

## 3. Acceptance Criteria
- [ ] 챗봇이 주도적으로 질문하여 디자인 사양을 구체화해야 한다.
- [ ] 대화 도중 이미지를 생성하고 보여줄 수 있어야 한다.
- [ ] 과거 생성된 이미지들을 대화방 내에서 또는 별도 패널에서 볼 수 있어야 한다.
- [ ] 최종 결과물로 '디자인 패키지'가 생성되어야 하며, 상기 명시된 리포트 내용이 포함되어야 한다.

## 4. Open Questions
- 디자인 패키지의 '시장 분석'이나 '비용 분석' 데이터의 출처나 정확도는 어느 수준을 목표로 하는가? (실제 데이터 연동 vs LLM 기반 추론)
- 채팅 세션(Session)의 저장 및 재개 기능이 필요한가?
