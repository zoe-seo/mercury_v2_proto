# Mercury - Gallery UI Specification

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
![Gallery Interface Visual Prototype](C:/Users/tjwn1/.gemini/antigravity/brain/9c49e5eb-7f9e-4610-9263-9b26050e52ce/gallery_page_design_1769092639463.png)

---

## 1. 페이지 개요

### 1.1 목적
- 생성된 모든 디자인 자산을 검색하고 관리
- 디자인 상세 보기 및 마케팅 패키지 내보내기

### 1.2 URL
- `/gallery` (전체 목록)
- `/gallery/:designId` (상세)

### 1.3 레이아웃 참조
- **Header**: Top Navigation (Project > Gallery 활성화)
- **Side Nav**: Project 탭의 Side Nav 표시
- **Main Content**: Grid Layout + Filter Sidebar (Optional)

---

## 2. 컴포넌트 트리

```
GalleryPage
├── Header (Global)
└── MainContainer (Flex)
    ├── SideNav (Global Project Nav)
    └── ContentArea
        ├── PageHeader
        │   ├── Title
        │   └── ActionGroup (Upload, Filter Toggle)
        ├── FilterBar (Sticky Top)
        │   ├── SearchInput
        │   ├── SortSelect
        │   └── ViewToggle (Grid/List)
        ├── GalleryGrid
        │   └── DesignCard
        │       ├── Thumbnail
        │       ├── OverlayInfo
        │       └── QuickActions (Download, Share)
        └── Pagination/InfiniteScroll
```

---

## 3. 섹션별 상세 설계

### 3.1 Page Header

#### 레이아웃
- **패딩**: 상단 32px, 하단 24px
- **정렬**: Flex (space-between)

#### Title
- 텍스트: "Design Gallery"
- 폰트: font-heading, text-3xl, font-bold

#### Action Group
- **Upload Button**: Secondary Button (Import external reference)
- **Filter Toggle**: 필터 패널 열기/닫기

---

### 3.2 Filter Toolbar

#### 레이아웃
- **위치**: Page Header 하단
- **스타일**: 배경 White, padding 16px, rounded-lg, border Gray-200
- **구성**:
  - **Search**: "Search by name, tag..."
  - **Tabs**: "All", "Favorites", "By Project"
  - **Sort**: "Newest First", "Oldest First", "Name A-Z"

---

### 3.3 Gallery Grid

#### 레이아웃
- **Grid**: 
  - Desktop: 4 Columns
  - Tablet: 3 Columns
  - Mobile: 1-2 Columns
- **Gap**: 24px

#### Design Card

```
구조:
┌─────────────────────┐
│                     │
│   [Thumbnail]       │ (Aspect Ratio 1:1)
│                     │
│  ┌───────────────┐  │ (Hover Overlay)
│  │ ♡  [Download] │  │
│  └───────────────┘  │
└─────────────────────┘
┌─────────────────────┐
│ Design Name         │
│ Project Name        │
└─────────────────────┘
```

- **Thumbnail**:
  - Rounded-xl
  - Hover 시 Scale(1.02)
- **Info**:
  - 제목 (font-medium, Gray-800)
  - 프로젝트명 (text-xs, Gray-500)
- **Quick Actions** (Hover):
  - Download Icon
  - Share Icon
  - Like (Heart) Icon

---

## 4. 디자인 상세 모달 (Design Detail Modal)

### 4.1 레이아웃
- **Type**: Full-screen Modal or Large Modal
- **구성**:
  - **Left**: Large Image View (Main)
  - **Right**: Details Panel
    - Meta Info (Prompt, Created Date)
    - Color Palette (Extracted HEX codes)
    - **Download Package**:
      - "Full Package (ZIP)"
      - "Marketing Report (PDF)"
      - "Image Only (PNG)"

---

## 5. 구현 예시

### 5.1 GalleryGrid
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
  {designs.map(design => (
    <DesignCard key={design.id} design={design} />
  ))}
</div>
```

---

## 6. 참고 문서
- [Design System](file:///c:/Users/tjwn1/Desktop/mercury_v2_proto/docs/design/design-system.md)
