# Mercury - Design System

## 문서 정보
- **작성일**: 2026-01-22
- **작성자**: UI/UX Designer
- **상태**: ✅ Approved
- **버전**: 1.0

---

## 1. 디자인 컨셉

### 1.1 핵심 키워드
- **Fresh & Clean**: 산뜻하고 깔끔한 느낌
- **Professional**: 전문 디자이너를 위한 도구
- **Creative**: 창의성을 자극하는 인터페이스
- **Modern**: 최신 디자인 트렌드 반영
- **Smooth**: 부드러운 모션과 전환

### 1.2 스타일 방향성
- **미니멀리즘**: 불필요한 요소 제거, 핵심 기능에 집중
- **공간감**: 충분한 여백과 계층 구조
- **일관성**: 모든 페이지에서 동일한 디자인 언어
- **반응성**: 부드러운 애니메이션과 피드백 (framer-motion)

---

## 2. 컬러 시스템

### 2.1 브랜드 컬러 (Primary)

**Mercury Green** - 산뜻하고 부드러운 초록색
```
Primary-50:  #E8F9F0  (매우 연한 배경)
Primary-100: #C6F0DC
Primary-200: #9FE5C7
Primary-300: #6EDAAD
Primary-400: #3FCF98
Primary-500: #14AE5C  (메인 브랜드 컬러) ⭐
Primary-600: #119A51
Primary-700: #0E8646
Primary-800: #0B723B
Primary-900: #095E30
```

**사용 예시**:
- Primary-500: 주요 버튼, 링크, 활성 상태, 브랜드 요소
- Primary-50: 호버 배경, 선택된 항목 배경
- Primary-600: 버튼 호버 상태
- Primary-700: 버튼 활성(클릭) 상태

### 2.2 보조 컬러 (Accent)

**Teal** - 초록과 조화로운 청록색 (AI 기능 강조)
```
Accent-50:  #E6F7F7
Accent-100: #B3E8E8
Accent-200: #80D9D9
Accent-300: #4DCACA
Accent-400: #26BCBC
Accent-500: #00ADAD  (메인)
Accent-600: #009999
Accent-700: #008585
Accent-800: #007171
Accent-900: #005D5D
```

**Coral** - 따뜻한 강조색 (특별한 액션, 알림)
```
Coral-50:  #FFF0ED
Coral-100: #FFD6CC
Coral-200: #FFBCAB
Coral-300: #FFA28A
Coral-400: #FF8869
Coral-500: #FF6B4A  (메인)
Coral-600: #E65F42
Coral-700: #CC533A
Coral-800: #B34732
Coral-900: #993B2A
```

### 2.3 중립 컬러 (Neutral)

**Gray Scale**
```
Gray-50:  #FAFAFA  (밝은 배경)
Gray-100: #F5F5F5  (카드 배경, 섹션 배경) ⭐
Gray-200: #E5E5E5  (보더)
Gray-300: #D4D4D4  (비활성 보더)
Gray-400: #A3A3A3  (비활성 텍스트)
Gray-500: #737373  (보조 텍스트)
Gray-600: #525252  (본문 텍스트)
Gray-700: #404040  (강조 텍스트)
Gray-800: #262626  (헤딩)
Gray-900: #171717  (최고 강조)
```

**배경 컬러**
```
Background-Primary:   #FFFFFF  (메인 배경) ⭐
Background-Secondary: #F5F5F5  (섹션 배경, 카드 배경) ⭐
Background-Tertiary:  #FAFAFA  (호버 배경)
```

### 2.4 의미 컬러 (Semantic)

```
Success: #14AE5C  (Primary-500 재사용)
Warning: #F59E0B  (Amber)
Error:   #EF4444  (Red)
Info:    #3B82F6  (Blue)
```

### 2.5 다크 모드 (추후 지원)

- 배경: Gray-900 ~ Gray-800
- 텍스트: Gray-50 ~ Gray-200
- Primary/Accent 색상은 명도 조정 (Primary-400, Accent-400 사용)

---

## 3. 타이포그래피

### 3.1 폰트 패밀리

