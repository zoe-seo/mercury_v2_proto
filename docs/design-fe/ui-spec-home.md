# Mercury - Home Page UI Specification

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
![Home Page Visual Prototype](C:/Users/tjwn1/.gemini/antigravity/brain/9c49e5eb-7f9e-4610-9263-9b26050e52ce/home_page_design_1769092128620.png)

---

## 1. 페이지 개요

### 1.1 목적
- Mercury의 대문 역할
- 주요 기능(Text to Design, Sketch to Design)으로의 빠른 진입
- 최근 작업 및 갤러리 하이라이트 제공
- 사용자의 작업 현황 한눈에 파악

### 1.2 URL
- `/` 또는 `/home`

### 1.3 레이아웃 참조
- **Header**: Top Navigation (Home 활성화)
- **Side Nav**: 없음
- **Main Content**: 중앙 정렬, 최대 너비 1400px

---

## 2. 컴포넌트 트리

```
HomePage
├── Header
│   ├── Logo
│   ├── TopNavigation (Home 활성화)
│   └── UserMenu
├── MainContent
│   ├── HeroSection
│   │   ├── Heading
│   │   ├── Subheading
│   │   └── CTACards
│   │       ├── TextToDesignCard
│   │       └── SketchToDesignCard
│   ├── RecentProjectsSection
│   │   ├── SectionHeader
│   │   ├── ProjectGrid (4개)
│   │   └── ViewAllButton
│   ├── GalleryHighlightsSection
│   │   ├── SectionHeader
│   │   ├── DesignGrid (6개, 2x3)
│   │   └── ExploreGalleryButton
│   └── QuickStatsSection (선택 사항)
└── Footer (선택 사항)
```

---

## 3. 섹션별 상세 설계

### 3.1 Hero Section

#### 레이아웃
- **위치**: 페이지 최상단
- **최대 너비**: 1200px (중앙 정렬)
- **패딩**: 상단 80px, 하단 60px
- **배경**: 
  - 옵션 1: 순수 흰색
  - 옵션 2: 매우 연한 그라데이션 (Primary-50 → White)
  - 옵션 3: 추상적인 신발 일러스트 배경 (매우 연하게)

#### Heading
- **텍스트**: "Transform Your Ideas into Shoe Designs"
- **폰트**: font-heading, text-4xl (36px), font-bold
- **색상**: Gray-800
- **정렬**: 중앙
- **애니메이션**: Fade In + Slide Up (0.5s delay)

#### Subheading
- **텍스트**: "AI-powered design generation and management platform for footwear designers"
- **폰트**: font-sans, text-lg (18px), font-normal
- **색상**: Gray-600
- **정렬**: 중앙
- **여백**: 상단 16px (space-4)
- **애니메이션**: Fade In + Slide Up (0.6s delay)

#### CTA Cards

**레이아웃**
- **배치**: 2개 카드, 가로 배치 (Flexbox 또는 Grid)
- **간격**: 24px (space-6)
- **여백**: 상단 48px (space-12)

**Text to Design Card**
```
구조:
┌─────────────────────────┐
│   💬 (아이콘, 48px)      │
│                         │
│   Text to Design        │ (제목)
│   Chat with AI to       │ (설명)
│   create designs        │
│                         │
│   [Start →]             │ (버튼)
└─────────────────────────┘
```

- **크기**: 너비 280px, 높이 자동
- **배경**: White
- **보더**: 2px solid Primary-200
- **보더 반경**: rounded-2xl (20px)
- **패딩**: 32px (space-8)
- **그림자**: shadow
- **호버 효과**:
  - 배경: Primary-50
  - 보더: Primary-400
  - 그림자: shadow-primary
  - 변환: translateY(-6px)
  - 전환: 0.3s ease-out
- **아이콘**: 
  - 크기: 48px
  - 색상: Primary-500
  - 여백 하단: 16px
- **제목**:
  - 폰트: font-heading, text-xl (20px), font-semibold
  - 색상: Gray-800
  - 여백 하단: 8px
- **설명**:
  - 폰트: font-sans, text-sm (14px), font-normal
  - 색상: Gray-600
  - 여백 하단: 24px
- **버튼**:
  - Primary Button 스타일
  - 전체 너비
  - 텍스트: "Start" + 화살표 아이콘

