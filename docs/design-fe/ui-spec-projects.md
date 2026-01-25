# Mercury - Projects Interface UI Specification

## 0. Visual Reference
![Projects Page Mockup](C:/Users/tjwn1/.gemini/antigravity/brain/3aa4cafd-e0e1-4b21-9dc4-5b0db73c8d6d/projects_page_mockup_1769314375803.png)

## 문서 정보
- **작성일**: 2026-01-25
- **작성자**: UI/UX Designer
- **상태**: ✅ Approved
- **버전**: 1.0
- **관련 문서**:
  - [REQ-006: Projects Management](file:///c:/Users/tjwn1/Desktop/mercury_v2_proto/docs/requirements/req-006-projects.md)
  - [Layout Template](file:///c:/Users/tjwn1/Desktop/mercury_v2_proto/docs/design/layout-template.md)

---

## 1. 페이지 개요

### 1.1 목적
- **Unified Workspace**: 사용자의 모든 작업물(Canvas, Chat)을 한 곳에서 모아보고 관리합니다.
- **Efficient Organization**: 프로젝트(폴더) 기능을 통해 디자인 컬렉션을 체계적으로 분류합니다.
- **Quick Access**: 최근 작업물에 빠르게 접근하고 새로운 작업을 즉시 시작할 수 있습니다.

### 1.2 URL 구조
- `/projects` (메인 프로젝트 페이지 - Recent Designs 기본)
- `/projects/canvases` (Canvas 모아보기)
- `/projects/chats` (Chat 모아보기)
- `/projects/folders` (프로젝트 폴더 목록)
- `/projects/folders/:projectId` (특정 프로젝트 상세)

### 1.3 레이아웃 구조
- **Global Layout**: Header + Side Navigation + Main Content
- **Main Content**:
  - **Toolbar Area**: 검색, 필터, 정렬, 생성 버튼 (Sticky)
  - **Content Grid**: 반응형 카드 그리드

---

## 2. 컴포넌트 트리

```
ProjectsPage
├── Header (Global)
├── SideNavigation (Global Style, Project Tab Active)
└── MainContent Area
    ├── PageHeader (Title depending on View)
    │
    ├── ToolbarContainer
    │   ├── SearchInput (Global Search within view)
    │   ├── FilterGroup (All/Canvas/Chat - if applicable)
    │   ├── SortDropdown (Recent/Name/Created)
    │   └── CreateButton (Primary CTA)
    │
    ├── ContentGrid (Responsive Grid)
    │   ├── DesignCard (Canvas/Chat Type)
    │   │   ├── ThumbnailArea (Snapshot or Icon)
    │   │   ├── Badge (Type Indicator)
    │   │   ├── InfoArea (Title, Date, Project Tag)
    │   │   └── ActionMenu (Meatball Menu)
    │   │
    │   └── ProjectFolderCard
    │       ├── FolderIcon
    │       ├── Title & Count
    │       └── PreviewThumbnails (Stacked)
    │
    ├── EmptyStatePlaceholder
    └── Pagination / InfiniteScrollTrigger
```

---

## 3. 상세 인터페이스 설계

### 3.1 Side Navigation (Local Context)
`layout-template.md`에 정의된 Global Side Nav의 'Project' 탭 내부 구조입니다.

- **메뉴 항목**:
  1.  **⭐ Recent Designs** (Default): 최근 수정된 순서로 모든 작업물 표시
  2.  **🎨 My Canvases**: 캔버스 작업물만 필터링
  3.  **💬 My Chats**: 채팅 세션만 필터링
  4.  **📁 My Projects**: 프로젝트 폴더 목록
- **스타일**:
  - 활성 상태: 배경색 `Primary-50` + 텍스트 `Primary-700` + 좌측 보더 `Primary-500`
  - 비활성 상태: 투명 배경 + 텍스트 `Gray-600`
  - 호버 효과: 배경색 `Gray-100`

### 3.2 Main Content - Toolbar Area
사용자가 콘텐츠를 쉽게 찾고 관리할 수 있는 도구 모음입니다.

- **위치**: Main Content 최상단 (Header 아래)
- **높이**: 64px
- **구성 요소**:
  - **Left**: 
    - **Search**: "Search projects..." (Width: 320px)
  - **Right**:
    - **Filter**: [All | Canvas | Chat] (Segmented Control style) *Recent Designs 뷰에서만 표시*
    - **Sort**: [Last Modified ▼] (Dropdown)
    - **New Button**: [+ New Project] or [+ New Canvas/Chat] (Context dependent)

### 3.3 Design Card (Common Component)
Canvas와 Chat 작업물을 표현하는 표준 카드 UI입니다.

- **크기**: Responsive Grid (Min-width: 280px, Max-width: 1fr)
- **비율**: 약 1:1.2 (세로형)
- **Visual Style**:
  - Background: White
  - Border: 1px solid `Gray-200`
  - Radius: `rounded-lg`
  - Shadow: `shadow-sm` (Hover: `shadow-md` + `translate-y-[-2px]`)

- **내부 구성**:
  1.  **Thumbnail (상단 60%)**:
      - **Aspect Ratio**: 16:9
      - **Content**: 
        - Canvas: 캔버스 스냅샷 이미지 (`object-cover`)
        - Chat: 대표 생성 이미지 또는 텍스트 버블 아이콘 패턴 (`bg-gray-50`)
      - **Overlay**: 호버 시 "Open" 버튼 표시 (Semi-transparent black dim)
      - **Type Badge**: 좌측 상단 (Green for Canvas, Blue for Chat)
  2.  **Info Area (하단 40%)**:
      - **Title**: 1줄 말줄임 (Bold, `Gray-900`)
      - **Description**: 2줄 말줄임 (Regular, `Gray-500`, Chat인 경우 첫 메시지)
      - **Meta**: 
        - 날짜 ("2h ago", `text-xs`, `Gray-400`)
        - 프로젝트 태그 (Pill shape, 클릭 시 해당 프로젝트로 이동)
  3.  **Action**:
      - 우측 하단 (또는 상단) Meatball Menu (...)
      - 메뉴: Rename, Share, Move to Project, Duplicate, Delete

### 3.4 Project Folder Card
프로젝트(컬렉션)를 표현하는 폴더 형태의 카드입니다. 'My Projects' 뷰에서 사용됩니다.

- **스타일**: macOS 폴더 아이콘 느낌을 현대적으로 재해석
- **구성**:
  - **Icon**: 큰 폴더 아이콘 (📁) 또는 포함된 디자인들의 썸네일 스택(Stacked Preview)
  - **Info**:
    - **Title**: 프로젝트 이름
    - **Count badge**: "12 items"
  - **Interaction**: 더블 클릭 시 프로젝트 상세(`projects/:id`) 진입

### 3.5 Project Detail View (`/projects/:id`)
특정 프로젝트 폴더 내부에 들어왔을 때의 뷰입니다.

- **Header**:
  - **Breadcrumb**: Projects > [Project Name]
  - **Title**: 프로젝트 이름 (클릭하여 수정 가능)
  - **Description**: 프로젝트 설명 (Optional)
- **Content**:
  - 해당 프로젝트에 속한 Design Card 그리드
- **Empty State**:
  - "이 프로젝트는 비어있습니다."
  - [+ Add Design] (기존 디자인 가져오기), [+ Create New] (새로 만들기) 버튼

---

## 4. 모달 (Modals)

### 4.1 Create Project Modal
- **Trigger**: [+ New Project] 버튼 클릭
- **Fields**:
  - **Name**: 프로젝트 이름 (Required)
  - **Description**: 설명 (Optional)
- **Footer**: [Cancel] [Create Project]

### 4.2 Move to Project Modal
- **Trigger**: Design Card > Menu > "Move to Project"
- **Content**:
  - 검색 가능한 프로젝트 리스트
  - [+ Create New Project] 빠른 생성 옵션
- **Action**: 선택 후 [Move]

### 4.3 Setup New Canvas/Chat Modal (기존 로직 활용)
- Home 화면의 "Start" 버튼과 동일한 모달을 재사용합니다.
- 단, 현재 뷰가 특정 Project 내부라면, 생성 시 해당 `project_id`가 자동으로 주입되어야 합니다.

---

## 5. 인터랙션 및 상태 (States)

### 5.1 Loading
- **Skeleton UI**: 카드 그리드 형태의 스켈레톤 애니메이션 표시
- 데이터 로드 중 깜빡임(Flicker) 최소화

### 5.2 Empty States
- 각 뷰(Recent, Canvases 등)에 데이터가 없을 때 표시
- **Illustration**: 은은한 라인 아트 일러스트
- **Message**: "아직 작업 내역이 없습니다."
- **Call to Action**: "첫 번째 디자인을 시작해보세요!" (버튼)

### 5.3 Error Handling
- API 실패 시 Toast 알림 ("Failed to load projects")
- ‘Retry’ 버튼이 포함된 Error Placeholder 표시

---

## 6. 반응형 대응 (Responsive)

| Breakpoint | Layout | Columns |
|------------|--------|---------|
| **Mobile** (< 768px) | Side Nav Hidden (Drawer), 1 Col Grid | 1 |
| **Tablet** (768px+) | Side Nav Icon Only, 2-3 Col Grid | 2 ~ 3 |
| **Desktop** (1024px+) | Full Layout, 3-4 Col Grid | 3 ~ 4 |
| **Wide** (1440px+) | Full Layout, 4-5 Col Grid | 4 ~ 5 |
