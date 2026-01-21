# REQ-003: Sketch to Design (Canvas Interface)

## 1. User Story
- **전문 디자이너**로서,
- **캔버스 도구**를 사용하여 내 스케치나 레퍼런스 이미지를 직접 제어하고,
- **생성형 AI**를 통해 디테일한 렌더링을 수행하며,
- **영역 지정(Inpainting/Masking)** 등을 통해 정교하게 수정하고 싶다.

## 2. Detailed Workflow

### 2.1 Canvas UI & Editor (Figma-like Interface)
- **Layout**:
    - **Main Canvas**: 중앙의 무한 캔버스 (Infinite Canvas) + Zoom In/Out.
    - **Side Panels**: 좌/우측 탭 패널 (Toggleable). 클릭 시 확장되어 상세 UI 표시.
    - **Context Toolbar**: 선택한 객체(Node)에 따라 상황에 맞는 도구 패널 활성화.
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

### 2.3 Advanced Editing (Detailing)
- **Inpainting**: 생성된 이미지의 밑창(Sole), 로고, 끈(User) 등 특정 영역만 마스킹하여 부분 수정. (예: "아웃솔을 더 두껍게 바꿔줘")
- **Outpainting**: (Optional) 캔버스 영역 확장.
- **Layering**: 원본 스케치 위에 생성된 이미지를 레이어로 관리 (On/Off 가능).

### 2.4 Design Package Generation
- Canvas 작업 완료 후 'Finalize' 버튼 클릭 시 기능 2와 동일한 **Design Package** 생성 프로세스 진입.
- Canvas의 작업 히스토리(Time-lapse 등) 포함 여부 논의 필요.

## 3. Acceptance Criteria
- [ ] 사용자가 웹 캔버스에 그림을 그릴 수 있어야 한다.
- [ ] 사용자가 이미지를 업로드하고 위치/크기를 조절할 수 있어야 한다.
- [ ] 스케치 + 프롬프트로 이미지가 생성되어야 한다.
- [ ] 생성된 이미지의 특정 영역을 마스킹하고, 해당 부분만 다시 생성(Inpainting) 할 수 있어야 한다.
- [ ] 최종 결과물을 디자인 패키지로 변환할 수 있어야 한다.

## 4. Open Questions / Risks
- **기술적 난이도**: 웹 기반 캔버스에서 마스킹/레이어 처리 및 이미지 합성 로직의 복잡도가 높음 (Fabric.js, Konva.js 등 라이브러리 검토 필요).
- 대용량 이미지 처리 시 성능 문제.