**Sketch to Design Card**
- 동일한 스타일
- 아이콘: 🎨 (Palette 아이콘)
- 제목: "Sketch to Design"
- 설명: "Draw on canvas and generate designs"
- 버튼: "Start" → `/canvas/new`

**애니메이션**
- Stagger Children (0.1s 간격)
- 각 카드: Fade In + Slide Up

---

### 3.2 Recent Projects Section

#### 레이아웃
- **여백**: 상단 80px (space-20)
- **최대 너비**: 1400px

#### Section Header
- **제목**: "Recent Projects"
- **폰트**: font-heading, text-2xl (24px), font-bold
- **색상**: Gray-800
- **여백 하단**: 24px (space-6)
- **추가 요소**: 
  - 우측에 "View All →" 링크 (text-sm, Primary-600)

#### Project Grid
- **레이아웃**: 4개 카드, Grid (4열)
- **간격**: 16px (space-4)
- **반응형**:
  - Desktop (≥1280px): 4열
  - Tablet (768-1279px): 2열
  - Mobile (<768px): 1열

#### Project Card
```
구조:
┌─────────────────────┐
│                     │
│   [썸네일 이미지]     │ (16:9 비율)
│                     │
├─────────────────────┤
│ Project Name        │
│ 2 hours ago  [Chat] │ (시간 + 타입 배지)
└─────────────────────┘
```

- **썸네일**:
  - 비율: 16:9
  - 배경: Gray-100 (이미지 없을 시)
  - 보더 반경: rounded-t-xl (상단만)
  - 객체 맞춤: object-cover
- **내용 영역**:
  - 패딩: 16px (space-4)
  - 배경: White
  - 보더 반경: rounded-b-xl (하단만)
- **프로젝트 이름**:
  - 폰트: font-sans, text-base, font-semibold
  - 색상: Gray-800
  - 말줄임: 1줄
- **메타 정보**:
  - 폰트: text-xs, font-normal
  - 색상: Gray-500
  - 레이아웃: Flexbox (시간 + 배지)
- **타입 배지**:
  - 배경: Primary-100 (Chat) / Accent-100 (Canvas)
  - 텍스트: Primary-700 / Accent-700
  - 패딩: 4px 8px
  - 보더 반경: rounded-full
  - 폰트: text-xs, font-medium
- **전체 카드**:
  - 보더: 1px solid Gray-200
  - 보더 반경: rounded-xl
  - 그림자: shadow
  - 호버: shadow-md, translateY(-2px)
  - 커서: pointer

#### View All Button
- **위치**: 그리드 하단 중앙
- **여백**: 상단 24px
- **스타일**: Ghost Button
- **텍스트**: "View All Projects" + 화살표 아이콘

**Empty State** (프로젝트 없을 시)
- 아이콘: 빈 폴더 아이콘 (48px, Gray-400)
- 텍스트: "No projects yet. Start creating!"
- 버튼: "Create New Project"

---

### 3.3 Gallery Highlights Section

#### 레이아웃
- **여백**: 상단 80px (space-20)
- **최대 너비**: 1400px

#### Section Header
- **제목**: "Gallery Highlights"
- **폰트**: font-heading, text-2xl (24px), font-bold
- **색상**: Gray-800
- **여백 하단**: 24px (space-6)
- **추가 요소**: 
  - 우측에 "Explore Gallery →" 링크 (text-sm, Primary-600)

#### Design Grid
- **레이아웃**: 6개 카드, Grid (3열 2행)
- **간격**: 24px (space-6)
- **반응형**:
  - Desktop (≥1280px): 3열
  - Tablet (768-1279px): 2열
  - Mobile (<768px): 1열

#### Design Card
```
구조:
┌─────────────────────┐
│                     │
│                     │
│   [디자인 이미지]     │ (1:1 비율)
│                     │
│                     │
│  ┌─────────────────┐│ (호버 시 오버레이)
│  │ Design Name     ││
│  │ Jan 22, 2026    ││
│  └─────────────────┘│
└─────────────────────┘
```

- **이미지**:
  - 비율: 1:1 (정사각형)
  - 배경: Gray-100 (이미지 없을 시)
  - 보더 반경: rounded-xl
  - 객체 맞춤: object-cover
- **오버레이** (호버 시):
  - 배경: linear-gradient(to top, rgba(0,0,0,0.7), transparent)
  - 위치: 하단
  - 패딩: 16px
  - 애니메이션: Fade In (0.2s)
