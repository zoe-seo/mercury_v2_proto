# Mercury - Canvas Interface UI Specification

## 0. Visual Reference
![Canvas UI Mockup](C:/Users/tjwn1/.gemini/antigravity/brain/9d371308-6155-483f-b793-7a228aa5d41b/canvas_ui_mockup_1769212907504.png)

## 문서 정보
- **작성일**: 2026-01-24
- **작성자**: UI/UX Designer
- **상태**: ✅ Approved
- **버전**: 1.1
- **관련 문서**: 
  - [Layout Template](file:///c:/Users/tjwn1/Desktop/mercury_v2_proto/docs/design/layout-template.md)
  - [Design System](file:///c:/Users/tjwn1/Desktop/mercury_v2_proto/docs/design/design-system.md)
  - [REQ-003: Sketch to Design](file:///c:/Users/tjwn1/Desktop/mercury_v2_proto/docs/requirements/req-003-sketch-to-design.md)

---

## 1. 페이지 개요

### 1.1 목적
- **Infinite Creativity**: 제한 없는 무한 캔버스에서 아이데이션 및 스케치
- **AI Integration**: 스케치 및 텍스트 프롬프트를 결합한 실시간 이미지 생성
- **Smart Segmentation**: AI 분석을 통한 신발 파트 자동 인식 및 선택
- **Precision Editing**: Inpainting(마스킹)을 통한 정교한 부분 수정

### 1.2 URL
- `/canvas` (캔버스 목록 페이지)
- `/canvas/:canvasId` (캔버스 편집 페이지)

> [!IMPORTANT]
> `/canvas/new` 라우트는 **제거**되었습니다. 새 캔버스 생성은 Home 페이지의 "Sketch to Design" 버튼을 통해 모달에서 이루어집니다.

### 1.3 레이아웃 모드
- **Full-screen Mode**: 몰입감을 위해 Side Navigation을 숨기고 캔버스 영역을 최대화합니다.
- **Fixed Header**: 상단 네비게이션은 유지하되, `Sketch to Design` 탭이 활성화됩니다.

### 1.4 기술 스택 (Technical Stack)
- **Canvas Engine**: **Fabric.js**
  - **선정 이유**: Object Model 기반의 강력한 편집 기능(선택, 변형, 그룹화), 자유 드로잉 브러시 API, 그리고 복잡한 마스킹(ClipPath/Composite) 지원이 본 프로젝트의 요구사항(스케치, 인페인팅, 세그멘테이션)에 가장 부합합니다.

### 1.5 저장 및 히스토리 관리 (Persistence)
- **자동 저장 (Auto-save)**: 
  - 사용자의 편집이 멈춘 후 **2초(Debounce)** 뒤에 자동으로 서버에 상태를 저장합니다.
  - 툴 변경(`Select` -> `Brush` 등) 시에는 즉시 저장을 트리거합니다.
- **UI 피드백**: 
  - 저장 중: 툴바 우측에 `Saving...` 텍스트와 Spinner 표시.
  - 저장 완료: `Saved` 아이콘(체크 표시)으로 변경.
- **실행 취소 범위 (Undo/Redo Scope)**:
  - **Drawing**: 각 브러시 획(Stroke) 단위로 기록.
  - **Object**: 생성, 삭제, 이동, 크기 조정, 속성 변경(색상, 투명도 등) 완료 시 기록.
  - **Layer**: 레이어 순서 변경, 잠금/숨김 상태 변경 기록.

---

## 2. 컴포넌트 트리

```
CanvasPage
├── Header (Global)
└── MainContent (Full Screen, Relative)
    ├── InfiniteCanvas (Z-0)
    │   ├── GridBackground
    │   └── CanvasLayer (Stages)
    │       ├── ObjectLayer (Images, Shapes, Text)
    │       ├── SegmentationLayer (AI Metadata, Hidden by default)
    │       ├── DrawingLayer (Brush Strokes)
    │       └── SelectionOverlay (Handles, Bounds, Segments Highlight)
    │
    ├── TopToolbar (Z-50, Floating, Top Center)
    │   ├── CanvasName (Editable)
    │   ├── ToolsGroup (Select, Hand, Brush, Eraser, Shape, Text, Image)
    │   ├── Divider
    │   └── ActionsGroup (Undo, Redo, Zoom, Save Status)
    │
    ├── PropertiesPanel (Z-40, Floating, Top Left)
    │   └── ContextualControls (Color, Stroke, Font, etc.)
    │
    ├── LayersPanel (Z-40, Floating, Top Right)
    │   └── LayerList
    │
    │   ├── SegmentsPanel (Z-40, Floating, Bottom Right)
    │   │   └── PartList (Vamp, Outsole, etc.)
    │
    └── AIPromptPanel (Z-50, Floating, Contextual)
        ├── PromptInput
        ├── GenerateButton
        └── InpaintControls

CanvasListPage
├── Header (Global)
└── MainContent
    ├── PageHeader
    │   ├── Title ("My Canvases")
    │   └── CreateButton
    ├── FilterBar
    │   ├── SearchInput
    │   └── ProjectFilter
    └── CanvasGrid
        └── CanvasCard[] (Thumbnail, Name, Date, Actions)

CreateCanvasModal
├── ModalHeader ("Create New Canvas")
├── TabBar
│   ├── NewCanvasTab
│   └── RecentCanvasesTab
├── NewCanvasForm
│   ├── CanvasNameInput
│   ├── ProjectSelect
│   └── CreateButton
└── RecentCanvasList
    ├── CanvasItem[] (Name, Date)
    └── ViewAllLink
```

---

## 3. 상세 인터페이스 설계

### 3.1 Top Toolbar (Main Tools)

사용자가 가장 빈번하게 사용하는 도구들을 모아둔 플로팅 바입니다.

- **위치**: 상단 중앙 (Header 하단 24px 지점)
- **스타일**:
  - 배경: White (#FFFFFF)
  - 그림자: `shadow-lg`
  - 보더: `rounded-full` (완전한 둥근 모서리)
  - 패딩: 8px 24px
  - 애니메이션: Slide Down (진입 시)

**구성 요소 (좌에서 우로)**:
1.  **Select (V)**: 객체 선택 및 이동 (Default)
2.  **Hand (H)**: 캔버스 패닝 (Spacebar Hold)
3.  **Brush (B)**: 자유 그리기
4.  **Eraser (E)**: 지우개
5.  **Shape (R)**: 사각형, 원형, 선
6.  **Text (T)**: 텍스트 삽입
7.  **Image (I)**: 이미지 업로드
    - **제약 사항**: 최대 2048px 해상도, 10MB 용량 제한.
    - **UX**: 파일 선택/드롭 시 가이드 텍스트 표시 및 리사이징(클라이언트 사이드) 수행.
    *   *(Divider)*
8.  **Undo (Cmd+Z)**: 실행 취소
9.  **Redo (Cmd+Shift+Z)**: 다시 실행
10. **Zoom**: 현재 확대율 표시 (클릭 시 100% 리셋)
    *   *(Divider)*
12. **Save Status**: `Saved` / `Saving...` 상태 표시 아이콘 (편집 시 자동 저장 트리거)

**인터랙션**:
- 활성 도구는 `bg-primary-50` 배경과 `text-primary-600` 색상으로 강조됩니다.
- 각 아이콘 호버 시 툴팁(단축키 포함)이 표시됩니다.

---

### 3.2 Properties Panel (Contextual)

현재 선택된 도구에 따라 동적으로 변하는 속성 패널입니다. `3.1 Top Toolbar`의 좌측 하단(왼쪽 정렬)에 위치합니다.

- **위치**: 왼쪽 상단 (Top Toolbar와 수평 정렬 or 좌측면)
  - *Recommendation*: 캔버스 작업 영역 확보를 위해 **왼쪽 상단(Header 아래 24px, 왼쪽 24px)**에 고정 위치합니다.
- **크기**: 너비 240px, 높이 Auto
- **스타일**: `rounded-xl`, `bg-white/90` (Backdrop blur), `shadow-md`

**상태별 콘텐츠**:
- **Selection 모드**: 선택된 객체의 속성 (좌표 X/Y, 크기 W/H, 투명도)
- **Brush 모드 (Drawing)**:
  - **Brush Size**: 슬라이더 + 픽셀 값 직접 입력 (Key: `[` / `]`)
  - **Color Control**:
    - **Color Picker**: 정밀 색상 선택 (Gradient/Wheel)
    - **Hex Input**: `#14AE5C` 형태의 텍스트 직접 입력, 복사/붙여넣기 지원
    - **Eyedropper (I)**: 캔버스 내 색상 추출 도구
    - **Recent Colors**: 최근 사용한 색상 리스트 (5개)
    - *목적*: AI 모델은 스케치의 색상 정보를 힌트(ControlNet Color map 등)로 사용하여 결과물의 색조를 결정하므로, 정확한 의도 전달을 위해 색상 선택이 중요합니다.
  - **Opacity**: 투명도 슬라이더 (레이어링 효과)
- **Shape 모드**: Fill Color, Stroke Color, Stroke Width
- **Text 모드**: Font Family, Size, Weight, Align

---

### 3.3 Layers Panel

복잡한 작업을 관리하기 위한 레이어 패널입니다.

- **위치**: 오른쪽 상단 (Header 아래 24px, 오른쪽 24px)
- **크기**: 너비 260px, 최대 높이 500px
- **스타일**: `rounded-xl`, `bg-white/90`, `shadow-md`

**기능**:
- **Drag & Drop**: 레이어 순서 변경 (Z-index 자동 조정)
- **Visibility**: 눈 아이콘 토글 (Show/Hide) -> 서버 API `PUT /layers/{id}` 연동
- **Lock**: 자물쇠 아이콘 토글 (잠금/해제) -> 서버 API 연동 (`is_locked` 필드)
- **Opacity**: 레이어별 불투명도 조절 (0~1.0) -> 서버 API 연동 (`opacity` 필드)
- **Blending Mode**: (Advanced) Multiply, Screen, Overlay 등 지원

### 3.4 Segments Panel (New)
    
AI가 분석한 이미지의 파트 정보를 표시하고 선택을 돕는 패널입니다. `3.3 Layers Panel` 하단에 위치하거나 탭으로 구분됩니다.

- **위치**: 오른쪽 하단 (Layers Panel 아래)
- **구성**:
  - **Auto-Detect Button**: "Analyze Sketch" 버튼 (AI 세그멘테이션 실행)
  - **Parts List**: 인식된 파트들의 태그 리스트 (Pill shape)
    - 예: `[Sole]`, `[Laces]`, `[Heel]`, `[Logo]`
  - **Interaction**:
    - **Hover**: 캔버스 상에 해당 파트영역 **반투명 컬러 하이라이트 + 외곽선(Outline/Glow)** 효과 병행 (복잡한 텍스처 위에서도 가독성 확보).
    - **Click**: 해당 영역이 'Mask' 상태로 선택됨 -> AI Prompt Panel 활성화.
    - **Technical Implementation**: API가 제공하는 SVG Path 데이터를 Fabric.js의 `fabric.Path` 객체로 생성하여 최상단 오버레이 레이어에 배치.

---

### 3.5 AI Prompt Panel (Contextual)

이미지 생성 및 수정을 위한 핵심 패널입니다. 객체가 선택되거나, 특정 영역을 지정했을 때 해당 위치 근처에 팝오버(Popover) 형태로 나타납니다.

- **위치**: 선택 영역 바로 하단 중앙 (Floating)
  - **충돌 감지 Logic**: 
    - 패널이 화면 하단/우측 경계를 벗어날 경우, 선택 영역의 **상단 또는 좌측**으로 위치를 반전(Flip)하여 표시.
    - 캔버스 줌 레벨에 관계없이 항상 화면(Viewport) 내에 존재하도록 조정.
- **스타일**: `rounded-lg`, `bg-white`, `border-primary-200`, `shadow-xl`

**구성 요소**:
1.  **Prompt Input**:
    - Placeholder: "Describe what to generate..."
    - Multi-line resizing
    - `✨` 아이콘 버튼 (Enhance Prompt)
2.  **Action Buttons**:
    - `Generate`: 생성 시작 (Primary Color)
    - `Variations`: 디자인 변형 생성
    - `Inpaint`: 마스킹 모드 진입
    - `✨ Create Package`: **[Design Packaging Workshop]** 시작 (Primary-500)
3.  **Inpaint Mode** (활성화 시):
    - 캔버스 커서가 'Mask Brush'로 변경됨
    - 패널에 'Brush Size' 슬라이더 표시
    - 캔버스에 칠한 영역이 붉은색(반투명)으로 마스킹됨
    - 버튼이 `Generate Fill`로 변경됨
3.  **Selection Context** (세그멘테이션 선택 시):
    - 선택된 파트 이름 표시 (예: "Selected: Outsole")
    - **Hybrid Masking**:
        - 파트 선택 상태에서 'Inpaint Mode'를 켜면, 선택된 영역이 마스크로 변환됨.
        - 이후 브러시로 마스크 영역을 추가하거나 지우개로 다듬기(Refine) 가능.
    - 프롬프트 입력 시 최종 마스킹된 영역에 부분 생성 수행.

---

### 3.6 Context Menu (Right Click)

전문 디자이너의 생산성을 위해 캔버스 객체 위에서 마우스 우클릭 시 퀵 메뉴를 제공합니다.

- **표시 조건**: 단일 또는 다중 객체 선택 후 우클릭
- **메뉴 항목**:
  - **Duplicate (Cmd+D)**: 객체 복제
  - **Delete (Del)**: 객체 삭제
  - **Bring to Front (Cmd+])**: 맨 앞으로 가져오기
  - **Send to Back (Cmd+[)**: 맨 뒤로 보내기
  - **Group/Ungroup (Cmd+G)**: 그룹화/해제
  - **Analyze (Segmentation)**: 해당 이미지 파트 분석 실행
- **스타일**: `bg-white`, `shadow-md`, `rounded-md`, `py-1`, `text-sm`, `min-w-[160px]`

### 3.7 Design Packaging Workshop (제품 패키징 워크샵)

캔버스 내 특정 결과물을 공식적인 '디자인 패키지(DP)'로 변환하기 위한 전문 워크플로우입니다.

- **표시 형태**: 캔버스 중앙에 거대하게 위치하는 센터 모달 (캔버스 배경이 살짝 비치는 반투명 Backdrop 적용).
- **특징**: 무거운 비동기 작업(이미지 생성)을 FE에서 안정적으로 모니터링하며 진행.

**워크샵 시나리오 (3-Step Production Line)**:

1.  **Step 1: 메타데이터 및 설정 (Input Phase)**
    - 좌측: 선택한 원본 이미지 (Reference) 고정.
    - 우측: 제목, 설명(디자인 의도), 사용 소재, 타겟 브랜드 정보 입력.
    - 입력 완료 시 하단 '생산 라인' 활성화.
2.  **Step 2: 비동기 리소스 생성 (Streaming Pipeline)**
     - 서버 Worker에서 비동기로 생성되는 에셋들을 실시간으로 확인.
     - **6-view Standard Shots**: 전/후/좌/우/상/하 6개 뷰가 하나씩 생겨나는 Progressive UI.
     - **Lifestyle Model Shot**: 신발을 착용한 연출 컷 (Shimmer 효과와 함께 로딩).
     - **3D Asset**: 진행률 바(Progress Bar)를 통해 생성 상태 표시.
     - 완료된 2D 시안은 개별적으로 '다시 생성(Retry)' 버튼 제공.
3.  **Step 3: 최종 검토 및 전송 (Finalize Phase)**
     - 모든(또는 필수) 리소스 확인 후 **[디자인 패키지 확정]** 버튼 클릭.
     - 결과물이 갤러리로 이동하며, 캔버스로 돌아가거나 갤러리로 이동할 수 있는 완료 팝업 표시.

**UX 정책**:
- 작업이 길어질 경우 "캔버스에서 계속 작업하며 알림 받기"를 통해 모달을 닫을 수 있음 (백그라운드 생성 유지).
- 완료 시 우측 상단 토스트 알림으로 성공 여부 공지.

---

## 4. 시각적 디테일 (Visual Details)

### 4.1 Infinite Canvas
- **Background**: `Gray-50` (#FAFAFA)
- **Grid Pattern**: 
  - Type: Dot Grid
  - Color: `Gray-300`
  - Spacing: 20px
  - Major Grid: 100px (약간 더 진한 점)

### 4.2 Selection UI
- **Bounding Box**: `Primary-500` (1px Solid Line)
- **Corner Handles**: White square with `Primary-500` border & shadow
- **Rotate Handle**: 상단 중앙 돌출 핸들

### 4.3 Loading State (Generation)
- 생성 중인 영역에 `Skeleton UI` 또는 `Blur Hash` 적용
- 테두리에 **Shimmering Gradient Animation** (Primary to Accent color) 적용
- "Generating..." 텍스트와 함께 진행률 표시

---

## 5. 단축키 (Keyboard Shortcuts)

| Category | Command | Key (Mac) | Key (Win) |
|----------|---------|-----------|-----------|
| **Tools** | Select | `V` | `V` |
| | Hand | `H` or `Space` | `H` or `Space` |
| | Brush | `B` | `B` |
| | Eraser | `E` | `E` |
| | Text | `T` | `T` |
| | Rectangle | `R` | `R` |
| | Circle | `O` | `O` |
| **Action** | Undo | `Cmd + Z` | `Ctrl + Z` |
| | Redo | `Cmd + Shift + Z` | `Ctrl + Shift + Z` |
| | Duplicate | `Cmd + D` | `Ctrl + D` |
| | Group | `Cmd + G` | `Ctrl + G` |
| | Ungroup | `Cmd + Shift + G` | `Ctrl + Shift + G` |
| **View** | Zoom In | `Cmd + +` | `Ctrl + +` |
| | Zoom Out | `Cmd + -` | `Ctrl + -` |
| | Reset Zoom | `Shift + 0` | `Shift + 0` |

---

## 6. 모바일 대응 (Responsive)

캔버스는 데스크톱 중심의 기능이므로 모바일에서는 기능을 제한적으로 제공합니다.

- **Tablet (iPad 등)**:
  - 모든 기능 지원
  - 터치 제스처 (Two-finger pan, Pinch zoom) 지원
- **Mobile (Phone)**:
  - **View Only Mode**로 기본 동작
  - 상단에 "Edit on Desktop for best experience" 배너 표시
  - 간단한 텍스트 프롬프트 수정 및 갤러리 확인만 가능

---

본 UI 스펙은 **Fabric.js** 라이브러리의 표준 기능을 기준으로 작성되었습니다.

