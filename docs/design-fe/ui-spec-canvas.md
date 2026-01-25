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

> [!NOTE]
> 새 캔버스 생성은 Home 페이지의 "Sketch to Design" 버튼을 통해 모달에서 이루어집니다.

### 1.3 레이아웃 모드
- **Full-screen Mode**: 몰입감을 위해 Side Navigation을 숨기고 캔버스 영역을 최대화합니다.
- **Fixed Header**: 상단 네비게이션은 유지하되, `Sketch to Design` 탭이 활성화됩니다.

### 1.4 기술 스택 (Technical Stack)
- **Canvas Engine**: **Fabric.js**

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
    │   └── CanvasLayer
    │
    ├── SpecPanel (Z-40, Left Sidebar, 320px)
    │   └── DesignBriefForm
    │
    ├── TopToolbar (Z-50, Floating, Top Center)
    │   ├── CanvasName (Editable)
    │   ├── NodeCreationGroup (Sketch, Image, Text)
    │   ├── ToolsGroup (Select, Hand)
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

사용자가 가장 빈번하게 사용하는 도구들을 모아둔 플로팅 바입니다. **브러시, 지우개 등의 편집 도구는 개별 노드 선택 시 나타나는 Context Toolbar로 이동되었습니다.**

- **위치**: 상단 중앙 (Header 하단 24px 지점)
- **스타일**:
  - 배경: White (#FFFFFF)
  - 그림자: `shadow-lg`
  - 보더: `rounded-full` (완전한 둥근 모서리)
  - 패딩: 8px 24px
  - 애니메이션: Slide Down (진입 시)

**구성 요소 (좌에서 우로)**:

#### 1. Canvas Name
- 현재 캔버스 이름 표시 및 수정
- 클릭 시 인풋 필드로 전환되어 이름 변경 가능

*(Divider)*

#### 2. 노드 생성 그룹
1.  **Add Sketch Node**: 768x768px 스케치 프레임 생성
    - 아이콘: 연필 + 사각형 프레임
    - 클릭 시 캔버스 중앙에 빈 스케치 노드 생성
2.  **Upload Image**: 이미지 파일 업로드
    - 아이콘: `ImageIcon`
    - 제약: 최대 10MB, 2048px
    - 자동 리사이징 후 768x768px 노드 생성
3.  **Add Text**: 텍스트 메모 노드 생성
    - 아이콘: `Type`
    - 가변 크기, 기본 폰트 Inter 16px

*(Divider)*

#### 3. 도구 그룹 (View Controls)
4.  **Select (V)**: 노드 선택 및 이동 (Default)
5.  **Hand (H)**: 캔버스 패닝 (Spacebar Hold)

*(Divider)*

#### 4. 액션 그룹
6.  **Undo (Cmd+Z)**: 실행 취소
7.  **Redo (Cmd+Shift+Z)**: 다시 실행
8.  **Zoom Indicator**: 현재 확대율 표시 (클릭 시 100% 리셋)

*(Divider)*

#### 5. 상태 표시
9.  **Node Count**: `12/20` 형태로 현재 노드 수 표시
    - 20개 도달 시 빨간색으로 강조
10. **Save Status**: 
    - `Saving...` (Spinner)
    - `Saved` (Check)
    - `Error` (Alert)

---

### 3.2 Spec Side Panel (Design Brief)

[REQ-007](file:///c:/Users/tjwn1/Desktop/mercury_v2_proto/docs/requirements/req-007-design-brief.md)에 정의된 **Unified Design Brief**를 입력하는 고정 패널입니다.

- **위치**: 화면 왼쪽 고정 (Left Sidebar)
- **너비**: 320px
- **동작**: Collapsible (접었을 때 너비 0px, 헤더의 햄버거 메뉴로 토글)
- **내용**: `DesignBriefForm` (공통 컴포넌트)
- **Persistence**: 
  - 수정 시 즉시 자동 저장 (Canvas 메타데이터로 저장)
  - `Global Context`로서 이후 생성되는 모든 이미지에 프롬프트로 주입됨.
- **상세 UI**: [ui-spec-design-brief.md](file:///c:/Users/tjwn1/Desktop/mercury_v2_proto/docs/design-fe/ui-spec-design-brief.md) 참조.

---

### 3.3 Context Toolbar (Node-Specific Tools)

특정 노드(Sketch, Image 등)를 선택했을 때 해당 객체 상단에 나타나는 플로팅 툴바입니다. 노드 타입에 따라 필요한 편집 도구를 제공합니다.

- **위치**: 선택된 객체의 상단 중앙 (Floating)
- **스타일**: `rounded-full`, `bg-white`, `shadow-lg`, `border-gray-200`
- **애니메이션**: Fade In/Out + Scale

**상태별 모드**:

#### A. 기본 선택 상태 (Selection State)
- **Edit/Inpaint Button**:
  - Sketch Node: "Edit Sketch" (Brush 아이콘)
  - Image Node: "Inpaint" (Brush 아이콘)
  - 클릭 시 **[Edit Mode]**로 진입
- **Close/Delete Button**: 선택 해제 또는 삭제 (X 아이콘)

#### B. 편집 모드 (Edit Mode)
노드 내부 편집을 위한 도구가 활성화된 상태입니다.
- **Editing Badge**: "EDITING" 상태 표시
- **Drawing Tools**:
  - **Brush**: 그리기 도구 (Active 시 Primary Color)
  - **Eraser**: 지우개 도구
- **Palette Button**: 색상/브러시 크기 설정 패널 토글 (Properties Panel 연동)
- **Done Button**: 편집 완료 및 저장 (Check 아이콘)

---

### 3.3 Properties Panel (Contextual Settings)

현재 활성화된 도구의 세부 속성을 제어하는 패널입니다. Context Toolbar에서 편집 모드 진입 시 브러시 설정을 제공합니다.

- **위치**: 왼쪽 상단 (Floating)
- **구성**:
  - **Brush Mode**:
    - **Size**: 브러시 크기 슬라이더 (1px ~ 100px)
    - **Color**: HEX 입력, Color Palette, Eyedropper
  - **Select Mode**:
    - 선택된 객체의 좌표(X, Y) 및 크기(W, H) 정보 (Read-only)

---

### 3.4 Layers Panel

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

### 3.5 Unified Image Context Panel (Generation & Edit)

이미지 노드가 선택되었을 때 활성화되는 통합 패널입니다. 기존의 `Segments Panel`과 `AI Prompt Panel`이 통합되어, 프롬프팅부터 마스킹(세그멘테이션/인페인팅)까지 한 곳에서 처리합니다.

- **위치**: 선택된 이미지 노드 하단 중앙 (Floating)
- **구성**:

#### A. Prompt Section (Top)
- **Prompt Input**: 텍스트 입력창 (멀티라인)
- **Generate Button**: 생성 실행
- **Style/Settings**: (Collapsible) 스타일 프리셋, 시드 값 등

#### B. Masking & Tools Section (Middle, Collapsible)
- **Mode Toggle**:
  - `Smart Select` (Segmentation)
  - `Manual Brush` (Inpainting)

- **Smart Select Mode**:
  - **Analyze Button**: 이미지 파트 분석 실행
  - **Parts Tags**: 분석된 파트 리스트 (예: `[Sole]`, `[Upper]`)
  - **Interaction**: 태그 클릭 시 해당 영역 마스킹 추가/제거

- **Manual Brush Mode**:
  - **Tools**: `Add Mask (Brush)`, `Remove Mask (Eraser)`
  - **Settings**: Brush Size 슬라이더

#### C. Action Section (Bottom)
- **Inpaint/Generate Fill**: 현재 마스킹된 영역에 대해 생성 실행
- **Variations**: 전체 변형 생성

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

---

## 7. 노드 기반 UI (Node-Based Interface)

### 7.1 노드 타입별 시각적 구분

#### Sketch 노드
- **크기**: 768x768px 고정
- **테두리**: 점선 (Dashed), Gray-300
- **배경**: White with subtle grid pattern
- **아이콘**: 좌상단에 연필 아이콘 배지

#### Image 노드
- **크기**: 768x768px 고정
- **테두리**: 실선 (Solid), Gray-200
- **배경**: 이미지로 채워짐
- **배지**: 좌상단에 출처 표시
  - 업로드: 📁 아이콘
  - AI 생성: ✨ 아이콘
  - Chat 가져오기: 💬 아이콘

#### Text 노드
- **크기**: 가변 (Auto-resize)
- **테두리**: 없음 (선택 시만 표시)
- **배경**: 투명
- **스타일**: 기본 Inter 16px, Black

### 7.2 노드 연결선 (Connection Lines)

**시각화**:
- **선 스타일**: 점선 (Dashed), Gray-400, 1px
- **화살표**: 부모 → 자식 방향
- **색상 변화**:
  - 기본: Gray-400
  - 호버: Primary-500
  - 선택된 노드의 연결선: Primary-600, 2px

**렌더링**:
- SVG Path로 구현
- 베지어 곡선 사용 (자연스러운 곡선)
- Z-index: 노드 아래, 그리드 위

**토글**:
- Toolbar의 "Show Connections" 체크박스
- 기본값: ON
- OFF 시 모든 연결선 숨김

### 7.3 AI Prompt Panel - Add Reference 기능

**위치**: AI Prompt Panel 하단

**UI 구성**:
```
┌─────────────────────────────────┐
│ Prompt: [입력 영역]              │
├─────────────────────────────────┤
│ References (2)                  │
│ ┌─────┐ ┌─────┐ [+ Add]        │
│ │ 📁  │ │ ✨  │                │
│ │Ref 1│ │Ref 2│                │
│ └─────┘ └─────┘                │
├─────────────────────────────────┤
│ [Generate]                      │
└─────────────────────────────────┘
```

**인터랙션**:
1. "+ Add Reference" 버튼 클릭
2. 캔버스 커서가 선택 모드로 변경
3. 다른 노드 클릭 시 참조로 추가
4. 참조 노드는 썸네일 + 타입 아이콘으로 표시
5. X 버튼으로 참조 제거

**제약**:
- 최대 5개 참조 노드
- 자기 자신은 참조 불가

### 7.4 노드 최대 제한 경고

**트리거**: 20개 노드 도달 시 새 노드 생성 시도

**UI**:
- 모달 또는 Toast 알림
- 메시지: "캔버스당 최대 20개 노드까지 생성할 수 있습니다. 기존 노드를 삭제 후 다시 시도해주세요."
- 버튼: "확인"

**시각적 피드백**:
- Toolbar의 Node Count가 빨간색으로 강조
- 노드 생성 버튼들이 비활성화 (Disabled)

### 7.5 노드 배치 규칙

**새 노드 생성 시**:
- Sketch/Text/Upload Image: 캔버스 중앙
- AI 생성 이미지: 부모 노드 오른쪽 50px 간격

**자동 배치 로직**:
```typescript
const placeGeneratedImage = (parentNode: Node) => {
  return {
    x: parentNode.x + parentNode.width + 50,
    y: parentNode.y
  };
};
```

---

## 7. 참고(Canvas 생성 및 관리 UI)

### 7.1 CreateCanvasModal

**트리거**: Home 페이지에서 "Sketch to Design" 버튼 클릭

**위치**: 화면 중앙 모달 (Overlay)

**크기**: 500px (width) × Auto (height)

**구성**:

#### Tab 1: New Canvas (기본 활성)
- **Canvas Name Input**:
  - Placeholder: "Untitled Canvas"
  - Auto-focus on modal open
  - Max length: 100자
  
- **Project Select** (Optional):
  - Dropdown 형태
  - 옵션:
    - "None (Standalone)" (기본값)
    - 사용자의 프로젝트 목록 (API에서 로드)
  - 프로젝트 없을 경우 "No projects yet" 표시

- **Create & Start Button**:
  - Primary 버튼
  - 클릭 시:
    1. API 호출: `POST /canvas/projects`
    2. 응답 받은 `canvas_id`로 `/canvas/{canvas_id}` 리다이렉트
  - Loading state: "Creating..." + Spinner

#### Tab 2: Recent Canvases
- **Recent Canvas List**:
  - 최근 5개 캔버스 표시
  - 각 항목:
    - 캔버스 이름
    - 마지막 수정 시간 (relative time: "2 hours ago")
    - 썸네일 (있는 경우, 40×40px)
  - 클릭 시 해당 캔버스로 이동

- **View All Canvases Link**:
  - `/canvas` 페이지로 이동
  - 텍스트: "View all canvases →"

**스타일**:
- Background: White
- Border Radius: 16px
- Shadow: `shadow-2xl`
- Backdrop: `bg-black/50` (blur)

**애니메이션**:
- Enter: Fade in + Scale up (0.95 → 1.0)
- Exit: Fade out + Scale down

---

### 7.2 CanvasListPage (캔버스 목록 페이지)

**URL**: `/canvas`

**레이아웃**: Standard Layout (Header + Main Content)

**구성**:

#### Page Header
- **Title**: "My Canvases" (H1)
- **Create Button**:
  - Primary 버튼
  - 텍스트: "+ New Canvas"
  - 클릭 시 CreateCanvasModal 열기

#### Filter Bar
- **Search Input**:
  - Placeholder: "Search canvases..."
  - Icon: Search (Lucide)
  - Debounce: 300ms

- **Project Filter**:
  - Dropdown
  - 옵션:
    - "All Projects"
    - 사용자의 프로젝트 목록
    - "Standalone Canvases"

#### Canvas Grid
- **레이아웃**: Grid (3 columns on desktop, 2 on tablet, 1 on mobile)
- **Gap**: 24px

**Canvas Card**:
- **Thumbnail**:
  - Aspect ratio: 16:9
  - Background: Gray-100
  - 썸네일 없을 경우: Placeholder icon (Canvas icon)
  
- **Info Section**:
  - **Canvas Name**: 
    - Font: 16px, Semi-bold
    - Truncate: 1 line
  - **Last Modified**:
    - Font: 12px, Gray-500
    - Format: "Updated 2 hours ago"
  - **Project Badge** (있는 경우):
    - Small badge
    - Background: Primary-50
    - Text: Primary-700

- **Actions** (Hover 시 표시):
  - **Open Button**: 기본 클릭 액션
  - **Delete Button**:
    - Icon: Trash
    - 클릭 시 확인 모달 표시
    - 모달 내용: "Are you sure you want to delete '{canvas_name}'?"
  - **Duplicate Button** (Optional):
    - Icon: Copy
    - 클릭 시 복제 후 새 캔버스로 이동

**Empty State**:
- Icon: Canvas (large, Gray-300)
- Text: "No canvases yet"
- Subtext: "Create your first canvas to get started"
- CTA Button: "Create Canvas"

---

### 7.3 Canvas Name Editor (TopToolbar 내)

**위치**: TopToolbar 좌측 (도구 그룹 앞)

**기본 상태**:
- 캔버스 이름 표시
- Font: 14px, Medium
- Color: Gray-700
- Max width: 200px
- Truncate: 1 line with ellipsis

**편집 모드**:
- **트리거**: 이름 클릭
- **UI 변화**:
  - Input field로 전환
  - Border: Primary-500
  - Auto-select all text
  - Auto-focus

- **저장**:
  - Enter 키 또는 Blur 시 자동 저장
  - API 호출: `PUT /canvas/projects/{canvas_id}`
  - Loading state: 없음 (Optimistic update)

- **취소**:
  - ESC 키로 취소
  - 원래 이름으로 복원

**Validation**:
- 빈 이름 불가 (최소 1자)
- 최대 100자
- 에러 시 Input border를 Red로 변경

---

본 UI 스펙은 **Fabric.js** 라이브러리의 표준 기능을 기준으로 작성되었습니다.