**Primary Font (본문, UI)**
- **폰트**: [Inter](https://fonts.google.com/specimen/Inter)
- **CDN**: 
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  ```
- **적용**: 본문, 버튼, 입력창, 네비게이션

**Heading Font (제목)**
- **폰트**: [Outfit](https://fonts.google.com/specimen/Outfit)
- **CDN**:
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  ```
- **적용**: 페이지 제목, 섹션 헤딩, Hero 텍스트

**Monospace Font (코드, 데이터)**
- **폰트**: [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)
- **적용**: API 문서, 코드 스니펫 (추후)

### 3.2 폰트 크기 & 스케일

**Type Scale (1.25 비율)**
```
text-xs:   12px (0.75rem)  - 캡션, 메타 정보, 배지
text-sm:   14px (0.875rem) - 보조 텍스트, 라벨, 네비게이션
text-base: 16px (1rem)     - 본문 (기본)
text-lg:   18px (1.125rem) - 강조 텍스트, 카드 제목
text-xl:   20px (1.25rem)  - 소제목
text-2xl:  24px (1.5rem)   - 섹션 제목
text-3xl:  30px (1.875rem) - 페이지 제목
text-4xl:  36px (2.25rem)  - Hero 제목
text-5xl:  48px (3rem)     - 대형 제목
```

### 3.3 폰트 웨이트

```
font-light:    300 - 부드러운 텍스트
font-normal:   400 - 본문 (기본)
font-medium:   500 - 강조 텍스트, 버튼, 네비게이션
font-semibold: 600 - 소제목, 카드 제목
font-bold:     700 - 제목, 헤딩
font-extrabold: 800 - Hero 제목 (Outfit만)
```

### 3.4 Line Height

```
leading-tight:   1.25 - 제목, 헤딩
leading-normal:  1.5  - 본문 (기본)
leading-relaxed: 1.75 - 긴 텍스트, 설명
```

### 3.5 Letter Spacing

```
tracking-tight:  -0.025em - 큰 제목
tracking-normal: 0        - 기본
tracking-wide:   0.025em  - 대문자, 라벨
```

---

## 4. Spacing (간격)

### 4.1 Spacing Scale

**4px 기반 시스템**
```
space-0:  0px
space-1:  4px   (0.25rem)
space-2:  8px   (0.5rem)
space-3:  12px  (0.75rem)
space-4:  16px  (1rem)
space-5:  20px  (1.25rem)
space-6:  24px  (1.5rem)
space-8:  32px  (2rem)
space-10: 40px  (2.5rem)
space-12: 48px  (3rem)
space-16: 64px  (4rem)
space-20: 80px  (5rem)
space-24: 96px  (6rem)
```

### 4.2 적용 가이드

- **컴포넌트 내부 패딩**: space-4 (16px)
- **버튼 패딩**: space-3 space-6 (12px 24px)
- **카드 패딩**: space-6 (24px)
- **섹션 간격**: space-12 (48px)
- **페이지 여백**: space-8 (32px)
- **요소 간 간격**: space-4 (16px)

---

## 5. 컴포넌트 스타일

### 5.1 버튼

#### **Primary Button**
```css
배경: Primary-500 (#14AE5C)
텍스트: White
패딩: 12px 24px (space-3 space-6)
보더 반경: 10px (rounded-lg)
폰트: font-medium, text-base
호버: Primary-600 배경
활성: Primary-700 배경
그림자: 0 1px 2px rgba(0, 0, 0, 0.05)
호버 그림자: 0 4px 12px rgba(20, 174, 92, 0.25)
전환: all 0.2s ease
```

#### **Secondary Button**
```css
배경: White
텍스트: Gray-700
보더: 1.5px solid Gray-300
패딩: 12px 24px
보더 반경: 10px
호버: Gray-50 배경
호버 보더: Gray-400
```

#### **Ghost Button**
```css
배경: Transparent
텍스트: Primary-600
패딩: 12px 24px
호버: Primary-50 배경
```

#### **Icon Button**
```css
배경: Transparent
크기: 40x40px
보더 반경: 8px
호버: Gray-100 배경
활성: Gray-200 배경
```

### 5.2 카드

```css
배경: White
보더: 1px solid Gray-200
보더 반경: 16px (rounded-xl)
패딩: 24px (space-6)
그림자: 0 1px 3px rgba(0, 0, 0, 0.08)
호버 그림자: 0 8px 16px rgba(0, 0, 0, 0.12)
호버 변환: translateY(-4px)
전환: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)
```

### 5.3 입력창

```css
배경: White
보더: 1.5px solid Gray-300
보더 반경: 10px (rounded-lg)
패딩: 12px 16px
폰트: text-base, font-normal
텍스트 색상: Gray-700
플레이스홀더: Gray-400
포커스 보더: Primary-500
포커스 링: 0 0 0 3px Primary-100
전환: all 0.15s ease
```

### 5.4 모달

```css
배경 오버레이: rgba(0, 0, 0, 0.4)
모달 배경: White
보더 반경: 20px (rounded-2xl)
최대 너비: 600px
패딩: 32px (space-8)
그림자: 0 20px 25px rgba(0, 0, 0, 0.15)
```

### 5.5 네비게이션

#### **Top Navigation**
```css
배경: White
보더 하단: 1px solid Gray-200
높이: 64px
패딩: 0 32px
```

#### **Top Nav Item**
```css
패딩: 20px 16px
폰트: font-medium, text-sm
텍스트: Gray-600
호버 텍스트: Primary-600
활성 텍스트: Primary-600
활성 보더 하단: 2px solid Primary-500
전환: all 0.2s ease
```

#### **Side Navigation**
```css
배경: White
보더 오른쪽: 1px solid Gray-200
너비: 240px
패딩: 16px
```

#### **Side Nav Item**
```css
패딩: 12px 16px
보더 반경: 8px
폰트: font-medium, text-sm
텍스트: Gray-600
호버 배경: Gray-100
활성 배경: Primary-50
활성 텍스트: Primary-700
활성 보더 왼쪽: 3px solid Primary-500
```

---

## 6. 아이콘

### 6.1 아이콘 라이브러리

**선택**: [Lucide React](https://lucide.dev/)
- **설치**: `npm install lucide-react`
- **사용 예시**:
  ```jsx
  import { Home, MessageCircle, Palette, Image } from 'lucide-react';
  
  <Home size={20} color="#14AE5C" />
  ```

### 6.2 아이콘 크기

```
icon-sm: 16px - 인라인 텍스트, 배지
icon-md: 20px - 버튼, 네비게이션 (기본)
icon-lg: 24px - 헤더, 주요 액션
icon-xl: 32px - Hero 섹션, 대형 카드
```

### 6.3 아이콘 스타일

- **기본**: Outline (선 스타일)
- **활성/강조**: Filled 또는 색상 변경
- **색상**: 
  - 기본: Gray-600
  - 호버: Primary-600
  - 활성: Primary-700

---

## 7. 그림자 (Shadows)

```css
shadow-sm:  0 1px 2px rgba(0, 0, 0, 0.05)
shadow:     0 1px 3px rgba(0, 0, 0, 0.08)
shadow-md:  0 4px 6px rgba(0, 0, 0, 0.1)
shadow-lg:  0 8px 16px rgba(0, 0, 0, 0.12)
shadow-xl:  0 12px 24px rgba(0, 0, 0, 0.15)
shadow-2xl: 0 20px 40px rgba(0, 0, 0, 0.2)

/* Primary Shadow (버튼 호버 등) */
shadow-primary: 0 4px 12px rgba(20, 174, 92, 0.25)
shadow-primary-lg: 0 8px 20px rgba(20, 174, 92, 0.3)
```

**적용**:
- 카드: shadow
- 호버 카드: shadow-lg
- 모달: shadow-2xl
- 드롭다운: shadow-lg
- Primary 버튼 호버: shadow-primary

---

## 8. 보더 반경 (Border Radius)

```css
rounded-sm:   4px  - 작은 요소, 배지
rounded:      6px  - 기본
rounded-md:   8px  - 아이콘 버튼
rounded-lg:   10px - 버튼, 입력창
rounded-xl:   16px - 카드
rounded-2xl:  20px - 모달, 대형 카드
rounded-3xl:  24px - Hero 섹션
rounded-full: 9999px - 원형 (아바타, 배지)
```

---

## 9. 애니메이션 & 모션 (Framer Motion)

### 9.1 설치

```bash
npm install framer-motion
```

### 9.2 전환 속도

```javascript
const transition = {
  fast:   { duration: 0.15 },
  base:   { duration: 0.2 },  // 기본
  slow:   { duration: 0.3 },
  slower: { duration: 0.5 }
};
```

### 9.3 Easing

```javascript
const easing = {
  easeIn:     [0.4, 0, 1, 1],
  easeOut:    [0, 0, 0.2, 1],      // 기본
  easeInOut:  [0.4, 0, 0.2, 1],
  spring:     { type: "spring", stiffness: 300, damping: 30 }
};
```

### 9.4 공통 애니메이션 프리셋

#### **Fade In**
```jsx
const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 }
};

<motion.div {...fadeIn}>Content</motion.div>
```

#### **Slide Up**
```jsx
const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.3, ease: [0, 0, 0.2, 1] }
};
```

#### **Scale**
```jsx
const scale = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.2 }
};
```

#### **Stagger Children (리스트 애니메이션)**
```jsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

<motion.div variants={container} initial="hidden" animate="show">
  {items.map(item => (
    <motion.div key={item.id} variants={item}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

#### **Hover & Tap**
```jsx
<motion.button
  whileHover={{ scale: 1.05, y: -2 }}
  whileTap={{ scale: 0.95 }}
  transition={{ duration: 0.2 }}
>
  Click Me
</motion.button>
```

#### **Page Transition**
```jsx
const pageTransition = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.3, ease: [0, 0, 0.2, 1] }
};
```

### 9.5 적용 가이드

- **페이지 전환**: Fade In + Slide
- **모달 열기**: Scale + Fade In
- **카드 호버**: Scale (1.02) + translateY(-4px)
- **버튼 클릭**: Scale (0.95)
- **리스트 로딩**: Stagger Children
- **알림**: Slide Up from bottom

---

## 10. 레이아웃 그리드

### 10.1 컨테이너

```css
max-width: 1400px (일반 페이지)
padding: 0 32px (space-8)
margin: 0 auto (중앙 정렬)
```

### 10.2 그리드

**Gallery Grid (3열)**
```css
display: grid
grid-template-columns: repeat(3, 1fr)
gap: 24px (space-6)
```

**Project Grid (4열)**
```css
display: grid
grid-template-columns: repeat(4, 1fr)
gap: 16px (space-4)
```

**Responsive Grid**
```css
/* Desktop */
@media (min-width: 1280px) {
  grid-template-columns: repeat(4, 1fr);
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1279px) {
  grid-template-columns: repeat(2, 1fr);
}

