# Mercury - Canvas Interface UI Specification

## 문서 정보
- **작성일**: 2026-01-22
- **작성자**: UI/UX Designer
- **상태**: ✅ Approved
- **버전**: 1.0
- **관련 문서**: 
  - [Layout Template](file:///c:/Users/tjwn1/Desktop/mercury_v2_proto/docs/design/layout-template.md)
  - [Design System](file:///c:/Users/tjwn1/Desktop/mercury_v2_proto/docs/design/design-system.md)

---

## 0. Visual Reference
![Canvas Interface Visual Prototype](C:/Users/tjwn1/.gemini/antigravity/brain/9c49e5eb-7f9e-4610-9263-9b26050e52ce/canvas_page_design_1769092535630.png)

---

## 1. 페이지 개요

### 1.1 목적
- 무한 캔버스에서 자유로운 스케치 및 이미지 편집
- 스케치를 기반으로 한 AI 이미지 생성 (Image-to-Image)
- 다양한 레이어 관리 및 디자인 요소 편집

### 1.2 URL
- `/canvas/new` (새 프로젝트)
- `/canvas/:projectId` (기존 프로젝트)

### 1.3 레이아웃 참조
- **Header**: Top Navigation (Project > Sketch to Design 활성화)
- **Side Nav**: 숨김 (Full-screen 모드)
- **Main Content**: Infinite Canvas + Floating Panels

---

## 2. 컴포넌트 트리

```
CanvasPage
├── Header (Global)
└── MainContent (Full Screen)
    ├── InfiniteCanvas (Background)
    │   ├── GridBackground
    │   ├── CanvasObjects (SketchLines, Images, Shapes)
    │   └── SelectionOverlay
    ├── TopToolbar (Floating, Top Center)
    │   ├── ToolGroup (Select, Brush, etc.)
    │   ├── Divider
    │   └── ActionGroup (Undo, Redo, Zoom)
    ├── ToolPanel (Floating, Left Center)
    │   └── ToolButtons (Vertical Stack)
    ├── LayerPanel (Floating, Right)
    │   ├── PanelHeader
    │   ├── LayerList
    │   │   └── LayerItem (Draggable)
    │   └── PanelFooter (New Layer, Delete)
    └── AIPromptPanel (Conditional Floating)
        ├── PromptInput
        └── GenerateButton
```

---

## 3. 섹션별 상세 설계

### 3.1 Top Toolbar (Floating)

#### 레이아웃
- **위치**: 상단 중앙 (Header 아래 24px)
- **스타일**: 
  - 배경: White
  - 그림자: shadow-lg
  - 보더 반경: rounded-xl (16px)
  - 패딩: 8px 16px
  - 높이: 56px
  - 애니메이션: Slide Down (진입 시)

#### 구성 요소
- **Left Group (Tools)**:
  - **Select (V)**: 커서 아이콘
  - **Brush (B)**: 붓 아이콘
  - **Shape (R)**: 사각형 아이콘
  - **Text (T)**: T 아이콘
  - **Eraser (E)**: 지우개 아이콘
  - *상태*: 활성 툴은 Primary-50 배경 + Primary-500 아이콘
- **Divider**: 수직 구분선 (높이 24px, Gray-300)
- **Right Group (Actions)**:
  - **Undo (Cmd+Z)**: 왼쪽 굽은 화살표
  - **Redo (Cmd+Shift+Z)**: 오른쪽 굽은 화살표
  - **Zoom**: "%" 표시 드롭다운 (100%)
  - **Export**: 내보내기 아이콘

---

### 3.2 Tool Panel (Left Floating) - *선택 사항*

> **참고**: Top Toolbar에 도구를 포함시켰으므로, 별도의 왼쪽 패널은 제거하거나 고급 도구(브러시 크기, 색상 등)용으로 사용할 수 있습니다. 여기서는 **속성 패널(Properties Panel)**로 대체하는 것을 제안합니다.

#### Properties Panel (Left/Contextual)
- **표시 조건**: 도구 선택 시 or 객체 선택 시
- **위치**: 왼쪽 상단 or 선택 객체 근처
- **내용**: 
  - 브러시: 크기 슬라이더, 생상 피커, 투명도
  - 도형/텍스트: Fill, Stroke, Font 설정

---

### 3.3 Layer Panel (Right Floating)

#### 레이아웃
- **위치**: 오른쪽 상단 (Header 아래 24px, 오른쪽 24px)
- **너비**: 260px
- **높이**: 최대 600px (내용에 따라 조절)
- **스타일**:
  - 배경: White (투명도 95%)
  - 그림자: shadow-lg
  - 보더 반경: rounded-xl
  - Backdrop Filter: blur(4px)

#### 구성 요소
- **Header**: "Layers" 타이틀 + 접기 버튼
- **Layer List**:
  - **Layer Item**:
    - 높이: 48px
    - 썸네일 (32px) + 레이어 이름
    - 기능: 드래그 앤 드롭 (순서 변경), 가시성(눈), 잠금(자물쇠)
    - 활성 상태: Primary-50 배경, Active Border
- **Footer**:
  - **Add Layer**: "+" 버튼
  - **Delete**: 휴지통 버튼

---

### 3.4 AI Prompt Panel (Conditional)

#### 레이아웃
- **표시 조건**: 캔버스 내 이미지/영역 선택 시 활성화
- **위치**: 선택 영역 바로 하단 (Floating)
- **스타일**:
  - 배경: White
  - 그림자: shadow-2xl
  - 보더: 1px solid Primary-200
  - 보더 반경: rounded-lg
  - 패딩: 8px

#### 내용
- **Input**: "Describe changes or generate..."
- **Generate Button**: Primary Button (Small, "Generate")
- **옵션**:
  - "Inpaint": 마스크 영역만 재생성
  - "Variation": 전체 변형
  - 슬라이더: Strength (원본 유지 강도)

---

### 3.5 Infinite Canvas

#### 배경
- **색상**: Gray-50 (#FAFAFA) or Dark Gray (#1E1E1E) depending on mode
- **패턴**: Dot Grid (간격 20px, 색상 Gray-300)

#### 인터랙션
- **Pan**: Space + Drag or Middle Click
- **Zoom**: Wheel or Pinch
- **Selection**: Drag area
- **Resize/Rotate**: Control handles on selected object

---

## 4. 상태 & 인터랙션

### 4.1 초기 상태 (New Project)
- **빈 캔버스**
- **중앙 안내**: "Select a tool or drag an image to start" (Ghost Text)
- **Topbar**: Active selection tool

### 4.2 생성 중 (Generating)
- **Loading Overlay**: 선택 영역 위에 스피너 또는 진행률 표시바
- **Cancel Button**: "Stop Generating"

### 4.3 결과 선택 (After Generation)
- 생성된 이미지가 캔버스에 배치됨
- **Variation UI**: 생성된 4개 옵션 중 선택하는 작은 팝업 표시 (선택 시 해당 이미지가 레이어에 확정됨)

---

## 5. 애니메이션 (Framer Motion)

### 5.1 패널 진입
```jsx
const panelVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 25 } }
};
```

### 5.2 AI 생성 효과
- **Shimmering Border**: 생성 중인 영역 테두리에 빛나는 효과 (Pulse)

---

## 6. 구현 예시

### 6.1 CanvasLayout
```jsx
<div className="relative w-full h-[calc(100vh-64px)] overflow-hidden bg-gray-50">
  <TopToolbar className="absolute top-6 left-1/2 -translate-x-1/2 z-50" />
  <LayerPanel className="absolute top-6 right-6 z-40" />
  <PropertiesPanel className="absolute top-6 left-6 z-40" />
  
  <InfiniteCanvas>
    {/* Canvas Content */}
    <AnimatePresence>
      {selectedObject && <AIPromptPanel object={selectedObject} />}
    </AnimatePresence>
  </InfiniteCanvas>
</div>
```

---

## 7. 참고 문서
- [Design System](file:///c:/Users/tjwn1/Desktop/mercury_v2_proto/docs/design/design-system.md)
