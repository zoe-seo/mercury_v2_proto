# REQ-003: Sketch to Design (Canvas Interface)

## 1. User Story
- **전문 디자이너**로서,
- **캔버스 도구**를 사용하여 내 스케치나 레퍼런스 이미지를 직접 제어하고,
- **생성형 AI**를 통해 디테일한 렌더링을 수행하며,
- **스마트 세그멘테이션(Smart Segmentation)**을 통해 특정 신발 파트를 손쉽게 선택/수정하고,
- **영역 지정(Inpainting/Masking)** 등을 통해 정교하게 수정하고 싶다.

## 2. Detailed Workflow

### 2.1 Canvas UI & Editor (Figma-like Interface)
- **Layout**:
    - **Main Canvas**: 중앙의 무한 캔버스 (Infinite Canvas) + Zoom In/Out.
    - **Side Panels**: 좌/우측 탭 패널 (Toggleable). 클릭 시 확장되어 상세 UI 표시.
    - **Context Toolbar**: 선택한 객체(Node)에 따라 상황에 맞는 도구 패널 활성화.
    - **Segments Panel**: (New) AI가 분석한 신발 파트 리스트 표시 및 선택 기능.
- **Floating AI Panel**: 이미지 객체 선택 시 작은 대화형 프롬프트 패널 등장 -> 텍스트로 수정 요청 가능.

### 2.2 Core Interactions
- **Navigation**: Pan(손바닥), Zoom(휠/단축키), 무한 캔버스 이동.
- **Manipulation**: 
    - 객체 선택, 이동, 리사이즈, 회전.
    - **History**: Undo / Redo (단축키 지원).
    - **Color**: HEX 값 정밀 조절 가능한 컬러 피커.
- **Shortcuts**: 주요 기능에 대한 키보드 단축키 지원 (ex. V:선택, H:핸드, Space:팬 등).

### 2.3 Generation Process (Sketch-to-Image)
- **Input**: 캔버스 상의 드로잉 + 텍스트 프롬프트.
- **Control**: Strength(Denoising Strength) 조절을 통해 스케치 반영도 설정.
- **Output**: 캔버스의 특정 레이어 또는 영역에 렌더링된 이미지 생성.

### 2.3.1 Smart Segmentation (AI Analysis)
- **Segmentation**: 업로드된 이미지나 스케치를 AI가 분석하여 주요 파트(Vamp, Outsole, Quarter, Heel, Shoelace, Logo 등)를 자동으로 영역 분할.
- **Visual Feedback**:
    - 패널 내 파트 목록(Tags) 클릭 시 캔버스 상 해당 영역 하이라이트.
    - 캔버스 상에서 특정 영역 호버 시 파트 이름 표시.
- **Selection-First Prompting**:
    1. 파트 선택 (예: Outsole) 
    2. 프롬프트 입력 ("Rugged trekking style") 
    3. 선택된 영역만 부분 생성(Inpainting).

### 2.4 Advanced Editing (Detailing)
- **Hybrid Masking**:
    - **Smart Select**: 세그멘테이션된 파트 클릭으로 빠른 영역 지정.
    - **Manual Brush**: 브러시로 직접 영역을 칠하거나 지워서 세밀한 수정(Fine-tuning) 가능.
- **Inpainting**: 선택된 영역(Mask)에 대해서만 프롬프트 기반 부분 재생성.
- **Outpainting**: (Optional) 캔버스 영역 확장.
- **Layering**: 원본 스케치 위에 생성된 이미지를 레이어로 관리 (On/Off 가능).

### 2.4 Design Package Generation (Packaging Workshop)
- **Trigger**: 캔버스 내 특정 이미지 노드(Rendered Image) 선택 시 나타나는 'Create Package' 버튼을 통해 진입.
- **Packaging Workshop (Modal)**:
    - **Metadata Input**: 디자인 제목, 설명, 브랜드 정보 등 입력.
    - **Production Pipeline (Async)**:
        - **6-view Shots**: 전, 후, 좌, 우, 상, 하 각도의 표준 뷰 자동 생성.
        - **Model Shot**: 신발을 착용한 라이프스타일 연출 샷 생성.
        - **3D Asset**: 웹 뷰어용 3D 에셋 생성 (고부하 작업).
    - **Background Processing**: 무거운 생성 작업은 서버 Worker에서 처리되며, FE는 상태를 모니터링하고 완료 시 알림 제공.
- **Output**: 생성된 모든 리소스와 마케팅 리포트가 결합된 **Design Package**가 최종 갤러리로 전송됨.

## 3. Acceptance Criteria
- [ ] 사용자가 웹 캔버스에 그림을 그릴 수 있어야 한다.
- [ ] 사용자가 이미지를 업로드하고 위치/크기를 조절할 수 있어야 한다.
- [ ] 스케치 + 프롬프트로 이미지가 생성되어야 한다.
- [ ] 스마트 세그멘테이션을 통해 파트를 선택하고 부분 수정(Inpainting) 할 수 있어야 한다.
- [ ] 특정 이미지 노드를 선택하여 'Packaging Workshop'으로 진입할 수 있어야 한다.
- [ ] 워크샵을 통해 6-view, 모델 컷, 3D 에셋이 비동기로 생성되어야 한다.
- [ ] 최종 결과물을 디자인 패키지로 변환할 수 있어야 한다.

## 4. Open Questions / Risks
- 대용량 이미지 처리 시 성능 문제.