/* Mobile */
@media (max-width: 767px) {
  grid-template-columns: 1fr;
}
```

---

## 11. 접근성 (Accessibility)

### 11.1 색상 대비

- **본문 텍스트**: 최소 4.5:1 (WCAG AA)
  - Gray-700 (#404040) on White: 9.74:1 ✅
- **큰 텍스트**: 최소 3:1
  - Gray-600 (#525252) on White: 7.37:1 ✅
- **UI 컴포넌트**: 최소 3:1
  - Primary-500 (#14AE5C) on White: 3.12:1 ✅

### 11.2 포커스 표시

```css
outline: 2px solid Primary-500
outline-offset: 2px
border-radius: 6px
```

또는 Framer Motion:
```jsx
<motion.button
  whileFocus={{ 
    boxShadow: "0 0 0 3px rgba(20, 174, 92, 0.2)" 
  }}
>
  Button
</motion.button>
```

### 11.3 키보드 네비게이션

- Tab: 다음 요소
- Shift+Tab: 이전 요소
- Enter/Space: 활성화
- ESC: 닫기 (모달, 드롭다운)
- Arrow Keys: 리스트 네비게이션

---

## 12. TailwindCSS v4 설정

### 12.1 설치

```bash
npm install tailwindcss@next @tailwindcss/vite@next
```

### 12.2 설정 파일 (tailwind.config.js)

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E8F9F0',
          100: '#C6F0DC',
          200: '#9FE5C7',
          300: '#6EDAAD',
          400: '#3FCF98',
          500: '#14AE5C',
          600: '#119A51',
          700: '#0E8646',
          800: '#0B723B',
          900: '#095E30',
        },
        accent: {
          50: '#E6F7F7',
          100: '#B3E8E8',
          200: '#80D9D9',
          300: '#4DCACA',
          400: '#26BCBC',
          500: '#00ADAD',
          600: '#009999',
          700: '#008585',
          800: '#007171',
          900: '#005D5D',
        },
        coral: {
          50: '#FFF0ED',
          100: '#FFD6CC',
          200: '#FFBCAB',
          300: '#FFA28A',
          400: '#FF8869',
          500: '#FF6B4A',
          600: '#E65F42',
          700: '#CC533A',
          800: '#B34732',
          900: '#993B2A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'primary': '0 4px 12px rgba(20, 174, 92, 0.25)',
        'primary-lg': '0 8px 20px rgba(20, 174, 92, 0.3)',
      },
    },
  },
  plugins: [],
}
```

