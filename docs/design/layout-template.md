# Mercury - Global Layout Template

## 문서 정보
- **작성일**: 2026-01-22
- **작성자**: UI/UX Designer
- **상태**: ✅ Approved
- **버전**: 1.0

---

## 1. 전체 레이아웃 아키텍처

### 1.1 구조 개요

Mercury는 **Header + Top Navigation + Conditional Side Navigation + Main Content** 구조를 사용합니다.

```
┌───────────────────────────────────────────────────────────────┐
│  Header (고정, 전체 너비, 높이: 64px)                            │
│  ┌──────────┬────────────────────────────────┬──────────────┐ │
│  │  Logo    │  Top Navigation (중앙)          │  User Menu   │ │
│  │          │  Home | Project | Development  │              │ │
│  │          │  Marketing | Support            │              │ │
│  └──────────┴────────────────────────────────┴──────────────┘ │
├───────────┬───────────────────────────────────────────────────┤
│           │                                                   │
│  Side Nav │         Main Content Area                        │
│  (조건부)  │         (페이지별 콘텐츠)                           │
│           │                                                   │
└───────────┴───────────────────────────────────────────────────┘
```

### 1.2 설계 원칙

- **확장 가능성**: Top Navigation으로 새로운 기능 영역 추가 용이
- **계층적 네비게이션**: Top Nav (1차) → Side Nav (2차) 구조
- **반응형**: Desktop First, 작은 화면에서는 Side Nav 접기/오버레이
- **일관성**: 모든 페이지에서 동일한 Header 유지

---

## 2. Header 상세 설계

### 2.1 레이아웃 (3단 구조)

| 영역 | 너비 | 내용 |
|------|------|------|
| **왼쪽** | 20% | Mercury 로고 + 서비스명 |
| **중앙** | 60% | Top Navigation |
| **오른쪽** | 20% | 테마 토글, 알림, 사용자 프로필 |

### 2.2 Top Navigation

#### 메뉴 구조
- **Home**: 대시보드 (Side Nav 없음)
- **Project**: Text to Design, Sketch to Design, Gallery (Side Nav 표시)
- **Development**: 신발 모델 개발 관련 (Manufacturing Docs, Parts & Materials 등, Side Nav 표시, 추후 확장)
- **Marketing**: Analytics, Campaigns, Reports (Side Nav 표시, 추후 확장)
- **Support**: Help Center, Contact, FAQ (Side Nav 표시, 추후 확장)

#### UI 특징
- 현재 활성 탭: 언더라인 또는 배경색 하이라이트
- 호버 효과: 부드러운 색상 전환
- 반응형: 작은 화면에서는 햄버거 메뉴로 전환

### 2.3 우측 유틸리티

- **테마 토글**: 라이트/다크 모드 전환 (아이콘 버튼)
- **알림**: 벨 아이콘 (뱃지로 개수 표시)
- **사용자 프로필**: 아바타 + 드롭다운 (Settings, Logout)

---

## 3. Side Navigation 상세 설계

### 3.1 표시 조건

- **Home 탭**: Side Nav 숨김
- **기타 탭**: 해당 탭의 하위 메뉴 표시

### 3.2 너비 및 동작

- **기본 너비**: 240px
- **접기 기능**: 토글 버튼으로 숨김/표시
- **접힌 상태**: 아이콘만 표시 (너비 64px)
- **반응형**: 768px 이하에서는 오버레이 방식

### 3.3 탭별 메뉴 구조 (Context-aware Injection)

Side Navigation은 **범용 컴포넌트(Generic Component)**로 설계되어, 상위 탭(Context)에 따라 다른 메뉴 리스트를 주입받아 렌더링합니다.

#### Project 탭 (Context: Project)
```
[Header: PROJECT]
  ⭐ Recent Designs  (기본 선택)
  🎨 My Canvases
  💬 My Chats
  📂 My Projects
  📊 Analytics (추후)
```

#### Development 탭 (Context: Development - 추후 구현)
```
[Header: DEVELOPMENT]
  📋 Manufacturing Docs
  🔧 Parts & Materials
  📐 Specifications
  📊 Production Timeline
```

#### Marketing 탭 (Context: Marketing - 추후 구현)
```
[Header: MARKETING]
  📊 Analytics
  📢 Campaigns
  📄 Reports
```

#### Support 탭 (Context: Support - 추후 구현)
```
[Header: SUPPORT]
  📚 Help Center
  📧 Contact
  ❓ FAQ
```

### 3.4 UI 특징