- **디자인 이름**:
  - 폰트: font-sans, text-base, font-semibold
  - 색상: White
  - 말줄임: 1줄
- **생성 날짜**:
  - 폰트: text-xs, font-normal
  - 색상: Gray-300
- **전체 카드**:
  - 보더: 1px solid Gray-200
  - 보더 반경: rounded-xl
  - 그림자: shadow
  - 호버: shadow-lg, scale(1.02)
  - 커서: pointer
  - 전환: 0.3s ease-out

#### Explore Gallery Button
- **위치**: 그리드 하단 중앙
- **여백**: 상단 24px
- **스타일**: Ghost Button
- **텍스트**: "Explore Gallery" + 화살표 아이콘

**Empty State** (디자인 없을 시)
- 아이콘: 빈 갤러리 아이콘 (48px, Gray-400)
- 텍스트: "No designs yet. Create your first design!"
- 버튼: "Start Creating"

---

### 3.4 Quick Stats Section (선택 사항)

#### 레이아웃
- **위치**: Gallery 섹션 하단
- **여백**: 상단 60px, 하단 80px
- **정렬**: 중앙

#### 내용
- **레이아웃**: Flexbox, 가로 배치
- **간격**: 32px (space-8)
- **각 Stat**:
  - 아이콘 + 레이블 + 값
  - 예: "📊 Total Designs: 24"
- **폰트**: text-sm, font-medium
- **색상**: Gray-600
- **구분선**: 1px solid Gray-300 (각 stat 사이)

**Stats 항목**:
1. Total Designs: 24
2. This Week: 5
3. Storage: 2.3GB

---

## 4. 상태 & 인터랙션

### 4.1 로딩 상태

**Initial Load**
- Hero Section: 즉시 표시
- Recent Projects: 스켈레톤 로딩 (4개 카드 형태)
- Gallery Highlights: 스켈레톤 로딩 (6개 카드 형태)

**Skeleton Card**
```
┌─────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │ (애니메이션 펄스)
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
├─────────────────────┤
│ ▓▓▓▓▓▓▓▓▓          │
│ ▓▓▓▓▓  ▓▓▓         │
└─────────────────────┘
```

### 4.2 Empty States

**No Projects**
- 아이콘 + 메시지 + CTA 버튼
- 중앙 정렬
- 부드러운 색상 (Gray-400)

**No Designs**
- 동일한 패턴

### 4.3 클릭 인터랙션

**CTA Cards**
- 클릭 → 해당 페이지로 이동 (`/chat/new` 또는 `/canvas/new`)
- 애니메이션: Scale down (0.98) on tap

**Project Card**
- 클릭 → 프로젝트 상세 페이지 (`/chat/:sessionId` 또는 `/canvas/:projectId`)

**Design Card**
- 클릭 → 디자인 상세 페이지 (`/gallery/:designId`)

**View All / Explore Buttons**
- 클릭 → 해당 페이지로 이동 (`/gallery` 또는 `/gallery/projects`)

---

## 5. 애니메이션 (Framer Motion)

### 5.1 페이지 진입

```jsx
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const pageTransition = {
  duration: 0.3,
  ease: [0, 0, 0.2, 1]
};
```

### 5.2 Hero Section

```jsx
const heroVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};
```

### 5.3 CTA Cards

```jsx
const cardHover = {
  y: -6,
  boxShadow: "0 8px 20px rgba(20, 174, 92, 0.3)",
  borderColor: "#3FCF98",
  backgroundColor: "#E8F9F0"
};

const cardTap = {
  scale: 0.98
};
```

### 5.4 Project/Design Cards

```jsx
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const gridVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};
```

---

## 6. 반응형 디자인

### 6.1 Desktop (≥ 1280px)
- Hero Section: 최대 너비 1200px
- Project Grid: 4열
- Gallery Grid: 3열
- 모든 요소 정상 표시

### 6.2 Tablet (768px - 1279px)
- Hero Section: 최대 너비 900px
- CTA Cards: 2개 유지 (약간 작게)
- Project Grid: 2열
- Gallery Grid: 2열
- Quick Stats: 세로 배치

### 6.3 Mobile (< 768px)
- Hero Section: 패딩 감소 (좌우 16px)
- Heading: text-3xl (30px)
- CTA Cards: 세로 배치 (1열)
- Project Grid: 1열
- Gallery Grid: 1열
- Quick Stats: 세로 배치, 간격 감소

---