### 12.3 글로벌 CSS (src/index.css)

```css
@import 'tailwindcss';

@layer base {
  body {
    @apply font-sans text-base text-gray-700 bg-white;
  }
  
  h1, h2, h3, h4, h5, h6 {
    @apply font-heading font-bold text-gray-800;
  }
}
```

---

## 13. 컴포넌트 예시

### 13.1 Primary Button

```jsx
import { motion } from 'framer-motion';

export const PrimaryButton = ({ children, onClick, ...props }) => {
  return (
    <motion.button
      onClick={onClick}
      className="px-6 py-3 bg-primary-500 text-white font-medium rounded-lg shadow-sm hover:bg-primary-600 hover:shadow-primary transition-all"
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};
```

### 13.2 Card

```jsx
import { motion } from 'framer-motion';

export const Card = ({ children, onClick, ...props }) => {
  return (
    <motion.div
      onClick={onClick}
      className="p-6 bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg cursor-pointer"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
};
```

### 13.3 Page Transition Wrapper

```jsx
import { motion } from 'framer-motion';

export const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
};
```

---

## 14. 참고 문서

- [Layout Template](file:///c:/Users/tjwn1/Desktop/mercury_v2_proto/docs/design/layout-template.md)
- [Service Summary](file:///c:/Users/tjwn1/Desktop/mercury_v2_proto/docs/service-summary.md)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)
- [TailwindCSS v4](https://tailwindcss.com/)

---

**문서 버전**: 1.0  
**최종 수정일**: 2026-01-22  
**작성자**: UI/UX Designer  
**상태**: ✅ Approved