- 현재 활성 메뉴: 배경색 + 왼쪽 보더 하이라이트
- 아이콘 + 텍스트 조합 (접힌 상태에서는 아이콘만)
- 호버 시 배경색 변경

---

## 4. Main Content Area

### 4.1 기본 설정

- **너비**: `calc(100vw - [Side Nav Width] - [Header Width])`
- **패딩**: 좌우 32px, 상하 24px
- **최대 너비**: 
  - 일반 페이지: 1400px (중앙 정렬)
  - 캔버스 페이지: 100% (무한 캔버스)
- **배경**: 페이지별로 다를 수 있음

### 4.2 페이지별 특성

#### 일반 페이지 (Home, Gallery, Settings)
- Header + Side Nav (조건부) + Main Content
- Main Content는 중앙 정렬, 최대 너비 제한

#### Chat Interface
- 3-Column Layout (상세는 섹션 5 참조)

#### Canvas Interface
- Full-screen (상세는 섹션 6 참조)

---

## 5. Chat Interface 상세 설계

### 5.1 레이아웃 구조 (2-Column)

```
┌──────────────┬──────────────────────────────────────────┐
│ Session List │  Chat Area                               │
│ (320px)      │  (나머지 영역)                             │
│              │                                          │
│ 🔍 Search    │  ┌────────────────────────────────────┐  │
│              │  │  Chat Messages                     │  │
│ 📝 New Chat  │  │  (스크롤 영역)                      │  │
│              │  │                                    │  │
│ Session 1    │  └────────────────────────────────────┘  │
│ Session 2    │                                          │
│ Session 3    │  ┌────────────────────────────────────┐  │
│ ...          │  │  Input Area                        │  │
│              │  └────────────────────────────────────┘  │
│              │                                          │
│              │  📸 Image History (120px)                │
│              │  [img1][img2][img3][img4]...            │
└──────────────┴──────────────────────────────────────────┘
```

> **참고**: Side Nav는 Header의 Top Navigation으로 충분하므로 제거했습니다.

### 5.2 Session List Panel (320px)

#### 상단
- **검색 바**: 세션 제목 검색 (아이콘 + 입력창)
- **New Chat 버튼**: Primary CTA, 전체 너비

#### 세션 리스트
- **정렬**: 최신순
- **카드 내용**:
  - 세션 제목 (1줄, 말줄임)
  - 마지막 메시지 미리보기 (1줄, 말줄임)
  - 시간 (상대 시간, 예: "2 hours ago")
- **현재 세션**: 배경색 하이라이트
- **호버 시**: 삭제/이름 변경 버튼 표시

#### 접기 기능
- 토글 버튼으로 패널 숨김
- Chat Area 확장

### 5.3 Chat Area

#### Chat Messages (상단, 스크롤 영역)
- **AI 메시지**: 
  - 왼쪽 정렬
  - 회색 배경
  - AI 아바타 아이콘
- **사용자 메시지**:
  - 오른쪽 정렬
  - Primary 색상 배경
  - 사용자 아바타 아이콘
- **이미지 표시**:
  - 메시지 내 인라인 표시
  - 클릭 시 확대 모달

#### Input Area (중단, 고정)
- **텍스트 입력창**: 
  - 멀티라인 지원 (최대 5줄)
  - Placeholder: "Describe your design idea..."
- **도구 버튼**:
  - 레퍼런스 이미지 업로드 (📎)
  - Send 버튼 (➤)
- **레이아웃**: Flexbox, 입력창 + 버튼

#### Image History Slider (하단, 고정 120px)
- **레이아웃**: 가로 스크롤 슬라이더
- **썸네일**: 100x100px 정사각형, 간격 8px
- **기능**:
  - 클릭 → 큰 이미지 모달
  - 우클릭 메뉴: "다운로드", "프롬프트 재사용", "캔버스로 보내기"
  - 드래그 앤 드롭 → Input Area에 레퍼런스 추가
- **표시**: 현재 세션의 생성 이미지만 (시간순)

---

## 6. Canvas Interface 상세 설계

### 6.1 레이아웃 구조 (Full-screen)

```
┌───────────────────────────────────────────────────────┐
│  Header (Top Nav: Project > Sketch to Design)        │
├───────────────────────────────────────────────────────┤
│                                                       │
│  ┌──────────────────────────────────────┐            │
│  │ Toolbar (Floating, 상단 중앙)         │            │
│  │ [Select][Brush][Shape] | [Undo][Redo]│            │
│  └──────────────────────────────────────┘            │
│                                                       │
│ ┌──┐                                          ┌────┐ │
│ │T │         Infinite Canvas                  │ L  │ │
│ │o │         (무한 캔버스)                      │ a  │ │
│ │o │                                          │ y  │ │
│ │l │                                          │ e  │ │
│ │s │                                          │ r  │ │
│ └──┘                                          │ s  │ │
│                                               └────┘ │
└───────────────────────────────────────────────────────┘
```