## 7. 접근성

### 7.1 시맨틱 HTML
```html
<main>
  <section aria-label="Hero">
    <h1>Transform Your Ideas into Shoe Designs</h1>
    <p>AI-powered design generation...</p>
    <div role="group" aria-label="Quick actions">
      <a href="/chat/new" aria-label="Start text to design">...</a>
      <a href="/canvas/new" aria-label="Start sketch to design">...</a>
    </div>
  </section>
  
  <section aria-label="Recent Projects">
    <h2>Recent Projects</h2>
    <div role="list">...</div>
  </section>
  
  <section aria-label="Gallery Highlights">
    <h2>Gallery Highlights</h2>
    <div role="list">...</div>
  </section>
</main>
```

### 7.2 키보드 네비게이션
- 모든 카드 및 버튼: Tab으로 접근 가능
- Enter/Space: 활성화
- 포커스 표시: outline 2px solid Primary-500

### 7.3 ARIA 레이블
- 모든 링크 및 버튼: 명확한 aria-label
- 이미지: alt 텍스트 제공
- 섹션: aria-label로 구분

---

## 8. 성능 최적화

### 8.1 이미지 최적화
- **썸네일**: WebP 포맷, 최대 400x400px
- **Lazy Loading**: Intersection Observer 사용
- **Placeholder**: 블러 이미지 또는 Gray-100 배경

### 8.2 데이터 로딩
- **Recent Projects**: 최대 4개만 로드
- **Gallery Highlights**: 최대 6개만 로드
- **Pagination**: "View All" 클릭 시 전체 로드

### 8.3 애니메이션
- **Reduced Motion**: prefers-reduced-motion 미디어 쿼리 지원
- **GPU 가속**: transform, opacity만 사용

---

## 9. 구현 예시 (React + Framer Motion)

### 9.1 HomePage Component

```jsx
import { motion } from 'framer-motion';
import { MessageCircle, Palette, ArrowRight } from 'lucide-react';

const HomePage = () => {
  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-[1400px] mx-auto px-8"
    >
      <HeroSection />
      <RecentProjectsSection />
      <GalleryHighlightsSection />
      <QuickStatsSection />
    </motion.main>
  );
};
```

### 9.2 HeroSection Component

```jsx
const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-[1200px] mx-auto text-center pt-20 pb-16"
    >
      <motion.h1
        variants={itemVariants}
        className="font-heading text-4xl font-bold text-gray-800"
      >
        Transform Your Ideas into Shoe Designs
      </motion.h1>
      
      <motion.p
        variants={itemVariants}
        className="text-lg text-gray-600 mt-4"
      >
        AI-powered design generation and management platform for footwear designers
      </motion.p>

      <motion.div
        variants={itemVariants}
        className="flex gap-6 justify-center mt-12"
      >
        <CTACard
          icon={MessageCircle}
          title="Text to Design"
          description="Chat with AI to create designs"
          href="/chat/new"
        />
        <CTACard
          icon={Palette}
          title="Sketch to Design"
          description="Draw on canvas and generate designs"
          href="/canvas/new"
        />
      </motion.div>
    </motion.section>
  );
};
```

### 9.3 CTACard Component

```jsx
const CTACard = ({ icon: Icon, title, description, href }) => {
  return (
    <motion.a
      href={href}
      className="w-[280px] p-8 bg-white border-2 border-primary-200 rounded-2xl shadow hover:bg-primary-50 hover:border-primary-400 hover:shadow-primary cursor-pointer"
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
    >
      <Icon size={48} className="text-primary-500 mb-4" />
      <h3 className="font-heading text-xl font-semibold text-gray-800 mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        {description}
      </p>
      <button className="w-full px-6 py-3 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 flex items-center justify-center gap-2">
        Start <ArrowRight size={16} />
      </button>
    </motion.a>
  );
};
```

---

## 10. 참고 문서

- [Layout Template](file:///c:/Users/tjwn1/Desktop/mercury_v2_proto/docs/design/layout-template.md)
- [Design System](file:///c:/Users/tjwn1/Desktop/mercury_v2_proto/docs/design/design-system.md)
- [Service Summary](file:///c:/Users/tjwn1/Desktop/mercury_v2_proto/docs/service-summary.md)

---

**문서 버전**: 1.0  
**최종 수정일**: 2026-01-22  
**작성자**: UI/UX Designer  
**상태**: ✅ Approved
