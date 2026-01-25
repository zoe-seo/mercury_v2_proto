# Mercury - Chat Interface UI Specification

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
![Chat Interface Visual Prototype](C:/Users/tjwn1/.gemini/antigravity/brain/9c49e5eb-7f9e-4610-9263-9b26050e52ce/chat_page_design_1769092395357.png)

---

## 1. 페이지 개요

### 1.1 목적
- AI와의 대화를 통해 신발 디자인 요구사항 수집 및 이미지 생성
- 생성된 디자인의 히스토리 관리 및 캔버스로의 연동

### 1.2 URL
- `/chat/new` (새 세션)
- `/chat/:sessionId` (기존 세션)

### 1.3 레이아웃 참조
- **Header**: Top Navigation (Project > Text to Design 활성화)
- **Side Nav**: 없음 (제거됨)
- **Main Content**: 2-Column Layout (Session List + Chat Area)

---

## 2. 컴포넌트 트리

```
ChatPage
├── Header (Global)
└── MainContent (Flex Container, Full Height)
    ├── SessionListPanel (Left, 320px)
    │   ├── SearchBar
    │   ├── NewChatButton
    │   └── SessionList (Scrollable)
    │       └── SessionItem
    └── ChatArea (Right, 100%)
        ├── MessageList (Scrollable)
        │   ├── SystemMessage
        │   ├── UserMessage
        │   ├── AIMessage
        │   │   └── GeneratedImageGrid
        │   └── TypingIndicator
        ├── InputContainer (Fixed)
        │   ├── ReferenceUpload
        │   ├── TextArea
        │   └── SendButton
        └── ImageHistorySlider (Fixed Bottom, 120px)
            ├── SliderHeader (Optional)
            └── ImageThumbnailList
```

---

## 3. 섹션별 상세 설계

### 3.1 Session List Panel

#### 레이아웃
- **위치**: 왼쪽 사이드
- **너비**: 320px (고정)
- **배경**: Gray-50 (#FAFAFA)
- **보더**: 오른쪽 1px solid Gray-200

#### Search Bar
- **위치**: 상단 고정
- **패딩**: 16px
- **입력창**: 
  - 배경: White
  - 아이콘: Search icon (Gray-400)
  - Placeholder: "Search chats..."

#### New Chat Button
- **위치**: Search Bar 아래
- **마진**: 좌우 16px, 하단 16px
- **스타일**: Primary Button (Full width)
- **아이콘**: Plus icon + "New Chat"

#### Session List
- **영역**: 나머지 높이 (overflow-y: auto)
- **Session Item**:
  - 패딩: 12px 16px
  - 호버: Gray-100 배경
  - 활성 상태: Primary-50 배경 + Primary-500 왼쪽 보더(3px)
  - **내용**:
    - 제목: text-sm, font-medium, Gray-800
    - 미리보기: text-xs, Gray-500, 말줄임 (truncate)
    - 시간: text-xs, Gray-400 (우측 상단)
  - **컨텍스트 메뉴** (우클릭/호버): 이름 변경, 삭제

---

### 3.2 Chat Area

#### 레이아웃
- **위치**: 오른쪽 메인
- **너비**: `calc(100% - 320px)`
- **배경**: White
- **구조**: Flex-col

#### Message List
- **영역**: `flex-1` (스크롤 가능)
- **패딩**: 24px (좌우 최대 800px 중앙 정렬)
- **System Message**:
  - 스타일: 중앙 정렬, text-xs, Gray-400, 배지 형태
- **User Message**:
  - 정렬: 오른쪽
  - 말풍선: Primary-500 배경, White 텍스트
  - 보더 반경: rounded-2xl (rounded-tr-sm)
  - 최대 너비: 70%
- **AI Message**:
  - 정렬: 왼쪽
  - 아바타: Mercury Logo Icon
  - 말풍선: Gray-100 배경, Gray-800 텍스트
  - 보더 반경: rounded-2xl (rounded-tl-sm)
  - **Generated Images**:
    - 메시지 하단에 그리드(2x2 또는 1x1)로 표시
    - 둥근 모서리 (rounded-lg)
    - 클릭 시 이미지 뷰어 모달 오픈
    - 액션 버튼: "Vary", "Upscale", "Edit in Canvas"

#### Input Container
- **위치**: Message List 하단, Image History 상단
- **패딩**: 16px 24px
- **최대 너비**: 900px (중앙 정렬)
- **배경**: White (Gradient overlay at top for scroll fade)
- **Input Box**:
  - 배경: White
  - 보더: 1.5px solid Gray-300 (Focus: Primary-500)
  - 반경: rounded-xl
  - 그림자: shadow-sm
  - **구성**:
    - 왼쪽: 파일 업로드 버튼 (Paperclip icon)
    - 중앙: Textarea (Auto-resize, max 5 rows)
    - 오른쪽: Send 버튼 (ArrowUp icon, Primary color circle)

#### Image History Slider
- **위치**: 최하단 고정
- **높이**: 120px
- **배경**: Gray-50
- **보더**: 상단 1px solid Gray-200
- **패딩**: 10px 0
- **아이템**:
  - 크기: 100x100px
  - 마진: 좌우 8px
  - 스타일: rounded-lg, cover fit
  - 호버: scale(1.05), shadow-md
  - 툴팁: 프롬프트 정보 표시
  - 드래그 앤 드롭: Input Box로 드래그 시 레퍼런스로 추가

---

## 4. 상태 & 인터랙션

### 4.1 로딩 상태 (Typing Indicator)
- AI 메시지 버블 내 `Thinking...` 또는 3-dot animation
- 이미지 생성 중:
  - 플레이스홀더: 스켈레톤 UI + 진행률 표시줄 (Progress Bar)
  - 멘트: "Generating 4 deviations..."

### 4.2 Empty State (New Session)
- 중앙 배치
- 로고 + 환영 메시지 ("What shoe design are you dreaming of today?")
- 추천 프롬프트 칩 (Chips):
  - "Futuristic running shoes with neon lights"
  - "Vintage leather boots, 90s style"
  - "Minimalist white sneakers"

### 4.3 이미지 인터랙션
- **클릭**: Lightbox 모달 (확대 보기)
- **우클릭/메뉴**: 
  - Download
  - Send to Canvas (새 프로젝트 생성)
  - Remix (프롬프트 복사 후 수정)

---

## 5. 애니메이션 (Framer Motion)

### 5.1 메시지 진입
```jsx
const messageVariants = {
  initial: { opacity: 0, y: 10, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.2 }
};
```

### 5.2 이미지 생성 효과
- **Fade In**: 이미지가 로드될 때 부드럽게 나타남
- **Shimmer**: 로딩 중 스켈레톤 효과

### 5.3 사이드바 토글 (옵션, 모바일 대응)
- **AnimatePresence** 사용
- `x: -320` -> `x: 0`

---

## 6. 구현 예시

### 6.1 ChatLayout Component
```jsx
<div className="flex h-[calc(100vh-64px)] overflow-hidden">
  <SessionListPanel />
  <div className="flex flex-col flex-1 relative">
    <MessageList className="flex-1 overflow-y-auto" />
    <InputContainer className="shrink-0" />
    <ImageHistorySlider className="shrink-0 h-[120px]" />
  </div>
</div>
```

---

## 7. 참고 문서
- [Design System](file:///c:/Users/tjwn1/Desktop/mercury_v2_proto/docs/design/design-system.md)