> **참고**: Toolbar는 전체 너비가 아닌 컴팩트한 floating 컴포넌트로 상단 중앙에 배치됩니다.

### 6.2 구성 요소

#### Header
- Top Navigation: Project > Sketch to Design 활성화
- Side Nav 숨김 (전체 화면 활용)

#### Toolbar (Floating, 상단 중앙)
- **레이아웃**: 컴팩트한 floating 패널 (자동 너비, 높이: 56px)
- **위치**: 상단 중앙, Header 아래 24px
- **내용**: 
  - 왼쪽 그룹: 도구 선택 (Select, Brush, Shape, Text, Eraser)
  - 구분선 (Divider)
  - 오른쪽 그룹: Undo, Redo, Zoom (드롭다운), Export
- **스타일**: 
  - 배경: White, 그림자: shadow-lg
  - 보더 반경: rounded-xl (16px)
  - 패딩: 8px 16px
  - 아이콘 버튼 간격: 4px

#### Tool Panel (왼쪽, 너비: 64px, Floating)
- **Drawing Tools**:
  - 선택 도구 (V)
  - 브러시 (B)
  - 도형 (R)
  - 텍스트 (T)
  - 지우개 (E)
- **아이콘만 표시** (호버 시 툴팁)

#### Layer Panel (오른쪽, 너비: 280px, Floating)
- **레이어 리스트**:
  - 썸네일 + 이름
  - 가시성 토글 (눈 아이콘)
  - 잠금 (자물쇠 아이콘)
- **레이어 순서**: 드래그 앤 드롭으로 변경
- **버튼**: 새 레이어, 레이어 삭제

#### AI Prompt Panel (Floating, 조건부 표시)
- **표시 조건**: 이미지 노드(객체) 선택 시 활성화
- **위치**: 선택된 객체 근처 또는 화면 중앙
- **내용**:
  - 텍스트 입력창 (프롬프트)
  - "Generate" 버튼
  - 옵션: Inpainting, Variation 등
- **닫기**: ESC 키 또는 외부 클릭

#### Infinite Canvas
- **배경**: 어두운 그리드 패턴
- **Zoom**: 마우스 휠 또는 Toolbar
- **Pan**: 스페이스바 + 드래그 또는 중간 버튼 드래그
- **객체 조작**: 선택, 이동, 크기 조정, 회전

---

## 7. Home 페이지 상세 설계

### 7.1 레이아웃 구조

```
┌───────────────────────────────────────────────────────┐
│  Header (Top Nav: Home 활성화, Side Nav 없음)         │
├───────────────────────────────────────────────────────┤
│                                                       │
│  🎯 Hero Section (중앙 정렬, 최대 너비 1200px)         │
│  ┌─────────────────────────────────────────────────┐ │
│  │  "Transform Your Ideas into Shoe Designs"      │ │
│  │                                                 │ │
│  │  ┌──────────────┐  ┌──────────────┐           │ │
│  │  │ 💬 Text to   │  │ 🎨 Sketch to │           │ │
│  │  │   Design     │  │   Design     │           │ │
│  │  │  [Start]     │  │  [Start]     │           │ │
│  │  └──────────────┘  └──────────────┘           │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  📂 Recent Projects (최근 프로젝트, 4개)                │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                   │
│  │ P1  │ │ P2  │ │ P3  │ │ P4  │                   │
│  └─────┘ └─────┘ └─────┘ └─────┘                   │
│  [View All Projects →]                                │
│                                                       │
│  🖼️ Gallery Highlights (갤러리 하이라이트, 6개)         │
│  ┌─────┐ ┌─────┐ ┌─────┐                           │
│  │ D1  │ │ D2  │ │ D3  │                           │
│  └─────┘ └─────┘ └─────┘                           │
│  ┌─────┐ ┌─────┐ ┌─────┐                           │
│  │ D4  │ │ D5  │ │ D6  │                           │
│  └─────┘ └─────┘ └─────┘                           │
│  [Explore Gallery →]                                  │
│                                                       │
│  📊 Quick Stats (선택 사항)                            │
│  Total Designs: 24 | This Week: 5 | Storage: 2.3GB  │
└───────────────────────────────────────────────────────┘
```

### 7.2 섹션별 상세

#### Hero Section
- **제목**: "Transform Your Ideas into Shoe Designs"
- **부제**: "AI-powered design generation and management platform"
- **CTA Cards** (2개, 가로 배치):
  - **Text to Design**:
    - 아이콘: 💬
    - 제목: "Text to Design"
    - 설명: "Chat with AI to create designs"
    - 버튼: "Start" → `/chat/new`
  - **Sketch to Design**:
    - 아이콘: 🎨
    - 제목: "Sketch to Design"
    - 설명: "Draw on canvas and generate"
    - 버튼: "Start" → `/canvas/new`
- **스타일**: 
  - 카드 형태, 호버 시 살짝 떠오르는 효과 (transform: translateY(-4px))
  - 그라데이션 배경 또는 일러스트

#### Recent Projects
- **제목**: "Recent Projects"
- **카드** (4개, 가로 배치):
  - 썸네일 (대표 이미지, 16:9 비율)
  - 프로젝트 이름
  - 마지막 수정 시간
  - 타입 배지 (Chat / Canvas)
- **클릭 시**: 해당 프로젝트로 이동
- **"View All Projects" 버튼**: Project 탭으로 이동

#### Gallery Highlights
- **제목**: "Gallery Highlights"
- **그리드** (6개, 2행 3열):
  - 고품질 썸네일 (1:1 비율)
  - 호버 시: 디자인 이름 + 생성 날짜 오버레이
- **클릭 시**: 디자인 상세 페이지 (`/gallery/:designId`)
- **"Explore Gallery" 버튼**: Gallery 페이지로 이동

#### Quick Stats (선택 사항)
- **표시**: 간단한 통계 정보 (인라인 텍스트)
  - Total Designs: 24
  - This Week: 5
  - Storage: 2.3GB
- **스타일**: 작은 폰트, 회색 텍스트

---

## 8. 반응형 전략

### 8.1 Breakpoints

| 크기 | 너비 | 설명 |
|------|------|------|
| **Desktop** | ≥ 1280px | 기본 레이아웃 |
| **Tablet** | 768px ~ 1279px | Side Nav 접힘 |
| **Mobile** | < 768px | Side Nav 오버레이, 캔버스 기능 제한 |

### 8.2 반응형 동작

#### Desktop (≥ 1280px)
- Header + Top Nav + Side Nav (펼침) + Main Content
- 모든 기능 정상 동작

#### Tablet (768px ~ 1279px)
- Header + Top Nav + Side Nav (접힘, 아이콘만) + Main Content
- Chat: Session List 접기 가능
- Canvas: Tool Panel, Layer Panel 접기 가능

#### Mobile (< 768px)
- Header + Top Nav (햄버거 메뉴) + Main Content
- Side Nav: 오버레이 방식
- Chat: Session List 기본 숨김, 버튼으로 토글
- Canvas: 기능 제한 (읽기 전용 또는 간단한 편집만)

---

## 9. 공통 UI 패턴

### 9.1 버튼

- **Primary**: 주요 액션 (예: "Start", "Send", "Generate")
- **Secondary**: 보조 액션 (예: "Cancel", "View All")
- **Ghost**: 텍스트 버튼 (예: "Learn More")
- **Icon**: 아이콘만 (예: 설정, 알림)

### 9.2 카드

- **기본**: 배경색 + 보더 + 그림자
- **호버**: 그림자 증가 + 살짝 떠오름
- **클릭 가능**: 커서 포인터

### 9.3 입력창

- **텍스트**: 보더 + 포커스 시 Primary 색상
- **검색**: 아이콘 + 입력창
- **멀티라인**: 자동 높이 조절 (최대 제한)

### 9.4 모달

- **배경**: 반투명 오버레이
- **내용**: 중앙 정렬, 최대 너비 600px
- **닫기**: ESC 키 또는 외부 클릭

---

## 10. 접근성 (Accessibility)

- **키보드 네비게이션**: Tab, Enter, ESC 지원
- **포커스 표시**: 명확한 포커스 링
- **ARIA 레이블**: 스크린 리더 지원
- **색상 대비**: WCAG AA 기준 준수

---

## 11. 참고 문서

- [Service Summary](file:///c:/Users/tjwn1/Desktop/mercury_v2_proto/docs/service-summary.md)
- [Design System](file:///c:/Users/tjwn1/Desktop/mercury_v2_proto/docs/design/design-system.md) (작성 예정)
- [UI Specifications](file:///c:/Users/tjwn1/Desktop/mercury_v2_proto/docs/design/) (기능별 작성 예정)

---

**문서 버전**: 1.0  
**최종 수정일**: 2026-01-22  
**작성자**: UI/UX Designer  
**상태**: ✅ Approved
